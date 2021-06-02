import time
from flask import Flask, request
from flask_cors import CORS, cross_origin

from model.cnn import Cnn

app = Flask(__name__)
cors = CORS(app, resources={r"/api/*": {"origins": "*"}})

cnn = Cnn()


@app.route('/api/predict', methods=['POST'])
@cross_origin()
def predict():
    raw_data = request.files['file']

    predict = cnn.predict(raw_data)

    return {'predict': predict}


@app.route("/api/time")
def hello():
    return {'time': time.time()}
