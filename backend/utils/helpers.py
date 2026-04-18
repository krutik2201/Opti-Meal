"""
OptiMeal - Helper Utilities
=============================
Reusable, standalone utility functions shared across the backend.
These have no dependency on Flask or any service module.
"""

from datetime import datetime


def round_safe(value: float, decimals: int = 2) -> float:
    """
    Safely rounds a numeric value. Returns 0.0 if value is None.

    Args:
        value    (float): The number to round.
        decimals (int):   Number of decimal places. Default is 2.

    Returns:
        float: Rounded value.
    """
    if value is None:
        return 0.0
    return round(float(value), decimals)


def current_timestamp() -> str:
    """
    Returns the current UTC timestamp as an ISO 8601 string.

    Returns:
        str: e.g. "2024-04-17T10:30:00"
    """
    return datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%S")


def build_success_response(data: dict, message: str = "OK") -> dict:
    """
    Wraps a response payload in a standard success envelope.

    Args:
        data    (dict): The actual response payload.
        message (str):  A human-readable status message.

    Returns:
        dict: { "status": "success", "message": ..., "timestamp": ..., "data": ... }
    """
    return {
        "status": "success",
        "message": message,
        "timestamp": current_timestamp(),
        "data": data,
    }


def build_error_response(error_message: str) -> dict:
    """
    Wraps an error in a standard error envelope.

    Args:
        error_message (str): The error description.

    Returns:
        dict: { "status": "error", "message": ..., "timestamp": ... }
    """
    return {
        "status": "error",
        "message": error_message,
        "timestamp": current_timestamp(),
    }


def percentage(part: float, whole: float, decimals: int = 2) -> float:
    """
    Safely compute a percentage value.

    Args:
        part     (float): The numerator.
        whole    (float): The denominator.
        decimals (int):   Decimal places to round to.

    Returns:
        float: The percentage, or 0.0 if whole is zero.
    """
    if whole == 0:
        return 0.0
    return round((part / whole) * 100, decimals)
