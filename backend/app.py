from flask import Flask, jsonify
from flask_cors import CORS
import os

from models import db, Vendor, MenuItem
from routes.orders import orders_bp

def create_app():
    app = Flask(__name__)
    
    # Configuration
    basedir = os.path.abspath(os.path.dirname(__file__))
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(basedir, 'optimeal.db')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['SECRET_KEY'] = 'dev-key-123'

    # Plugins
    CORS(app)
    db.init_app(app)

    # Blueprints
    app.register_blueprint(orders_bp, url_prefix="/api")

    # Initialize Database & Seed Data
    with app.app_context():
        db.create_all()
        seed_data()

    @app.route("/health")
    def health():
        return jsonify({"status": "healthy", "service": "OptiMeal Core API"}), 200

    return app

def seed_data():
    """Seeds initial vendors and menu items if they don't exist."""
    if Vendor.query.first():
        return # Already seeded
    
    v1 = Vendor(name="Main Canteen", college="IIT Bombay", emoji="🍛")
    v2 = Vendor(name="Campus Café", college="IIT Bombay", emoji="☕")
    v3 = Vendor(name="Juice Center", college="BITS Pilani", emoji="🥤")
    
    db.session.add_all([v1, v2, v3])
    db.session.commit()
    
    m1 = MenuItem(vendor_id=v1.id, name="Samosa", price=20, prep_time=5, emoji="🥟")
    m2 = MenuItem(vendor_id=v1.id, name="Veg Thali", price=80, prep_time=12, emoji="🍱")
    m3 = MenuItem(vendor_id=v2.id, name="Sandwich", price=45, prep_time=7, emoji="🥪")
    m4 = MenuItem(vendor_id=v2.id, name="Masala Tea", price=15, prep_time=3, emoji="☕")
    m5 = MenuItem(vendor_id=v3.id, name="Mango Shake", price=50, prep_time=5, emoji="🥭")
    
    db.session.add_all([m1, m2, m3, m4, m5])
    db.session.commit()
    print("Database seeded successfully!")

if __name__ == "__main__":
    app = create_app()
    app.run(debug=True, port=5000)
