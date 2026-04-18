"""
OptiMeal - Waste Analysis Routes
===================================
Handles all HTTP endpoints related to food waste calculation and reporting.

Routes:
    POST /api/waste-analysis         — Analyze waste for one or more items.
    GET  /api/waste-analysis/sample  — Return a sample request payload.
"""

from flask import Blueprint, request, jsonify
from services.waste_analyzer import analyze_waste, analyze_multiple_waste

waste_bp = Blueprint("waste", __name__)


# ---------------------------------------------------------------------------
# POST /api/waste-analysis
# ---------------------------------------------------------------------------
@waste_bp.route("/waste-analysis", methods=["POST"])
def waste_analysis():
    """
    Compute waste metrics by comparing predicted vs. actual consumption.

    Accepts two formats:

    Format A — Single item:
    ```json
    {
        "item": "Rice",
        "predicted": 97,
        "actual": 80
    }
    ```

    Format B — Multiple items (batch):
    ```json
    {
        "comparisons": [
            { "item": "Rice",    "predicted": 97, "actual": 80 },
            { "item": "Chapati", "predicted": 52, "actual": 50 }
        ]
    }
    ```

    Returns:
        200: Waste analysis result(s) with aggregate summary.
        400: Validation error with a descriptive message.
        415: Non-JSON request body.
    """
    body = request.get_json(silent=True)
    if body is None:
        return jsonify({
            "error": "Request body must be valid JSON with Content-Type: application/json."
        }), 415

    try:
        # --- Batch Mode ---
        if "comparisons" in body:
            comparisons = body["comparisons"]
            if not isinstance(comparisons, list) or len(comparisons) == 0:
                raise ValueError("'comparisons' must be a non-empty list of comparison objects.")
            result = analyze_multiple_waste(comparisons)
            return jsonify(result), 200

        # --- Single Item Mode ---
        item      = body.get("item")
        predicted = body.get("predicted")
        actual    = body.get("actual")

        if item is None or predicted is None or actual is None:
            raise ValueError(
                "Requests require 'item' (string), 'predicted' (number), and 'actual' (number)."
            )

        result = analyze_waste(item, float(predicted), float(actual))
        return jsonify(result), 200

    except (ValueError, TypeError) as e:
        return jsonify({"error": str(e)}), 400


# ---------------------------------------------------------------------------
# GET /api/waste-analysis/sample
# ---------------------------------------------------------------------------
@waste_bp.route("/waste-analysis/sample", methods=["GET"])
def waste_sample():
    """
    Returns a sample request payload for /api/waste-analysis.
    """
    return jsonify({
        "description": "Copy this body and POST it to /api/waste-analysis",
        "single_item_example": {
            "item": "Rice",
            "predicted": 97,
            "actual": 80,
        },
        "batch_example": {
            "comparisons": [
                {"item": "Rice",    "predicted": 97, "actual": 80},
                {"item": "Chapati", "predicted": 52, "actual": 50},
                {"item": "Dal",     "predicted": 48, "actual": 48},
            ]
        },
    }), 200
