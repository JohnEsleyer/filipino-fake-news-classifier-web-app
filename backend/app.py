from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
import tensorflow as tf
import numpy as np
from transformers import TFAutoModelForSequenceClassification, AutoTokenizer

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

loaded_model = TFAutoModelForSequenceClassification.from_pretrained('bert_model_fake_news')
loaded_tokenizer = AutoTokenizer.from_pretrained('bert_model_fake_news')

def predict_label(text):
    input_encoding = loaded_tokenizer(text, truncation=True, padding=True, max_length=128, return_tensors='tf')
    input_encoding = {key: np.array(value) for key, value in input_encoding.items()}
    prediction = loaded_model.predict(input_encoding)
    predicted_label = tf.argmax(prediction.logits, axis=1).numpy()[0]

    return predicted_label

@app.route('/', methods=['POST'])
def predict():
    data = request.get_json()
    user_input = data.get('user_input', '')
    predicted_label = predict_label(user_input)
    label_text = "Fake News" if predicted_label == 1 else "Not Fake News"

    response = {
        'user_input': user_input,
        'label_text': label_text
    }

    return jsonify(response)

if __name__ == '__main__':
    app.run(debug=True)
