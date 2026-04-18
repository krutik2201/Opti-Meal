"""
OptiMeal SaaS – Shops & Analytics Routes
==========================================
Provides multi-vendor shop listing and aggregated admin analytics.

Routes:
    GET /api/shops              — Return all vendor shops.
    GET /api/shops/<shop_id>    — Return a single shop's detail.
    GET /api/analytics          — Return platform-wide admin summary.
"""

import json
import os
from flask import Blueprint, jsonify

shops_bp = Blueprint("shops", __name__)

_SHOPS_FILE = os.path.join(os.path.dirname(__file__), "..", "data", "shops.json")


def _load_shops() -> list:
    with open(_SHOPS_FILE, "r", encoding="utf-8") as f:
        return json.load(f)


# ---------------------------------------------------------------------------
# GET /api/shops
# ---------------------------------------------------------------------------
@shops_bp.route("/shops", methods=["GET"])
def get_shops():
    """
    Returns the list of all registered vendor shops on the platform.
    Each shop includes menu, crowd level, location, and efficiency data.

    Used by:
        - Student Dashboard: to browse available shops
        - Vendor Dashboard: dropdown to select your shop
        - Admin Dashboard: vendor performance overview
    """
    shops = _load_shops()
    return jsonify({
        "count": len(shops),
        "shops": shops,
    }), 200


# ---------------------------------------------------------------------------
# GET /api/shops/<shop_id>
# ---------------------------------------------------------------------------
@shops_bp.route("/shops/<string:shop_id>", methods=["GET"])
def get_shop(shop_id: str):
    """
    Returns detailed data for a single shop including sample history
    (pre-filled values for the vendor's prediction form).
    """
    shops = _load_shops()
    match = next((s for s in shops if s["id"] == shop_id), None)
    if not match:
        return jsonify({
            "error": f"Shop '{shop_id}' not found.",
            "available_ids": [s["id"] for s in shops],
        }), 404
    return jsonify(match), 200


# ---------------------------------------------------------------------------
# GET /api/analytics
# ---------------------------------------------------------------------------
@shops_bp.route("/analytics", methods=["GET"])
def get_analytics():
    """
    Returns a platform-wide summary for the Admin Dashboard.

    Aggregates across all shops:
        - total_waste_reduced_kg  : sum of weekly waste reduced
        - active_vendors          : count of active shops
        - platform_efficiency     : weighted average efficiency %
        - total_prepared          : total units prepared across all shops
        - total_consumed          : total units consumed
        - shop_performance        : per-shop efficiency rankings
    """
    shops = _load_shops()
    active = [s for s in shops if s.get("active", False)]

    total_waste   = round(sum(s["weekly_waste_reduced_kg"] for s in active), 1)
    total_prep    = sum(s["total_prepared"] for s in active)
    total_cons    = sum(s["total_consumed"] for s in active)
    platform_eff  = round((total_cons / total_prep * 100), 1) if total_prep > 0 else 0

    # Shop performance table — sorted best to worst
    performance = sorted(
        [
            {
                "shop_id":       s["id"],
                "shop_name":     s["name"],
                "efficiency":    s["efficiency_rate"],
                "waste_reduced": s["weekly_waste_reduced_kg"],
                "crowd_level":   s["crowd_level"],
            }
            for s in active
        ],
        key=lambda x: x["efficiency"],
        reverse=True,
    )

    # Crowd distribution summary
    crowd_counts = {}
    for s in active:
        level = s.get("crowd_level", "Unknown")
        crowd_counts[level] = crowd_counts.get(level, 0) + 1

    return jsonify({
        "summary": {
            "active_vendors":         len(active),
            "total_waste_reduced_kg": total_waste,
            "platform_efficiency":    platform_eff,
            "total_prepared":         total_prep,
            "total_consumed":         total_cons,
            "total_wasted":           total_prep - total_cons,
        },
        "shop_performance": performance,
        "crowd_distribution": crowd_counts,
    }), 200
