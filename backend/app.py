import os
from flask import Flask, request, jsonify
from flask_cors import CORS

# 🔥 SAFE IMPORT (prevents crash)
try:
    from bias_detector import analyze_dataset
except Exception as e:
    print("IMPORT ERROR:", e)
    analyze_dataset = None

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

# -------------------------------
# HEALTH CHECK
# -------------------------------
@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "message": "🚀 Vision Codex API is running!",
        "status": "active"
    })

# -------------------------------
# STATUS
# -------------------------------
@app.route("/api/status", methods=["GET"])
def status():
    return jsonify({
        "status": "running"
    })

# -------------------------------
# UPLOAD API
# -------------------------------
@app.route("/api/upload", methods=["POST"])
def upload_file():
    try:
        if analyze_dataset is None:
            return jsonify({
                "success": False,
                "error": "analyze_dataset not loaded"
            }), 500

        if 'file' not in request.files:
            return jsonify({"error": "No file"}), 400

        file = request.files['file']
        domain = request.form.get('domain', 'General')

        result = analyze_dataset(file, domain)

        return jsonify({
            "success": True,
            "data": result
        })

    except Exception as e:
        print("ERROR:", str(e))
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

# -------------------------------
# RUN
# -------------------------------
if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=int(os.environ.get("PORT", 10000))
    )