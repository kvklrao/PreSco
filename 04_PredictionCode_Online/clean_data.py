import pandas as pd
import numpy as np
from scipy import stats as s

def get_clean_data(asha_data_df):
# ###################################################################################
# Grab the numeric columns..
# ###################################################################################

    numeric_col_names = ['Rupture Of Membranes Rom One', 'Hypothermia Status Value',
                         'Baby Blood Pressure Mean Arterial Bp',
                         'Baby Blood Pressure Upper Limb', 'Baby Blood Pressure Lower Limb', 'Frequency Of Stools',
                         'Baby Blood Glucose', 'Baby Weight At Admission', 'Baby Weight At Birth']


    def clean_data(col_name):
        for index, row in asha_data_df.iterrows():
            s = asha_data_df[col_name][index]

            if (type(s) == str):
                # Check for patterns like X...X
                tripledot = s.split("...")
                if (len(tripledot) >= 2):
                    newString = tripledot[0] + '.' + tripledot[1]
                    asha_data_df[col_name][index] = newString

                # Take value again and Check for patterns like X..X
                s = asha_data_df[col_name][index]

                doubledot = s.split("..")
                if (len(doubledot) >= 2):
                    newString = doubledot[0] + '.' + doubledot[1]
                    asha_data_df[col_name][index] = newString

                # Take value again and now chek for patterns like X.X.X
                s = asha_data_df[col_name][index]

                parts = s.split(".")
                if (len(parts) >= 3):
                    newString = parts[0] + '.' + parts[1]
                    asha_data_df[col_name][index] = newString

                # Take value again and now chek for patterns like X X.X
                s = asha_data_df[col_name][index]

                emptyspace = s.split(" ")
                if (len(emptyspace) >= 2):
                    newString = emptyspace[0]
                    asha_data_df[col_name][index] = newString


    for i in numeric_col_names:
        clean_data(i)
        asha_data_df[i] = pd.to_numeric(asha_data_df[i], errors='coerce')

    return asha_data_df

def get_forming_data(asha_data_df):

    #
    # Clean data
    #

    asha_data_df = get_clean_data(asha_data_df)

    # Baby Age at Admission, Diagnosis (Jaundice), Diagnosis (Anemia), Baby Weight At Admission -
    # These variable are multiple records, But didnt find multiple values in data. Also
    # We can aggregate and take last value to form one record per baby

    forming_data_1 = asha_data_df.groupby(
        ['Study Id'], as_index=False).agg({
        'Place of Delievery': 'first',
        'study_id': 'first',
        'hospital_type': 'first'
    })

    forming_data_2 = asha_data_df.groupby(
        ['Study Id'], as_index=False).agg({
        'Baby Preterm': 'first', 'Baby Gender': 'first', 'Diagnosis (LBW)': 'first',
        'Birth Facility': 'first', 'Baby Gestational Age': 'first',
        'Baby Weight At Birth': 'first', 'Maternal Diabetes': 'first',
        'Rupture Of Membranes Rom One': 'first', 'Rupture Of Membranes Rom': 'first',
        'Smelly Amniotic Fluid': 'first', 'Type Of Delivery': 'first',
        'Delayed Cord Clamping': 'first', 'Baby Age at Admission': 'last', 'Diagnosis (Jaundice)': 'last',
        'Diagnosis (Anemia)': 'last', 'Baby Weight At Admission': 'last'
    })

    forming_data_3 = forming_data_2.drop(forming_data_2.columns[0], axis=1)
    forming_data = pd.concat([forming_data_1, forming_data_3], axis=1)

    # Functions to code the multi level fields
    def isAllSame(list1):
        previous = list1[0]
        for item in list1:
            if previous != item:
                return False
        return True

    def isFirstLastSame(list1):
        if list1[0] == list1[-1]:
            return True
        else:
            return False

    def isAscending(list1):
        previous = list1[0]
        for number in list1:
            if number < previous:
                return False
            previous = number
        return True

    def isDescending(list1):
        previous = list1[0]
        for number in list1:
            if number > previous:
                return False
            previous = number
        return True

    def formSinglefeature(col_name, col_type):

        forming_data[col_name] = ""

        if (col_type == 'Numeric'):
            forming_data[col_name + '_value'] = pd.Series([], dtype='float')
        else:
            forming_data[col_name + '_value'] = ""

        for index, row in forming_data.iterrows():
            temp_df = asha_data_df.loc[asha_data_df['Study Id'].isin([
                forming_data['Study Id'][index]])]

            feature_val = 'No Change'
            temp_df[col_name].fillna(0, inplace=True)
            temp_df[col_name].replace('NA', 0, inplace=True)
            data_value = list(temp_df[col_name])

            if (len(temp_df) > 1):

                if (isFirstLastSame(data_value)):
                    feature_val = 'No Change'
                elif (isAllSame(data_value)):
                    feature_val = 'No Change'
                elif (isAscending(data_value)):
                    feature_val = 'Increasing'
                elif (isDescending(data_value)):
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
    # Normalize some columns
    #

    formSinglefeature('Baby Blood Glucose', "Numeric")
    formSinglefeature('Frequency Of Stools', "Numeric")
    formSinglefeature('Hypothermia Status Value', "Numeric")
    formSinglefeature('Baby Blood Pressure Mean Arterial Bp', "Numeric")
    formSinglefeature('Baby Blood Pressure Upper Limb', "Numeric")
    formSinglefeature('Baby Blood Pressure Lower Limb', "Numeric")

    # Fields with range values first make ordinal and then agregate
    scale_mapper = {'NA': 0,
                    'Normal': 1,
                    'Dull': 2,
                    'Lethargic': 3}
    asha_data_df['Baby Appearance'] = asha_data_df['Baby Appearance'].replace(scale_mapper)
    formSinglefeature('Baby Appearance', "Categorical")

    # Bring back Fields values
    scale_mapper = {0: 'NA',
                    1: 'Normal',
                    2: 'Dull',
                    3: 'Lethargic'}
    forming_data['Baby Appearance_value'] = forming_data['Baby Appearance_value'].replace(scale_mapper)

    scale_mapper = {'NA': 0,
                    'Pink': 1,
                    'Pale': 2,
                    'Peripheral Duskiness': 3,
                    'Central Cyanosis': 4,
                    'Acrocyanosis': 5}
    asha_data_df['Baby Skin Colour'] = asha_data_df['Baby Skin Colour'].replace(scale_mapper)
    formSinglefeature('Baby Skin Colour', "Categorical")

    scale_mapper = {0: 'NA',
                    1: 'Pink',
                    2: 'Pale',
                    3: 'Peripheral Duskiness',
                    4: 'Central Cyanosis',
                    5: 'Acrocyanosis'}
    forming_data['Baby Skin Colour_value'] = forming_data['Baby Skin Colour_value'].replace(scale_mapper)

    scale_mapper = {'NA': 0,
                    'Normal': 1,
                    'Low Pitch': 2,
                    'High Pitch': 3,
                    'Not Cried': 4}
    asha_data_df['Baby Cry Sound'] = asha_data_df['Baby Cry Sound'].replace(scale_mapper)
    formSinglefeature('Baby Cry Sound', "Categorical")

    scale_mapper = {0: 'NA',
                    1: 'Normal',
                    2: 'Low Pitch',
                    3: 'High Pitch',
                    4: 'Not Cried'}
    forming_data['Baby Cry Sound_value'] = forming_data['Baby Cry Sound_value'].replace(scale_mapper)

    scale_mapper = {'NA': 0,
                    'Normal': 1,
                    'Poor': 2,
                    'No Feeding': 3,
                    'No feeding': 3}
    asha_data_df['Baby Feeding Status'] = asha_data_df['Baby Feeding Status'].replace(scale_mapper)
    formSinglefeature('Baby Feeding Status', "Categorical")

    scale_mapper = {0: 'NA',
                    1: 'Normal',
                    2: 'Poor',
                    3: 'No Feeding'}
    forming_data['Baby Feeding Status_value'] = forming_data['Baby Feeding Status_value'].replace(scale_mapper)

    def checkValues(list1):
        previous = list1[0]
        for fieldValue in list1:
            if fieldValue == 'Yes':
                return 'Yes'
        return previous

    def checkValuesPositive(list1):
        previous = list1[0]
        for fieldValue in list1:
            if fieldValue == 'Positive':
                return 'Positive'
        return previous

    def formSinglefeatureForCat(col_name, variableType=''):
        forming_data[col_name] = ""

        for index, row in forming_data.iterrows():
            temp_df = asha_data_df.loc[asha_data_df['Study Id'].isin([
                forming_data['Study Id'][index]])]

            if (pd.Series(temp_df[col_name]).any() == False):
                feature_val = np.nan
            else:
                if (variableType == 'Dependent'):
                    temp_df[col_name].fillna('Negative', inplace=True)
                    data_value = list(temp_df[col_name])
                    feature_val = checkValuesPositive(data_value)
                else:
                    temp_df[col_name].fillna('No', inplace=True)
                    data_value = list(temp_df[col_name])
                    feature_val = checkValues(data_value)

            forming_data[col_name][index] = feature_val

    # Multiple Y/N/NA fields to be captured on value present. No trend is captured in these variable
    formSinglefeatureForCat('Excessive Sleeping')
    formSinglefeatureForCat('Hypothermia')
    formSinglefeatureForCat('Baby Jaundice')
    formSinglefeatureForCat('Breast Feeding Initiation')
    formSinglefeatureForCat('Kangaroo Mother Care')
    formSinglefeatureForCat('Groaning')
    formSinglefeatureForCat('Grunting')
    formSinglefeatureForCat('Stridor')
    formSinglefeatureForCat('Retraction')
    formSinglefeatureForCat('Fast Breathing')
    formSinglefeatureForCat('Baby Chest Indrawing')
    formSinglefeatureForCat('Cool Peripheries')
    formSinglefeatureForCat('Seizures')
    formSinglefeatureForCat('Abnormal Movements Like Tonic Posturing')
    formSinglefeatureForCat('Af Bulge')
    formSinglefeatureForCat('Abdominal Dystension')
    formSinglefeatureForCat('Diarrhea')
    formSinglefeatureForCat('Vomiting')
    formSinglefeatureForCat('Feeding Intolerance')
    formSinglefeatureForCat('Baby Movement')

    #
    # O/P
    #

    formSinglefeatureForCat('Blood Culture Report', 'Dependent')

    # ##################################################################
    #
    # Impute the data.
    #
    # ##################################################################

    # Fill NA values for other categorical values with NaN
    forming_data['Birth Facility'].fillna('NA', inplace=True)
    forming_data['Rupture Of Membranes Rom One'].fillna('NA', inplace=True)
    forming_data['Rupture Of Membranes Rom'].fillna('NA', inplace=True)
    forming_data['Smelly Amniotic Fluid'].fillna('NA', inplace=True)
    forming_data['Type Of Delivery'].fillna('NA', inplace=True)
    forming_data['Delayed Cord Clamping'].fillna('NA', inplace=True)
    forming_data['Diagnosis (LBW)'].fillna('NA', inplace=True)
    forming_data['Maternal Diabetes'].fillna('NA', inplace=True)
    forming_data['Diagnosis (Jaundice)'].fillna('NA', inplace=True)
    forming_data['Diagnosis (Anemia)'].fillna('NA', inplace=True)
    forming_data['Excessive Sleeping'].fillna('NA', inplace=True)
    forming_data['Hypothermia'].fillna('NA', inplace=True)
    forming_data['Baby Jaundice'].fillna('NA', inplace=True)
    forming_data['Breast Feeding Initiation'].fillna('NA', inplace=True)
    forming_data['Kangaroo Mother Care'].fillna('NA', inplace=True)
    forming_data['Groaning'].fillna('NA', inplace=True)
    forming_data['Grunting'].fillna('NA', inplace=True)
    forming_data['Stridor'].fillna('NA', inplace=True)
    forming_data['Retraction'].fillna('NA', inplace=True)
    forming_data['Fast Breathing'].fillna('NA', inplace=True)
    forming_data['Baby Chest Indrawing'].fillna('NA', inplace=True)
    forming_data['Cool Peripheries'].fillna('NA', inplace=True)
    forming_data['Seizures'].fillna('NA', inplace=True)
    forming_data['Abnormal Movements Like Tonic Posturing'].fillna('NA', inplace=True)
    forming_data['Af Bulge'].fillna('NA', inplace=True)
    forming_data['Abdominal Dystension'].fillna('NA', inplace=True)
    forming_data['Diarrhea'].fillna('NA', inplace=True)
    forming_data['Vomiting'].fillna('NA', inplace=True)
    forming_data['Feeding Intolerance'].fillna('NA', inplace=True)
    forming_data['Baby Movement'].fillna('NA', inplace=True)

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

    # Impute loop
    for i in forming_data.index:
        ges_age = forming_data['Baby Gestational Age'][i]
        preterm = forming_data['Baby Preterm'][i]
        if ((pd.isna(preterm)) and (ges_age <= 36)):
            forming_data.at[i, 'Baby Preterm'] = 'Yes'

    return forming_data
