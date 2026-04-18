"""
OptiMeal - Application Configuration
=======================================
Centralizes all configuration constants.
Override these via environment variables in production.
"""

import os


class Config:
    """Base configuration shared by all environments."""
    DEBUG          = False
    TESTING        = False
    SECRET_KEY     = os.environ.get("SECRET_KEY", "optimeal-dev-secret-change-in-prod")
    JSON_SORT_KEYS = False          # Preserve key order in JSON responses
    PROPAGATE_EXCEPTIONS = True     # Surface full error tracebacks to Flask error handlers


class DevelopmentConfig(Config):
    """Development-specific settings."""
    DEBUG = True


class ProductionConfig(Config):
    """Production-specific settings."""
    DEBUG = False


# Active config — switch via FLASK_ENV environment variable
_configs = {
    "development": DevelopmentConfig,
    "production":  ProductionConfig,
}

ActiveConfig = _configs.get(os.environ.get("FLASK_ENV", "development"), DevelopmentConfig)
