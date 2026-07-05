from flask import Flask, request, jsonify
import requests
import os

app = Flask(__name__)

BACKEND_URL = os.environ.get("BACKEND_URL")

@app.route('/api/predict/pdf', methods=['POST'])
def proxy_pdf():
    if 'file' not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files['file']

    try:
        resp = requests.post(
            f"{BACKEND_URL}/predict/pdf",
            files={"file": (file.filename, file.stream, file.mimetype)},
            timeout=60
        )
        return jsonify(resp.json()), resp.status_code
    except Exception as e:
        return jsonify({"error": str(e)}), 500