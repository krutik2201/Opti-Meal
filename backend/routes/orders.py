from flask import Blueprint, request, jsonify
from models import db, Order, Vendor, MenuItem
from datetime import datetime, timedelta

orders_bp = Blueprint('orders', __name__)

# --- HELPERS ---
def calculate_queue_metrics(vendor_id):
    """Calculates wait time and rush level for a vendor."""
    active_orders = Order.query.filter(
        Order.vendor_id == vendor_id, 
        Order.status.in_(['pending', 'preparing'])
    ).count()
    
    # Simple logic: each active order adds 3 mins to base wait of 5 mins
    wait_time = 5 + (active_orders * 3)
    
    if active_orders < 5: rush_level = "Low"
    elif active_orders < 12: rush_level = "Medium"
    else: rush_level = "High"
    
    return wait_time, rush_level

# --- ENDPOINTS ---

@orders_bp.route('/orders', methods=['POST'])
def place_order():
    """Step 1: Student places order."""
    data = request.json
    
    # Check slot capacity (Simple rule: max 20 orders per slot per vendor)
    slot_count = Order.query.filter_by(
        vendor_id=data['vendor_id'], 
        pickup_slot=data['pickup_slot']
    ).count()
    
    if slot_count >= 20:
        return jsonify({"error": "This pickup slot is full. Please select another time."}), 400

    new_order = Order(
        student_id=data['student_id'],
        vendor_id=data['vendor_id'],
        items=data['items'],
        total_price=sum(item['price'] * item['quantity'] for item in data['items']),
        pickup_slot=data['pickup_slot'],
        is_express=data.get('is_express', False),
        status='pending'
    )
    
    db.session.add(new_order)
    db.session.commit()
    
    return jsonify(new_order.to_dict()), 201

@orders_bp.route('/vendor/orders', methods=['GET'])
def get_vendor_orders():
    """Step 3: Vendor receives orders."""
    vendor_id = request.args.get('vendor_id')
    if not vendor_id:
        return jsonify({"error": "vendor_id required"}), 400
        
    orders = Order.query.filter_by(vendor_id=vendor_id)\
        .order_by(Order.created_at.desc()).all()
        
    return jsonify([o.to_dict() for o in orders]), 200

@orders_bp.route('/orders/<int:order_id>/status', methods=['PUT'])
def update_status(order_id):
    """Step 4: Vendor updates status."""
    data = request.json
    new_status = data.get('status')
    
    order = Order.query.get_or_404(order_id)
    order.status = new_status
    
    db.session.commit()
    return jsonify(order.to_dict()), 200

@orders_bp.route('/orders/<int:order_id>', methods=['GET'])
def track_order(order_id):
    """Step 5: Student tracks order."""
    order = Order.query.get_or_404(order_id)
    
    # Calculate estimated time based on current vendor load
    wait_time, _ = calculate_queue_metrics(order.vendor_id)
    
    # If already ready, wait time is 0
    if order.status == 'ready': wait_time = 0
    elif order.status == 'completed': wait_time = 0
    
    response = order.to_dict()
    response['estimated_ready_mins'] = wait_time
    
    return jsonify(response), 200

@orders_bp.route('/admin/dashboard', methods=['GET'])
def admin_dashboard():
    """Step 6: Admin View (Aggregated Data)."""
    today = datetime.utcnow().date()
    
    orders_today = Order.query.filter(db.func.date(Order.created_at) == today).all()
    
    active_orders = len([o for o in orders_today if o.status in ['pending', 'preparing']])
    completed_orders = len([o for o in orders_today if o.status == 'completed'])
    total_revenue = sum(o.total_price for o in orders_today)
    
    # Peak hour logic (count orders per hour)
    hour_counts = {}
    for o in orders_today:
        hr = o.created_at.strftime('%I %p')
        hour_counts[hr] = hour_counts.get(hr, 0) + 1
    
    # Top items logic
    item_counts = {}
    for o in orders_today:
        for item in o.items:
            name = item['name']
            item_counts[name] = item_counts.get(name, 0) + item['quantity']
            
    # Vendor performance (count orders per vendor)
    vendor_stats = []
    vendors = Vendor.query.all()
    for v in vendors:
        v_orders = [o for o in orders_today if o.vendor_id == v.id]
        wait, rush = calculate_queue_metrics(v.id)
        vendor_stats.append({
            "name": v.name,
            "orders": len(v_orders),
            "current_wait": wait,
            "rush_level": rush
        })

    return jsonify({
        "total_orders_today": len(orders_today),
        "active_orders": active_orders,
        "completed_orders": completed_orders,
        "total_revenue": total_revenue,
        "vendors_count": len(vendors),
        "peak_hour_data": [{"hour": hr, "orders": count} for hr, count in hour_counts.items()],
        "top_items": sorted([{"name": k, "count": v} for k, v in item_counts.items()], key=lambda x: x['count'], reverse=True)[:5],
        "vendor_performance": vendor_stats
    }), 200
