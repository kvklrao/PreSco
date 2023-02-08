# coding: utf-8

import pandas as pd
import warnings
import sqlalchemy
import numpy as np

from scipy import stats as s
from sklearn.impute import KNNImputer

# prepare the pipeline
from joblib import load

warnings.filterwarnings('ignore')

chunk_size = 20
MODEL_FULL =  'data_model_rf_full.joblib'
NEEDED_FEATURES = 'NeededFeatureListFull.csv'

DB_HOST = 'localhost'
DB_PORT = 3306
DB_PASSWORD = 

#
# DB Params
#
engine = sqlalchemy.create_engine(
    "mysql+pymysql://avyantradb:{2}@{0}:{1}/avyantra_dev?&autocommit=true".format(DB_HOST, DB_PORT, DB_PASSWORD))

#
# SQL String
#

sql_str = """
            select
                `a`.`id` AS `study_id`,
                `a`.`hospital_type` AS `hospital_type`,
                `a`.`id` AS 'Study Id',
                `b`.`baby_age_of_admission` AS 'Baby Age at Admission',
                `b`.`baby_gestational_age` AS 'Baby Gestational Age',
                `b`.`baby_weight_at_admission` AS 'Baby Weight At Admission',
                `b`.`baby_weight_at_birth` AS `Baby Weight At Birth`,
                `c`.`smelly_amniotic_fluid` AS 'Smelly Amniotic Fluid',
                `d`.`baby_appearance` AS 'Baby Appearance',
                `f`.`heart_rate` AS 'Heart Rate',
                `b`.`baby_condition_yes_eos_los` AS 'Diagnosis (EOS/LOS/NA)',
                `i`.`baby_blood_glucose` AS 'Baby Blood Glucose',
                `i`.`total_leucocute_count` AS 'Total Leucocute Count',
                `i`.`thrombocytopenia` AS 'Thrombocytopeni',
                `c`.`gbs_infection` AS 'Gbs Infection',
                `i`.`sodium` AS 'Sodium',
                `i`.`potassium` AS 'Potassium',
                `i`.`chlorine` AS 'Chlorine',
                `i`.`calcium` AS 'Calcium',
                `i`.`creatinine` AS 'Creatinine',
                `i`.`absolute_neutrophil_count` AS 'Absolute Neutrophil Count',
                `e`.`breathing_rate` AS 'Breathing Rate',
                `c`.`leaking_pv` AS 'Leaking pv',
                `i`.`blood_culture_report` AS 'Blood Culture Report',
                `e`.`oxygen_saturation` AS 'Oxygen Saturation',
                `i`.`bilirubin_levels` AS 'Bilirubin Levels',
                `i`.`baby_haemoglobin_levels` AS 'Baby Haemoglobin Levels',
                `f`.`baby_blood_pressure_lower_limb` AS 'Baby Blood Pressure Lower Limb',
                `d`.`baby_feeding_status` AS 'Baby Feeding Status',
                `i`.`baby_c_reactive_protien_levels` AS 'Baby Reactive Protien Levels',
                `f`.`baby_blood_pressure_mean_arterial_bp` AS 'Baby Blood Pressure Mean Arterial Bp'
            from
                `avyantra_dev`.`patient_basic_infos` `a`
            join `avyantra_dev`.`patient_general_infos` `b` on
                `a`.`id` = `b`.`study_id`
            join `avyantra_dev`.`patient_maternal_infos` `c` on
                `a`.`id` = `c`.`study_id`
            join `avyantra_dev`.`patient_baby_appears_infos` `d` on
                `a`.`id` = `d`.`study_id`
            join `avyantra_dev`.`patient_baby_resp_infos` `e` on
                `a`.`id` = `e`.`study_id`
                and `d`.`reading` = `e`.`reading`
            join `avyantra_dev`.`patient_baby_cv_infos` `f` on
                `a`.`id` = `f`.`study_id`
                and `d`.`reading` = `f`.`reading`
            join `avyantra_dev`.`patient_baby_cns_infos` `g` on
                `a`.`id` = `g`.`study_id`
                and `d`.`reading` = `g`.`reading`
            join `avyantra_dev`.`patient_baby_git_infos` `h` on
                `a`.`id` = `h`.`study_id`
                and `d`.`reading` = `h`.`reading`
            join `avyantra_dev`.`patient_baby_investigations` `i` on
                `a`.`id` = `i`.`study_id`
                and `d`.`reading` = `i`.`reading`
            where
                (`a`.`deleted_flag` = 0 or `a`.`deleted_flag` is null) 
                and `a`.`id` not in ('727', '484', '621', '701', '1')
                and `a`.hospital_type <> 7
            order by
                `a`.`hospital_name`,
                `a`.`hospital_branch_name`,
                `a`.`baby_medical_record_number`,
                `d`.`createdAt`
            """
#
# Read the result set
#

offset = 0
dfs = []

for chunk in pd.read_sql_query(sql_str, engine, chunksize=chunk_size):
    dfs.append(chunk)

inital_df = pd.concat(dfs)

#
# Take a copy of the main dataset.
#

full_df = inital_df.copy()
forming_data = []
numeric_col_list = list()

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
    
#
# Useful functions
#

def clean_data(col_name):

    for index, row in full_df.iterrows(): 
        s = full_df[col_name][index]

        if (type(s) == str):
            # Check for patterns like X...X
            tripledot = s.split("...")
            if(len(tripledot) >= 2):
                newString = tripledot[0] + '.' + tripledot[1]
                full_df[col_name][index] = newString
            
            # Take value again and Check for patterns like X..X
            s = full_df[col_name][index]
            
            doubledot = s.split("..")
            if(len(doubledot) >= 2):
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
                #multi trend cases
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
# Numeric cols in the data
#
numeric_col_names = ['Baby Weight At Admission', 'Baby Blood Glucose', 'Baby Haemoglobin Levels', 'Sodium', 'Total Leucocute Count',
             'Baby Reactive Protien Levels', 'Potassium', 'Chlorine', 'Calcium', 'Creatinine',  'Bilirubin Levels',
             'Heart Rate', 'Breathing Rate', 'Baby Gestational Age', 'Absolute Neutrophil Count', 
             'Baby Blood Pressure Mean Arterial Bp', 'Baby Blood Pressure Lower Limb', 'Baby Age at Admission',
             'Thrombocytopeni', 'Oxygen Saturation', 'Baby Weight At Birth'
            ]

# Pivot by these columns. i.e take on the last value
numeric_piv_cols = ['Baby Weight At Admission', 'Baby Weight At Birth', 'Baby Age at Admission', 'Baby Gestational Age']

#
# Clean numeric cols and coerce it to number.
#

for i in numeric_col_names:
    clean_data(i)
    full_df[i] = pd.to_numeric(full_df[i], errors='coerce')


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

forming_data['Baby Age at Admission'].replace('NA', np.NaN, inplace=True)
forming_data['Baby Gestational Age'].replace('NA', np.NaN, inplace=True)
forming_data['Baby Weight At Birth'].replace('NA', np.NaN, inplace=True)
forming_data['Baby Weight At Admission'].replace('NA', np.NaN, inplace=True)

X_filled_knn = KNNImputer(n_neighbors=3).fit_transform(
    forming_data[['Baby Gestational Age','Baby Weight At Birth', 'Baby Weight At Admission', 
                 'Baby Age at Admission']])

forming_data[['Baby Gestational Age','Baby Weight At Birth', 
              'Baby Weight At Admission', 'Baby Age at Admission']] = X_filled_knn

#
# Baby appearance.
#
scale_mapper = {'Normal':1, 
                'Dull':2,
                'Lethargic':3}

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

scale_mapper = {'Normal':1, 
                'Poor':2,
                'No Feeding':3}
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

#
# Drop Study ID
#

forming_data.drop(['Study Id'], axis = 1, inplace = True) 

#
# Prepare the final list of numeric cols.
#

num_cols = numeric_piv_cols + numeric_col_list
cols = forming_data.columns

# ##################################################################
#
# Make a copy of the data frame to preserve the original references.
#
# ##################################################################

df_orig = forming_data.copy()

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

y_predict = radm_clf.predict_proba(X_subset)[:,1]

# ##################################################################
#
# Write code to update the database. 
#
# ##################################################################

df_orig['sepsis_score'] = y_predict
df_to_database =df_orig[['hospital_type','study_id','sepsis_score']]

# dump to a temporary MySQL table
df_to_database.to_sql(
                        'tmp_full_sepsis', engine,
                        if_exists='replace',
                        index=False,
                        dtype={
                         'hospital_type' : sqlalchemy.types.INTEGER,
                         'study_id': sqlalchemy.types.INTEGER,
                         'sepsis_score': sqlalchemy.types.Numeric(5,3)
                        }
                    )

engine.execute(""" 
                create unique index idx_study_id on avyantra_dev.tmp_full_sepsis (hospital_type, study_id); 
                """)

# ##################################################################
#
# Append new data.
#
# ##################################################################

engine.execute("""
                    insert ignore into avyantra_dev.sepsis_score_full_params
                        select
                            `a`.`id` AS `id`,
                            `a`.`hospital_type` AS `hospital_type`,
                            `d`.`reading` AS `reading`,
                            000.0000 as sepsis_score
                        from
                            `avyantra_dev`.`patient_basic_infos` `a`
                        join `avyantra_dev`.`patient_baby_appears_infos` `d` on
                            `a`.`id` = `d`.`study_id`
                        where
                            (`a`.`deleted_flag` = 0 or `a`.`deleted_flag` is null) 
                            and `a`.`id` not in ('727', '484', '621', '701', '1')
                            and `a`.hospital_type <> 7
                        order by
                            `a`.`hospital_type`,
                            `d`.`createdAt`;
                """)

# ##################################################################
#
# Update the scores. DO NOT touch the old scores.
#
# ##################################################################

engine.execute(
                """
                    UPDATE
                        avyantra_dev.sepsis_score_full_params p
                    INNER JOIN avyantra_dev.tmp_full_sepsis q ON
                        p.id = q.study_id 
                    AND
                        p.hospital_type = q.hospital_type
                    SET
                        p.sepsis_score = q.sepsis_score
                    WHERE
                        p.sepsis_score = 0;
                """
                )
