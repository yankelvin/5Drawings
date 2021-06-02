import time
from flask import Flask, request

from model.cnn import Cnn

app = Flask(__name__)

cnn = Cnn()


@app.route('/api/predict', methods=['POST'])
def predict():
    raw_data = request.files['file']

    predict = cnn.predict(raw_data)

    return {'predict': predict}


@app.route("/api/time")
def hello():
    return {'time': time.time()}
