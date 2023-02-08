import numpy as np
import pandas as pd
import sqlalchemy

from joblib import load

from connection_str import STR

MODEL_ASHA =  'data_model_rf_asha.joblib'
MODEL_FULL = 'data_model_rf_full.joblib'

NEEDED_FEATURES = 'NeededFeatureList.csv'

def perform_predict(forming_data, study_id):

    # #########################################################################################################
    #
    # Read features which are needed by the model
    #
    # #########################################################################################################

    features_needed = pd.read_csv(NEEDED_FEATURES)
    needed_feature_list = (features_needed['features']).tolist()

    # #########################################################################################################
    #
    # Encode Categorical - For full data.
    #
    # #########################################################################################################

    cols = forming_data.columns
    num_cols = list(forming_data.select_dtypes(include=[np.number]).columns.values)
    categorical_col_names = list(set(cols) - set(num_cols))

    forming_data = pd.get_dummies(forming_data, columns=categorical_col_names)

    # #########################################################################################################
    #
    # Find features which you dont have in your test set
    #
    # #########################################################################################################

    features_we_have = (forming_data.columns).tolist()
    set_difference = set(needed_feature_list) - set(features_we_have)
    list_difference = list(set_difference)

    # #########################################################################################################
    #
    # Add in missing features
    #
    # #########################################################################################################

    for col in list_difference:
        forming_data[col] = 0

    # ##################################################################
    #
    # Narrow it down to only the needed features.
    #
    # ##################################################################

    X_subset = forming_data[needed_feature_list]

    # #########################################################################################################
    #
    # Load back the model .
    #
    # - Asha model.
    #
    # #########################################################################################################

    radm_clf = load(MODEL_ASHA)

    # ##################################################################
    #
    # Predict
    #
    # ##################################################################


    y_predict = radm_clf.predict_proba(X_subset)[:, 1]

    # ##################################################################
    #
    # result.
    #
    # ##################################################################

    score = (y_predict[0])
    rounded_score = str(round(score * 10, 2))

    # ##################################################################
    #
    # replace score in DB.
    #
    # ##################################################################

    engine = sqlalchemy.create_engine(STR)
    engine.execute("""Replace into avyantra_dev.sepsis_score_asha values( {0}, {1} )""".format(study_id,score))

    return rounded_score


def predict_full(X_subset, study_id):

    # #########################################################################################################
    #
    # Load back the model .
    #
    # - Full model.
    #
    # #########################################################################################################

    radm_clf = load(MODEL_FULL)

    # ##################################################################
    #
    # Predict
    #
    # ##################################################################

    # Debug to check if any NaNs
    # print ( X_subset.columns[X_subset.isna().any()].tolist() )

    y_predict = radm_clf.predict_proba(X_subset)[:, 1]

    # ##################################################################
    #
    # result.
    #
    # ##################################################################

    score = (y_predict[0])
    rounded_score = str(round(score * 10, 2))

    # ##################################################################
    #
    # replace score in DB.
    #
    # ##################################################################

    engine = sqlalchemy.create_engine(STR)
    engine.execute("""Replace into avyantra_dev.sepsis_score_asha values( {0}, {1} )""".format(study_id,score))

    return rounded_score