"""
OptiMeal - Prediction Routes
==============================
Handles all HTTP endpoints related to demand prediction and recommendations.

Routes:
    POST /api/predict        — Predict demand for one or more food items.
    GET  /api/predict/sample — Return a ready-to-use sample request payload.
"""

from flask import Blueprint, request, jsonify
from services.predictor import predict_demand, predict_multiple

predict_bp = Blueprint("predict", __name__)


# ---------------------------------------------------------------------------
# POST /api/predict
# ---------------------------------------------------------------------------
@predict_bp.route("/predict", methods=["POST"])
def predict():
    """
    Predict food demand and generate a preparation recommendation.

    The endpoint accepts two formats:

    Format A — Single item:
    ```json
    {
        "item": "Rice",
        "history": [80, 85, 78, 90, 88, 84, 86],
        "time_slot": "lunch"
    }
    ```

    Format B — Multiple items (batch):
    ```json
    {
        "items": [
            { "item": "Rice",  "history": [80, 85, 78, 90, 88, 84, 86], "time_slot": "lunch" },
            { "item": "Curry", "history": [40, 42, 38, 45, 44, 41, 43], "time_slot": "lunch" }
        ]
    }
    ```

    Returns:
        200: Prediction result(s).
        400: Validation error with a descriptive message.
        415: Unsupported media type (non-JSON request body).
    """
    body = request.get_json(silent=True)
    if body is None:
        return jsonify({
            "error": "Request body must be valid JSON with Content-Type: application/json."
        }), 415

    try:
        # --- Batch Mode ---
        if "items" in body:
            items = body["items"]
            if not isinstance(items, list) or len(items) == 0:
                raise ValueError("'items' must be a non-empty list of item objects.")
            results = predict_multiple(items)
            return jsonify({
                "mode": "batch",
                "count": len(results),
                "predictions": results,
            }), 200

        # --- Single Item Mode ---
        item      = body.get("item")
        history   = body.get("history")
        time_slot = body.get("time_slot")

        if not item or not history or not time_slot:
            raise ValueError(
                "Single-item requests require 'item', 'history' (7 values), and 'time_slot'."
            )

        result = predict_demand(item, history, time_slot)
        return jsonify({
            "mode": "single",
            "prediction": result,
        }), 200

    except ValueError as e:
        return jsonify({"error": str(e)}), 400


# ---------------------------------------------------------------------------
# GET /api/predict/sample
# ---------------------------------------------------------------------------
@predict_bp.route("/predict/sample", methods=["GET"])
def sample_request():
    """
    Returns a sample request payload for the /api/predict endpoint.
    Useful for demos, testing, and frontend integration.
    """
    return jsonify({
        "description": "Copy this body and POST it to /api/predict",
        "single_item_example": {
            "item": "Rice",
            "history": [80, 85, 78, 90, 88, 84, 86],
            "time_slot": "lunch",
        },
        "batch_example": {
            "items": [
                {
                    "item": "Rice",
                    "history": [80, 85, 78, 90, 88, 84, 86],
                    "time_slot": "lunch",
                },
                {
                    "item": "Chapati",
                    "history": [60, 58, 62, 65, 59, 61, 63],
                    "time_slot": "morning",
                },
                {
                    "item": "Dal",
                    "history": [50, 55, 48, 60, 52, 54, 57],
                    "time_slot": "evening",
                },
            ]
        },
        "valid_time_slots": ["morning", "lunch", "evening"],
    }), 200
