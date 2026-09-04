"""
Root entry point for Cloud Deployment (Render / Railway / Heroku)
Delegates to the Capstone Project Flask application.
"""
import os
import sys
import importlib.util

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
capstone_path = os.path.join(BASE_DIR, "CAPSTONE PROJECT", "app.py")

if os.path.exists(capstone_path):
    spec = importlib.util.spec_from_file_location("capstone_app", capstone_path)
    capstone_module = importlib.util.module_from_spec(spec)
    sys.modules["capstone_app"] = capstone_module
    spec.loader.exec_module(capstone_module)
    app = capstone_module.app
else:
    raise FileNotFoundError(f"Could not find {capstone_path}")

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    print(f"🚀 AI Campus Assistant starting on port {port}...")
    app.run(host="0.0.0.0", port=port, debug=False)
