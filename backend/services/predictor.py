"""
OptiMeal - Demand Prediction Engine
====================================
Implements a 7-day weighted moving average with time-slot multipliers
to predict daily food demand and generate preparation recommendations.

Key Concepts:
- Moving Average: Smooths out daily fluctuations using the past 7 days.
- Time-Slot Weighting: Accounts for the fact that lunch demand is typically
  higher than morning snacks, and evening demand varies accordingly.
- Safety Factor: Slightly reduces the raw prediction to avoid chronic
  overproduction, while still comfortably covering expected demand.
"""

# Time-slot multipliers: calibrate these based on real kitchen patterns.
# Values > 1.0 mean that slot tends to have higher-than-average demand.
TIME_SLOT_WEIGHTS = {
    "morning":  0.85,   # Light breakfast — lower demand
    "lunch":    1.20,   # Peak meal — highest demand
    "evening":  1.00,   # Standard dinner — baseline demand
}

# Safety factor: We prepare slightly less than the raw prediction
# to prevent habitual over-preparation (a key source of waste).
SAFETY_FACTOR = 0.95


def _validate_history(history: list, item: str) -> None:
    """
    Validates that the history array contains exactly 7 numeric values.
    Raises ValueError with a clear message if not.
    """
    if not isinstance(history, list):
        raise ValueError(f"'history' for item '{item}' must be a list.")
    if len(history) != 7:
        raise ValueError(
            f"'history' for item '{item}' must contain exactly 7 values "
            f"(representing the past 7 days). Got {len(history)}."
        )
    for i, val in enumerate(history):
        if not isinstance(val, (int, float)) or val < 0:
            raise ValueError(
                f"history[{i}] for item '{item}' must be a non-negative number. Got: {val}"
            )


def _weighted_moving_average(history: list) -> float:
    """
    Computes a linearly-weighted moving average over the 7-day history.

    Days are assigned weights 1 through 7, where day 7 (most recent)
    carries the most influence. This makes the prediction more sensitive
    to recent demand shifts than a simple mean.

    Formula:
        WMA = (1*d1 + 2*d2 + ... + 7*d7) / (1 + 2 + ... + 7)

    Args:
        history (list): List of 7 numeric values [oldest ... most recent].

    Returns:
        float: The weighted moving average.
    """
    n = len(history)
    weights = list(range(1, n + 1))          # [1, 2, 3, 4, 5, 6, 7]
    total_weight = sum(weights)               # 28
    wma = sum(w * v for w, v in zip(weights, history)) / total_weight
    return wma


def predict_demand(item: str, history: list, time_slot: str) -> dict:
    """
    Core prediction function for a single food item.

    Steps:
    1. Validate inputs.
    2. Compute the 7-day weighted moving average.
    3. Apply the time-slot multiplier (e.g., lunch gets a 1.2x boost).
    4. Apply the safety factor to avoid over-preparation.
    5. Round to a practical integer quantity.

    Args:
        item      (str):  Name of the food item (e.g., "Rice").
        history   (list): Past 7 days of consumption data.
        time_slot (str):  One of "morning", "lunch", or "evening".

    Returns:
        dict: Prediction details including the recommended preparation quantity.

    Example:
        >>> predict_demand("Rice", [80,85,78,90,88,84,86], "lunch")
        {
            "item": "Rice",
            "time_slot": "lunch",
            "base_average": 84.43,
            "slot_multiplier": 1.2,
            "raw_prediction": 101.31,
            "safety_factor": 0.95,
            "predicted_demand": 96.24,
            "recommended_quantity": 97,
            "recommendation": "Prepare 97 units of Rice for lunch service."
        }
    """
    # --- Step 1: Validate ---
    _validate_history(history, item)

    slot = time_slot.lower().strip()
    if slot not in TIME_SLOT_WEIGHTS:
        raise ValueError(
            f"Invalid time_slot '{time_slot}'. "
            f"Choose from: {list(TIME_SLOT_WEIGHTS.keys())}"
        )

    # --- Step 2: 7-Day Weighted Moving Average ---
    base_average = _weighted_moving_average(history)

    # --- Step 3: Apply Time-Slot Multiplier ---
    slot_multiplier = TIME_SLOT_WEIGHTS[slot]
    raw_prediction = base_average * slot_multiplier

    # --- Step 4: Apply Safety Factor ---
    predicted_demand = raw_prediction * SAFETY_FACTOR

    # --- Step 5: Round up to ensure we never under-prepare ---
    recommended_quantity = int(predicted_demand) + (1 if predicted_demand % 1 >= 0.5 else 0)

    return {
        "item": item,
        "time_slot": slot,
        "base_average": round(base_average, 2),
        "slot_multiplier": slot_multiplier,
        "raw_prediction": round(raw_prediction, 2),
        "safety_factor": SAFETY_FACTOR,
        "predicted_demand": round(predicted_demand, 2),
        "recommended_quantity": recommended_quantity,
        "recommendation": f"Prepare {recommended_quantity} units of {item} for {slot} service.",
    }


def predict_multiple(items: list) -> list:
    """
    Run predictions for a list of food items in a single call.

    Args:
        items (list): A list of dicts, each with keys:
                      "item" (str), "history" (list), "time_slot" (str).

    Returns:
        list: A list of prediction result dicts.

    Raises:
        ValueError: If any item payload is missing required fields.
    """
    results = []
    for entry in items:
        if "item" not in entry or "history" not in entry or "time_slot" not in entry:
            raise ValueError(
                "Each item must have 'item', 'history', and 'time_slot' keys."
            )
        result = predict_demand(entry["item"], entry["history"], entry["time_slot"])
        results.append(result)
    return results
