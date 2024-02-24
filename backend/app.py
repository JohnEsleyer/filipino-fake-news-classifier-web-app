from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
import numpy as np
from transformers import TFAutoModelForSequenceClassification, AutoTokenizer

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

model_path = 'fine_tuned_distilbert_model'
model = tf.saved_model.load(model_path)
tokenizer = AutoTokenizer.from_pretrained(model_path, do_lower_case=False)

def predict_label(text):
    input_tokens = tokenizer(text, truncation=True, padding='max_length', max_length=128, return_tensors='tf')
    output = model(input_tokens['input_ids'], training=False)
    probabilities = tf.nn.softmax(output, axis=-1)

    predicted_label = np.argmax(probabilities, axis=1).tolist() 
    confidence = np.max(probabilities)  

    return [predicted_label, confidence]


@app.route('/', methods=['POST'])
def predict():
    data = request.get_json()
    user_input = data.get('user_input', '')
    res = predict_label(user_input)
    predicted_label = res[0]
    confidence = res[1]

    label_text = "Fake News" if predicted_label[0] == 1 else "Not Fake News"

    response = {
        'user_input': user_input,
        'predicted_label': predicted_label,
        'label_text': label_text,
        'confidence': int(confidence * 100)
    }

    return jsonify(response)

if __name__ == '__main__':
    app.run(debug=True)
