"""
OptiMeal - Waste Analysis Engine
==================================
Provides logic to compare predicted demand against actual consumption
to compute key waste metrics.

Key Metrics:
- Waste Quantity : How much food (in units) went to waste.
- Waste Percentage: Waste as a proportion of what was prepared.
- Efficiency Rate : What percentage of prepared food was actually consumed.
- Status Label    : A human-readable assessment (e.g., "Good", "High Waste").

Design Note:
    "Waste" is defined here as food that was PREPARED but NOT consumed.
    If actual > predicted, there is NO waste from a preparation standpoint
    (the kitchen ran short), but we flag it separately as an underestimation.
"""


def _classify_waste(waste_pct: float) -> dict:
    """
    Returns a status label and an actionable tip based on the waste percentage.

    Thresholds are calibrated for small-scale kitchens where any waste
    above 15% is considered operationally significant.

    Args:
        waste_pct (float): Waste percentage (0-100).

    Returns:
        dict: {"status": str, "tip": str}
    """
    if waste_pct <= 0:
        return {
            "status": "No Waste / Shortage",
            "tip": (
                "Actual consumption met or exceeded prediction. "
                "Consider increasing preparation quantities slightly to avoid shortage."
            ),
        }
    elif waste_pct <= 5:
        return {
            "status": "Excellent",
            "tip": "Minimal waste. Current prediction model is well-calibrated.",
        }
    elif waste_pct <= 15:
        return {
            "status": "Good",
            "tip": "Acceptable waste level. Monitor trends over the next few days.",
        }
    elif waste_pct <= 30:
        return {
            "status": "Moderate Waste",
            "tip": (
                "Preparation is noticeably exceeding demand. "
                "Consider lowering your safety buffer or reviewing historical data for outliers."
            ),
        }
    else:
        return {
            "status": "High Waste",
            "tip": (
                "Significant overproduction detected. "
                "Review portion sizes and recalibrate predictions for this item and time slot."
            ),
        }


def analyze_waste(item: str, predicted: float, actual: float) -> dict:
    """
    Analyzes waste for a single food item.

    Args:
        item      (str):   Name of the food item.
        predicted (float): The quantity that was prepared / predicted.
        actual    (float): The quantity that was actually consumed.

    Returns:
        dict: A comprehensive waste analysis report for the item.

    Raises:
        ValueError: If predicted or actual values are negative.

    Example:
        >>> analyze_waste("Rice", predicted=97, actual=80)
        {
            "item": "Rice",
            "predicted": 97,
            "actual": 80,
            "waste_quantity": 17,
            "waste_percentage": 17.53,
            "efficiency_rate": 82.47,
            "status": "Moderate Waste",
            "tip": "Preparation is noticeably exceeding demand..."
        }
    """
    if predicted < 0 or actual < 0:
        raise ValueError(
            f"'predicted' and 'actual' for item '{item}' must be non-negative numbers."
        )

    # Waste is only meaningful when we prepared MORE than was consumed.
    # If actual > predicted, the kitchen ran short — waste_quantity = 0.
    waste_quantity = max(0.0, predicted - actual)

    # Waste percentage is relative to what was prepared.
    if predicted > 0:
        waste_pct = round((waste_quantity / predicted) * 100, 2)
        efficiency_rate = round((min(actual, predicted) / predicted) * 100, 2)
    else:
        waste_pct = 0.0
        efficiency_rate = 0.0

    classification = _classify_waste(waste_pct)

    return {
        "item": item,
        "predicted": predicted,
        "actual": actual,
        "waste_quantity": round(waste_quantity, 2),
        "waste_percentage": waste_pct,
        "efficiency_rate": efficiency_rate,
        "status": classification["status"],
        "tip": classification["tip"],
    }


def analyze_multiple_waste(comparisons: list) -> dict:
    """
    Runs waste analysis across multiple items and computes aggregate metrics.

    Args:
        comparisons (list): A list of dicts, each with keys:
                            "item" (str), "predicted" (float), "actual" (float).

    Returns:
        dict: Item-level results + summary statistics for the batch.

    Raises:
        ValueError: If any comparison entry is missing required fields.
    """
    item_results = []
    total_prepared = 0.0
    total_consumed = 0.0
    total_wasted = 0.0

    for entry in comparisons:
        if "item" not in entry or "predicted" not in entry or "actual" not in entry:
            raise ValueError(
                "Each comparison entry must have 'item', 'predicted', and 'actual' keys."
            )

        result = analyze_waste(entry["item"], entry["predicted"], entry["actual"])
        item_results.append(result)

        total_prepared += entry["predicted"]
        total_consumed += entry["actual"]
        total_wasted += result["waste_quantity"]

    # Aggregate summary
    overall_waste_pct = (
        round((total_wasted / total_prepared) * 100, 2) if total_prepared > 0 else 0.0
    )
    overall_efficiency = (
        round((total_consumed / total_prepared) * 100, 2) if total_prepared > 0 else 0.0
    )
    overall_classification = _classify_waste(overall_waste_pct)

    return {
        "results": item_results,
        "summary": {
            "total_prepared": round(total_prepared, 2),
            "total_consumed": round(total_consumed, 2),
            "total_wasted": round(total_wasted, 2),
            "overall_waste_percentage": overall_waste_pct,
            "overall_efficiency_rate": overall_efficiency,
            "overall_status": overall_classification["status"],
            "overall_tip": overall_classification["tip"],
        },
    }
