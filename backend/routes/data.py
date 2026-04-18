"""
OptiMeal - Data Routes
========================
Provides read-only access to sample datasets and reference data.

Routes:
    GET /api/data              — Return the full sample dataset.
    GET /api/data/<item_name>  — Return historical data for one specific item.
"""

import json
import os
from flask import Blueprint, jsonify

data_bp = Blueprint("data", __name__)

# Resolve absolute path to the sample dataset
_DATA_FILE = os.path.join(os.path.dirname(__file__), "..", "data", "sample_data.json")


def _load_sample_data() -> list:
    """Reads and parses the sample_data.json file."""
    with open(_DATA_FILE, "r", encoding="utf-8") as f:
        return json.load(f)


# ---------------------------------------------------------------------------
# GET /api/data
# ---------------------------------------------------------------------------
@data_bp.route("/data", methods=["GET"])
def get_all_data():
    """
    Returns the full sample dataset of historical food consumption records.
    Each record represents one day's demand for one food item in one time slot.
    """
    try:
        data = _load_sample_data()
        return jsonify({
            "count": len(data),
            "dataset": data,
        }), 200
    except FileNotFoundError:
        return jsonify({"error": "Sample data file not found."}), 500


# ---------------------------------------------------------------------------
# GET /api/data/<item_name>
# ---------------------------------------------------------------------------
@data_bp.route("/data/<string:item_name>", methods=["GET"])
def get_item_data(item_name: str):
    """
    Filters the sample dataset to return records for a specific food item.

    Args:
        item_name (str): The food item name (case-insensitive, e.g. "rice").

    Returns:
        200: Filtered records and summary stats for the item.
        404: If no records exist for the given item.
    """
    try:
        data = _load_sample_data()
        filtered = [
            r for r in data
            if r.get("item", "").lower() == item_name.lower()
        ]

        if not filtered:
            return jsonify({
                "error": f"No data found for item '{item_name}'.",
                "available_items": list({r.get("item") for r in data}),
            }), 404

        # Compute basic summary stats per time slot
        summaries = {}
        for record in filtered:
            slot = record.get("time_slot", "unknown")
            if slot not in summaries:
                summaries[slot] = []
            summaries[slot].append(record.get("quantity", 0))

        stats = {
            slot: {
                "days_recorded": len(vals),
                "min": min(vals),
                "max": max(vals),
                "average": round(sum(vals) / len(vals), 2),
            }
            for slot, vals in summaries.items()
        }

        return jsonify({
            "item": item_name,
            "record_count": len(filtered),
            "stats_by_time_slot": stats,
            "records": filtered,
        }), 200

    except FileNotFoundError:
        return jsonify({"error": "Sample data file not found."}), 500
