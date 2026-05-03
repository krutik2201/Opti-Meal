from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class Vendor(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    college = db.Column(db.String(100))
    emoji = db.Column(db.String(10))
    load = db.Column(db.Integer, default=0) # 0-100
    avg_wait = db.Column(db.Integer, default=10)
    
    orders = db.relationship('Order', backref='vendor', lazy=True)

class MenuItem(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    vendor_id = db.Column(db.Integer, db.ForeignKey('vendor.id'), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    price = db.Column(db.Float, nullable=False)
    prep_time = db.Column(db.Integer, default=5) # minutes
    emoji = db.Column(db.String(10))
    available = db.Column(db.Boolean, default=True)

class Order(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.String(50), nullable=False)
    vendor_id = db.Column(db.Integer, db.ForeignKey('vendor.id'), nullable=False)
    items = db.Column(db.JSON, nullable=False) # List of {name, quantity, price}
    total_price = db.Column(db.Float, nullable=False)
    pickup_slot = db.Column(db.String(50), nullable=False)
    status = db.Column(db.String(20), default='pending') # pending, preparing, ready, completed
    is_express = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            "order_id": self.id,
            "student_id": self.student_id,
            "vendor_id": self.vendor_id,
            "vendor_name": self.vendor.name,
            "items": self.items,
            "total_price": self.total_price,
            "pickup_slot": self.pickup_slot,
            "status": self.status,
            "is_express": self.is_express,
            "created_at": self.created_at.isoformat()
        }
