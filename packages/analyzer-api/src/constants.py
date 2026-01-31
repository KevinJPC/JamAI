import os 

AUTH_SCHEME = "Bearer"
IS_DEBUG = os.environ.get("FLASK_DEBUG")
INTERNAL_API_KEY = os.environ.get("INTERNAL_API_KEY")
