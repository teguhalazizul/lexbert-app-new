from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch
import PyPDF2
import io
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

# Model dari Hugging Face
MODEL_NAME = "teguhalazizul/indobert-klasifikasi-putusan"

def load_model():
    print(f"Loading model from: {MODEL_NAME}")
    tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
    model = AutoModelForSequenceClassification.from_pretrained(MODEL_NAME)
    return tokenizer, model

# Load model
tokenizer, model = load_model()
print("Model loaded successfully!")

def extract_text_from_pdf(file):
    try:
        pdf_reader = PyPDF2.PdfReader(io.BytesIO(file.read()))
        text = ""
        for page in pdf_reader.pages:
            extracted = page.extract_text()
            if extracted:
                text += extracted + "\n"
        return text.strip()
    except Exception as e:
        print(f"Error extracting PDF: {e}")
        return ""

@app.route('/predict/pdf', methods=['POST'])
def predict_pdf():
    try:
        if 'file' not in request.files:
            return jsonify({"error": "No file uploaded"}), 400
        
        file = request.files['file']
        if file.filename == '':
            return jsonify({"error": "No file selected"}), 400
        
        text = extract_text_from_pdf(file)
        if not text:
            return jsonify({"error": "Could not extract text from PDF"}), 400
        
        print(f"Extracted text length: {len(text)} characters")
        
        inputs = tokenizer(
            text, 
            return_tensors="pt", 
            truncation=True, 
            max_length=512,
            padding=True
        )
        
        with torch.no_grad():
            outputs = model(**inputs)
            predictions = torch.softmax(outputs.logits, dim=-1)
        
        confidence = float(torch.max(predictions).item() * 100)
        class_id = int(torch.argmax(predictions).item())
        
        # Labels (sesuaikan dengan model Anda)
        labels = ["Korupsi", "Narkotika", "Perlindungan Anak", "Pencucian Uang", "Perdagangan Orang", "Terorisme"]
        classification = labels[class_id] if class_id < len(labels) else f"Kelas {class_id}"
        
        print(f"Prediction: {classification} (confidence: {confidence:.2f}%)")
        
        result = {
            "klasifikasi": classification,
            "confidence": confidence,
            "sub_klasifikasi": "Sub-kelas terkait",
            "pasal_dilanggar": "Pasal yang dilanggar",
            "jenis_hukuman": "Jenis hukuman",
            "lama_hukuman": "Lama hukuman",
            "preview_teks": text[:500] + ("..." if len(text) > 500 else "")
        }
        
        return jsonify(result)
        
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/health', methods=['GET'])
def health():
    return {"status": "ok", "model": MODEL_NAME}

if __name__ == '__main__':
    app.run(debug=True, port=8000)