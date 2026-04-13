import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from bias_detector import analyze_dataset

app = Flask(__name__)

# Enable CORS for frontend (React/Vite)
CORS(app)

# -------------------------------
# 🔥 HEALTH CHECK ROUTE
# -------------------------------
@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "message": "🚀 Vision Codex API is running!",
        "status": "active",
        "endpoints": {
            "upload": "/api/upload"
        }
    })


# -------------------------------
# 🔥 MAIN UPLOAD + ANALYSIS API
# -------------------------------
@app.route("/api/upload", methods=["POST"])
def upload_file():
    try:
        # Check file exists
        if 'file' not in request.files:
            return jsonify({
                "success": False,
                "error": "No file provided"
            }), 400

        file = request.files['file']
        domain = request.form.get('domain', 'General')

        # Check filename
        if file.filename == '':
            return jsonify({
                "success": False,
                "error": "No file selected"
            }), 400

        # Validate CSV
        if not file.filename.endswith('.csv'):
            return jsonify({
                "success": False,
                "error": "Only CSV files are supported"
            }), 400

        # 🔥 Run AI analysis
        analysis_data = analyze_dataset(file, domain)

        # Response structure (clean + frontend ready)
        return jsonify({
            "success": True,
            "message": "Dataset analyzed successfully 🚀",
            "filename": file.filename,
            "data": analysis_data
        }), 200

    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


# -------------------------------
# 🔥 OPTIONAL: SYSTEM STATUS API
# -------------------------------
@app.route("/api/status", methods=["GET"])
def status():
    return jsonify({
        "system": "Vision Codex",
        "status": "running",
        "version": "1.0",
        "features": [
            "Bias Detection",
            "AI Explanation",
            "Risk Scoring"
        ]
    })


# -------------------------------
# 🚀 RUN SERVER
# -------------------------------
if __name__ == "__main__":
    app.run(
        debug=True,
        host="0.0.0.0",
        port=5000
    )