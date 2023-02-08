# coding: utf-8
from flask import Flask, jsonify, request
from flask_cors import CORS
import uuid
import warnings

from clean_data_full import get_forming_data_full
from fetch_data import fetch_data, fetch_data_full
from predictor import perform_predict, predict_full
from clean_data import get_forming_data

warnings.filterwarnings('ignore')
APP = Flask(__name__)
APP.secret_key = uuid.uuid4().hex

CORS(APP)

@APP.route("/", methods=['GET'])
def home():

    return jsonify({
        'OK': 'OK'
    }), 200


@APP.route("/asha_score", methods=['POST'])
def asha_score():

    """

        Generate score

    """

    params = request.get_json()
    study_id = params['study_id']

    asha_data_df = fetch_data(study_id)
    forming_data = get_forming_data(asha_data_df)
    result = perform_predict(forming_data, study_id)

    return jsonify({
        'score': result
    }),200

@APP.route("/full_score", methods=['POST'])
def full_score():


    params = request.get_json()
    study_id = params['study_id']

    initial_df = fetch_data_full(study_id)
    X_subset = get_forming_data_full(initial_df)
    result = predict_full(X_subset, study_id)

    return jsonify({
        'score': result
    }),200

#
# Start the server
#
if __name__ == '__main__':
    APP.run(host='0.0.0.0', debug=True)

