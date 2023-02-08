import pandas as pd
from scipy import stats as s
import numpy as np

def get_clean_data_full(full_df):

    def clean_data(col_name):
        for index, row in full_df.iterrows():
            s = full_df[col_name][index]

            if (type(s) == str):
                # Check for patterns like X...X
                tripledot = s.split("...")
                if (len(tripledot) >= 2):
                    newString = tripledot[0] + '.' + tripledot[1]
                    full_df[col_name][index] = newString

                # Take value again and Check for patterns like X..X
                s = full_df[col_name][index]

                doubledot = s.split("..")
                if (len(doubledot) >= 2):
                    newString = doubledot[0] + '.' + doubledot[1]
                    full_df[col_name][index] = newString

                # Take value again and now chek for patterns like X.X.X
                s = full_df[col_name][index]

                parts = s.split(".")
                if (len(parts) >= 3):
                    newString = parts[0] + '.' + parts[1]
                    full_df[col_name][index] = newString

                # Take value again and now chek for patterns like X X.X
                s = full_df[col_name][index]

                emptyspace = s.split(" ")
                if (len(emptyspace) >= 2):
                    newString = emptyspace[0]
                    full_df[col_name][index] = newString

    #
    # Numeric cols in the data
    #

    numeric_col_names = ['Baby Weight At Admission', 'Baby Blood Glucose', 'Baby Haemoglobin Levels', 'Sodium',
                         'Total Leucocute Count',
                         'Baby Reactive Protien Levels', 'Potassium', 'Chlorine', 'Calcium', 'Creatinine',
                         'Bilirubin Levels',
                         'Heart Rate', 'Breathing Rate', 'Baby Gestational Age', 'Absolute Neutrophil Count',
                         'Baby Blood Pressure Mean Arterial Bp', 'Baby Blood Pressure Lower Limb',
                         'Baby Age at Admission',
                         'Thrombocytopeni', 'Oxygen Saturation', 'Baby Weight At Birth'
                         ]

    #
    # Clean numeric cols and coerce it to number.
    #

    for i in numeric_col_names:
        clean_data(i)
        full_df[i] = pd.to_numeric(full_df[i], errors='coerce')


    return full_df


def get_forming_data_full(initial_df):

    NEEDED_FEATURES = 'NeededFeatureListFull.csv'

    full_df = get_clean_data_full(initial_df)
    forming_data = []
    numeric_col_list = list()

    # Baby Age at Admission, Baby Weight At Admission -
    # These variable are multiple records, But didnt find multiple values in data. Also
    # We can aggregate and take last value to form one record per baby

    forming_data = full_df.groupby(
        ['Study Id' ], as_index=False).agg({
                                            'study_id': 'first', 'hospital_type' : 'first',
                                            'Baby Gestational Age':'first', 'Smelly Amniotic Fluid':'first',
                                            'Baby Weight At Birth': 'last','Baby Age at Admission':'last',
                                            'Baby Weight At Admission':'last', 'Gbs Infection':'last',
                                            'Leaking pv':'last'
                                        })
    #
    # Utils
    #

    # Functions to code the multi level fields
    def is_all_same(list1):
        previous = list1[0]
        for item in list1:
            if previous != item:
                return False
        return True


    def is_first_last_same(list1):
        if list1[0] == list1[-1]:
            return True
        else:
            return False


    def is_ascending(list1):
        previous = list1[0]
        for number in list1:
            if number < previous:
                return False
            previous = number
        return True


    def is_descending(list1):
        previous = list1[0]
        for number in list1:
            if number > previous:
                return False
            previous = number
        return True


    def check_special_values(list1, val1, val2):
        previous = list1[0]
        for fieldValue in list1:
            if fieldValue == val1:
                return val1
            elif fieldValue == val2:
                return val2
        return previous


    def form_single_feature(col_name, col_type):
        forming_data[col_name] = ""
        forming_data[col_name + '_value'] = ""

        if (col_type == 'Numeric'):
            numeric_col_list.append(col_name + '_value')

        for index, row in forming_data.iterrows():
            temp_df = full_df.loc[full_df['Study Id'].isin([forming_data['Study Id'][index]])]

            feature_val = 'No Change'
            temp_df[col_name].fillna(0, inplace=True)
            temp_df[col_name].replace('NA', 0, inplace=True)
            data_value = list(temp_df[col_name])

            if (len(temp_df) > 1):

                if (is_first_last_same(data_value)):
                    feature_val = 'No Change'
                elif (is_all_same(data_value)):
                    feature_val = 'No Change'
                elif (is_ascending(data_value)):
                    feature_val = 'Increasing'
                elif (is_descending(data_value)):
                    feature_val = 'Decreasing'
                else:
                    # multi trend cases
                    if (data_value[0] < data_value[-1]):
                        feature_val = 'Increasing'
                    elif (data_value[0] > data_value[-1]):
                        feature_val = 'Decreasing'

            forming_data[col_name][index] = feature_val

            if (col_type == 'Numeric'):
                forming_data[col_name + '_value'][index] = temp_df[col_name].mean()
            else:
                forming_data[col_name + '_value'][index] = int(s.mode(data_value)[0])


    #
    # Roll up the readings.
    #

    form_single_feature('Baby Blood Glucose', "Numeric")
    form_single_feature('Baby Blood Pressure Mean Arterial Bp', "Numeric")
    form_single_feature('Oxygen Saturation', "Numeric")
    form_single_feature('Breathing Rate', "Numeric")
    form_single_feature('Heart Rate', "Numeric")
    form_single_feature('Baby Haemoglobin Levels', "Numeric")
    form_single_feature('Baby Reactive Protien Levels', "Numeric")
    form_single_feature('Total Leucocute Count', "Numeric")
    form_single_feature('Absolute Neutrophil Count', "Numeric")
    form_single_feature('Thrombocytopeni', "Numeric")
    form_single_feature('Sodium', "Numeric")
    form_single_feature('Potassium', "Numeric")
    form_single_feature('Chlorine', "Numeric")
    form_single_feature('Calcium', "Numeric")
    form_single_feature('Creatinine', "Numeric")
    form_single_feature('Bilirubin Levels', "Numeric")
    form_single_feature('Baby Blood Pressure Lower Limb', "Numeric")



    # ##################################################################
    #
    # Impute data
    #
    # ##################################################################

    forming_data['Baby Age at Admission'].replace('NA', 0, inplace=True)
    forming_data['Baby Age at Admission'].replace('', 0, inplace=True)

    forming_data['Baby Gestational Age'].replace('NA', 0, inplace=True)
    forming_data['Baby Gestational Age'].replace('', 0, inplace=True)

    forming_data['Baby Weight At Birth'].replace('NA', 0, inplace=True)
    forming_data['Baby Weight At Birth'].replace('', 0, inplace=True)

    forming_data['Baby Weight At Admission'].replace('NA', 0, inplace=True)
    forming_data['Baby Weight At Admission'].replace('', 0, inplace=True)

    forming_data['Baby Age at Admission'].replace(np.NaN, 0, inplace=True)
    forming_data['Baby Gestational Age'].replace(np.NaN, 0, inplace=True)
    forming_data['Baby Weight At Birth'].replace(np.NaN, 0, inplace=True)
    forming_data['Baby Weight At Admission'].replace(np.NaN, 0, inplace=True)

    #
    # Baby appearance.
    #

    scale_mapper = {'Normal': 1,
                    'Dull': 2,
                    'Lethargic': 3}

    full_df['Baby Appearance'] = (full_df['Baby Appearance'].replace(scale_mapper))

    form_single_feature('Baby Appearance', "Categorical")

    # Bring back Fields values
    scale_mapper = {1: 'Normal',
                    2: 'Dull',
                    3: 'Lethargic'}

    forming_data['Baby Appearance_value'] = (forming_data['Baby Appearance_value'].replace(scale_mapper))

    #
    # Baby feeding status.
    #

    scale_mapper = {'Normal': 1,
                    'Poor': 2,
                    'No Feeding': 3}
    full_df['Baby Feeding Status'] = (full_df['Baby Feeding Status'].replace(scale_mapper))
    form_single_feature('Baby Feeding Status', "Categorical")

    scale_mapper = {1: 'Normal',
                    2: 'Poor',
                    3: 'No Feeding'}
    forming_data['Baby Feeding Status_value'] = (forming_data['Baby Feeding Status_value'].replace(scale_mapper))

    #
    # EOS / LOS / NA - Special coding
    #

    forming_data['Diagnosis (EOS/LOS/NA)'] = ""

    for index, row in forming_data.iterrows():
        temp_df = full_df.loc[full_df['Study Id'].isin([forming_data['Study Id'][index]])]

        temp_df['Diagnosis (EOS/LOS/NA)'].fillna('NA', inplace=True)
        temp_df['Diagnosis (EOS/LOS/NA)'].replace('NA', 'NA', inplace=True)

        data_value = list(temp_df['Diagnosis (EOS/LOS/NA)'])
        feature_val = check_special_values(data_value, 'EOS', 'LOS')

        forming_data['Diagnosis (EOS/LOS/NA)'][index] = feature_val

    #
    # Other variables.
    #

    forming_data['Smelly Amniotic Fluid'].fillna('NA', inplace=True)
    forming_data['Gbs Infection'].fillna('NA', inplace=True)
    forming_data['Leaking pv'].fillna('NA', inplace=True)

    # Pivot by these columns. i.e take on the last value
    numeric_piv_cols = ['Baby Weight At Admission', 'Baby Weight At Birth', 'Baby Age at Admission',
                        'Baby Gestational Age']

    #
    # Drop Study ID
    #

    forming_data.drop(['Study Id'], axis=1, inplace=True)

    #
    # Prepare the final list of numeric cols.
    #

    num_cols = numeric_piv_cols + numeric_col_list
    cols = forming_data.columns

    #
    # Encode Categorical
    #

    categorical_col_names = list(set(cols) - set(num_cols))
    forming_data = pd.get_dummies(forming_data, columns = categorical_col_names)

    #
    # Read feaures which are needed by the model
    #

    features_needed = pd.read_csv(NEEDED_FEATURES)
    needed_feature_list = (features_needed['features']).tolist()

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

    return X_subset
