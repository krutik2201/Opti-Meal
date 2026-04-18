"""
OptiMeal - Flask Application Entry Point
==========================================
This file creates and configures the Flask application.

Responsibilities:
- Load configuration from config.py
- Register all route blueprints under /api
- Add a root health-check endpoint
- Enable CORS (cross-origin requests from the React frontend)

Run locally:
    python app.py

Or with Flask CLI:
    $env:FLASK_ENV="development"
    flask run --port 5000
"""

from flask import Flask, jsonify
from flask_cors import CORS

from config import ActiveConfig
from routes.predict import predict_bp
from routes.waste   import waste_bp
from routes.data    import data_bp
from routes.shops   import shops_bp


def create_app():
    """
    Application factory pattern.
    Creates and returns a fully configured Flask app instance.
    """
    app = Flask(__name__)

    # Load configuration
    app.config.from_object(ActiveConfig)

    # Allow cross-origin requests from the React frontend on port 3000
    # Allow cross-origin requests from ANY origin on ALL routes.
    # This prevents CORS errors for both /api/* and /health.
    CORS(app,
         resources={r"/*": {"origins": "*"}},
         allow_headers=["Content-Type", "Authorization"],
         methods=["GET", "POST", "OPTIONS"])

    # -------------------------------------------------------------------------
    # Register Blueprints — all routes are namespaced under /api
    # -------------------------------------------------------------------------
    app.register_blueprint(predict_bp, url_prefix="/api")
    app.register_blueprint(waste_bp,   url_prefix="/api")
    app.register_blueprint(data_bp,    url_prefix="/api")
    app.register_blueprint(shops_bp,   url_prefix="/api")

    # -------------------------------------------------------------------------
    # Root Health Check Endpoint
    # -------------------------------------------------------------------------
    @app.route("/health", methods=["GET"])
    def health():
        """
        Lightweight status check.
        Can be used by load balancers or CI pipelines to verify the server is up.
        """
        return jsonify({
            "status": "healthy",
            "project": "OptiMeal – Food Demand & Waste Optimization System",
            "version": "1.0.0",
        }), 200

    # -------------------------------------------------------------------------
    # API Index — lists all available endpoints
    # -------------------------------------------------------------------------
    @app.route("/api", methods=["GET"])
    def api_index():
        """Returns a directory of all available API endpoints."""
        return jsonify({
            "message": "Welcome to the OptiMeal SaaS API",
            "version": "2.0.0",
            "endpoints": {
                "health_check":         "GET  /health",
                "predict_single":       "POST /api/predict",
                "predict_batch":        "POST /api/predict  (body: {items:[...]})",
                "waste_analysis":       "POST /api/waste-analysis",
                "all_data":             "GET  /api/data",
                "data_by_item":         "GET  /api/data/<item_name>",
                "all_shops":            "GET  /api/shops",
                "shop_detail":          "GET  /api/shops/<shop_id>",
                "admin_analytics":      "GET  /api/analytics",
            },
        }), 200

    # -------------------------------------------------------------------------
    # Global Error Handlers
    # -------------------------------------------------------------------------
    @app.errorhandler(404)
    def not_found(e):
        return jsonify({"error": "Endpoint not found.", "hint": "Check /api for the list of available endpoints."}), 404

    @app.errorhandler(405)
    def method_not_allowed(e):
        return jsonify({"error": "HTTP method not allowed on this endpoint."}), 405

    @app.errorhandler(500)
    def internal_error(e):
        return jsonify({"error": "An internal server error occurred."}), 500

    return app


# ---------------------------------------------------------------------------
# App Entry Point
# ---------------------------------------------------------------------------
if __name__ == "__main__":
    app = create_app()
    print("\n" + "=" * 60)
    print("  OptiMeal Backend is running!")
    print("  API Root   : http://127.0.0.1:5000/api")
    print("  Health     : http://127.0.0.1:5000/health")
    print("  Predict    : POST http://127.0.0.1:5000/api/predict")
    print("  Waste      : POST http://127.0.0.1:5000/api/waste-analysis")
    print("  Data       : GET  http://127.0.0.1:5000/api/data")
    print("=" * 60 + "\n")
    app.run(debug=ActiveConfig.DEBUG, port=5000)
