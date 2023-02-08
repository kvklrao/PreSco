# coding: utf-8

import pandas as pd
import warnings
import sqlalchemy
from scipy import stats as s
import numpy as np
from sklearn.impute import KNNImputer

# prepare the pipeline
from joblib import load

warnings.filterwarnings('ignore')

chunk_size = 20
MODEL_ASHA =  'data_model_rf_asha.joblib'
NEEDED_FEATURES = 'NeededFeatureList.csv'

sql_str = """
                select
                    `a`.`id` AS `Study Id`,
                    `a`.`id` AS `study_id`,               
                    `a`.`hospital_type` AS `hospital_type`,
                    `b`.`baby_age_of_admission` AS `Baby Age at Admission`,
                    `b`.`baby_preterm` AS `Baby Preterm`,
                    `b`.`baby_gender` AS `Baby Gender`,
                    `b`.`baby_condition_jaundice_suspect` AS `Diagnosis (Jaundice)`,
                    `b`.`baby_condition_anemia_suspect` AS `Diagnosis (Anemia)`,
                    `b`.`baby_condition_lbw_suspect` AS `Diagnosis (LBW)`,
                    `b`.`place_of_delivery` AS `Place of Delievery`,
                    `b`.`birth_facility` AS `Birth Facility`,
                    `b`.`baby_gestational_age` AS `Baby Gestational Age`,
                    `b`.`baby_weight_at_birth` AS `Baby Weight At Birth`,
                    `b`.`baby_weight_at_admission` AS `Baby Weight At Admission`,
                    `b`.`baby_date_of_admission` AS `Baby Date Of Admission`,
                    `c`.`maternal_diabetes` AS `Maternal Diabetes`,
                    `c`.`rupture_of_membranes_rom_one` AS `Rupture Of Membranes Rom One`,
                    `c`.`rupture_of_membranes_rom` AS `Rupture Of Membranes Rom`,
                    `c`.`smelly_amniotic_fluid` AS `Smelly Amniotic Fluid`,
                    `c`.`type_of_delivery` AS `Type Of Delivery`,
                    `c`.`delayed_cord_clamping` AS `Delayed Cord Clamping`,
                    `d`.`baby_appearance` AS `Baby Appearance`,
                    `d`.`baby_skin_colour` AS `Baby Skin Colour`,
                    `d`.`baby_cry_sound` AS `Baby Cry Sound`,
                    `d`.`excessive_sleeping` AS `Excessive Sleeping`,
                    `d`.`hypothermia` AS `Hypothermia`,
                    `d`.`hypothermia_status_value` AS `Hypothermia Status Value`,
                    `d`.`baby_feeding_status` AS `Baby Feeding Status`,
                    `d`.`baby_jaundice` AS `Baby Jaundice`,
                    `d`.`breast_feeding_initiation` AS `Breast Feeding Initiation`,
                    `d`.`kangaroo_mother_care` AS `Kangaroo Mother Care`,
                    `e`.`groaning` AS `Groaning`,
                    `e`.`grunting` AS `Grunting`,
                    `e`.`stridor` AS `Stridor`,
                    `e`.`retraction` AS `Retraction`,
                    `e`.`fast_breathing` AS `Fast Breathing`,
                    `e`.`baby_chest_indrawing` AS `Baby Chest Indrawing`,
                    `f`.`baby_blood_pressure_mean_arterial_bp` AS `Baby Blood Pressure Mean Arterial Bp`,
                    `f`.`baby_blood_pressure_upper_limb` AS `Baby Blood Pressure Upper Limb`,
                    `f`.`baby_blood_pressure_lower_limb` AS `Baby Blood Pressure Lower Limb`,
                    `f`.`cool_peripheries` AS `Cool Peripheries`,
                    `g`.`seizures` AS `Seizures`,
                    `g`.`abnormal_movements_like_tonic_posturing` AS `Abnormal Movements Like Tonic Posturing`,
                    `g`.`af_bulge` AS `Af Bulge`,
                    `h`.`abdominal_dystension` AS `Abdominal Dystension`,
                    `h`.`frequency_of_stools` AS `Frequency Of Stools`,
                    `h`.`diarrhea` AS `Diarrhea`,
                    `h`.`vomiting` AS `Vomiting`,
                    `h`.`feeding_intolerance` AS `Feeding Intolerance`,
                    `h`.`baby_movement` AS `Baby Movement`,
                    `i`.`baby_blood_glucose` AS `Baby Blood Glucose`,
                    `i`.`blood_culture_report` AS `Blood Culture Report`
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
                join `avyantra_dev`.`patient_baby_antibiotics` `j` on
                    `a`.`id` = `j`.`study_id`
                    and `d`.`reading` = `j`.`reading`
                join `avyantra_dev`.`patient_baby_finals` `k` on
                    `a`.`id` = `k`.`study_id`
                    and `d`.`reading` = `k`.`reading`
                where
                    (`a`.`deleted_flag` = 0 or `a`.`deleted_flag` is null) 
                    and `a`.`id` not in ('727', '621', '701')
                order by
                    `a`.`hospital_name`,
                    `a`.`hospital_branch_name`,
                    `a`.`baby_medical_record_number`,
                    `d`.`createdAt`;
            """
offset = 0
dfs = []

DB_HOST = 'localhost'
DB_PORT = 3306
DB_PASSWORD = 

#
# DB Params
#
engine = sqlalchemy.create_engine(
    "mysql+pymysql://avyantradb:{2}@{0}:{1}/avyantra_dev?&autocommit=true".format(DB_HOST, DB_PORT, DB_PASSWORD))


for chunk in pd.read_sql_query(sql_str, engine, chunksize=chunk_size):
    dfs.append(chunk)

inital_df = pd.concat(dfs)
asha_data_df = inital_df.copy()

# ###################################################################################
# Grab the numeric columns..
# ###################################################################################

numeric_col_names = ['Rupture Of Membranes Rom One', 'Hypothermia Status Value', 'Baby Blood Pressure Mean Arterial Bp',
                     'Baby Blood Pressure Upper Limb', 'Baby Blood Pressure Lower Limb', 'Frequency Of Stools',
                     'Baby Blood Glucose', 'Baby Weight At Admission', 'Baby Weight At Birth']

def cleanData(col_name):
    for index, row in asha_data_df.iterrows(): 
        s = asha_data_df[col_name][index]

        if (type(s) == str):
            # Check for patterns like X...X
            tripledot = s.split("...")
            if(len(tripledot) >= 2):
                newString = tripledot[0] + '.' + tripledot[1]
                asha_data_df[col_name][index] = newString
            
            # Take value again and Check for patterns like X..X
            s = asha_data_df[col_name][index]
            
            doubledot = s.split("..")
            if(len(doubledot) >= 2):
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
    cleanData(i)
    asha_data_df[i] = pd.to_numeric(asha_data_df[i], errors='coerce')

# Baby Age at Admission, Diagnosis (Jaundice), Diagnosis (Anemia), Baby Weight At Admission -
# These variable are multiple records, But didnt find multiple values in data. Also
# We can aggregate and take last value to form one record per baby

forming_data_1 = asha_data_df.groupby(
    ['Study Id'], as_index=False).agg({
            'Place of Delievery':'first' ,
            'study_id': 'first' ,
            'hospital_type' : 'first'
        })

forming_data_2 = asha_data_df.groupby(
    ['Study Id'], as_index=False).agg({
        'Baby Preterm':'first', 'Baby Gender':'first', 'Diagnosis (LBW)':'first', 
        'Birth Facility':'first', 'Baby Gestational Age':'first', 
        'Baby Weight At Birth':'first', 'Maternal Diabetes':'first', 
        'Rupture Of Membranes Rom One':'first', 'Rupture Of Membranes Rom':'first', 
        'Smelly Amniotic Fluid':'first', 'Type Of Delivery':'first', 
        'Delayed Cord Clamping':'first', 'Baby Age at Admission':'last', 'Diagnosis (Jaundice)':'last', 
        'Diagnosis (Anemia)':'last', 'Baby Weight At Admission':'last'
    })

forming_data_3 = forming_data_2.drop(forming_data_2.columns[0],axis=1)
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
# Normalize some columns
#

formSinglefeature('Baby Blood Glucose', "Numeric")
formSinglefeature('Frequency Of Stools', "Numeric")
formSinglefeature('Hypothermia Status Value', "Numeric")
formSinglefeature('Baby Blood Pressure Mean Arterial Bp', "Numeric")
formSinglefeature('Baby Blood Pressure Upper Limb', "Numeric")
formSinglefeature('Baby Blood Pressure Lower Limb', "Numeric")

# Fields with range values first make ordinal and then agregate
scale_mapper = {'NA':0,
                'Normal':1, 
                'Dull':2,
                'Lethargic':3}
asha_data_df['Baby Appearance'] = asha_data_df['Baby Appearance'].replace(scale_mapper)
formSinglefeature('Baby Appearance', "Categorical")

# Bring back Fields values
scale_mapper = {0:'NA',
                1: 'Normal', 
                2: 'Dull',
                3: 'Lethargic'}
forming_data['Baby Appearance_value'] = forming_data['Baby Appearance_value'].replace(scale_mapper)

scale_mapper = {'NA':0,
                'Pink':1, 
                'Pale':2,
                'Peripheral Duskiness':3, 
                'Central Cyanosis':4, 
                'Acrocyanosis':5}
asha_data_df['Baby Skin Colour'] = asha_data_df['Baby Skin Colour'].replace(scale_mapper)
formSinglefeature('Baby Skin Colour', "Categorical")

scale_mapper = {0: 'NA',
                1: 'Pink', 
                2: 'Pale',
                3: 'Peripheral Duskiness', 
                4: 'Central Cyanosis', 
                5: 'Acrocyanosis'}
forming_data['Baby Skin Colour_value'] = forming_data['Baby Skin Colour_value'].replace(scale_mapper)

scale_mapper = {'NA':0,
                'Normal':1, 
                'Low Pitch':2,
                'High Pitch':3, 
                'Not Cried':4}
asha_data_df['Baby Cry Sound'] = asha_data_df['Baby Cry Sound'].replace(scale_mapper)
formSinglefeature('Baby Cry Sound', "Categorical")

scale_mapper = {0: 'NA',
                1: 'Normal', 
                2: 'Low Pitch',
                3: 'High Pitch', 
                4: 'Not Cried'}
forming_data['Baby Cry Sound_value'] = forming_data['Baby Cry Sound_value'].replace(scale_mapper)

scale_mapper = {'NA': 0,
                'Normal':1, 
                'Poor':2,
                'No Feeding':3}
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

#Multiple Y/N/NA fields to be captured on value present. No trend is captured in these variable
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

forming_data['Baby Age at Admission'].replace('NA', np.NaN, inplace=True)
forming_data['Baby Gestational Age'].replace('NA', np.NaN, inplace=True)
forming_data['Baby Weight At Birth'].replace('NA', np.NaN, inplace=True)
forming_data['Baby Weight At Admission'].replace('NA', np.NaN, inplace=True)

X_filled_knn = KNNImputer(n_neighbors=3).fit_transform(
    forming_data[['Baby Gestational Age','Baby Weight At Birth', 'Baby Weight At Admission', 
                 'Baby Age at Admission']])

forming_data[['Baby Gestational Age','Baby Weight At Birth', 
              'Baby Weight At Admission', 'Baby Age at Admission']] = X_filled_knn

#Impute loop
for i in forming_data.index:
    ges_age = forming_data['Baby Gestational Age'][i]
    preterm = forming_data['Baby Preterm'][i]
    if ((pd.isna(preterm)) and (ges_age <=36 )):
        forming_data.at[i, 'Baby Preterm'] = 'Yes'


# ##################################################################
#
# Make a copy of the data frame to preserve the original references.
#
# ##################################################################

df_orig = forming_data.copy()

# #########################################################################################################
#
# Read feaures which are needed by the model 
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

"""

Drop first...debug.

t = forming_data[['Baby Appearance_value']]

print (t)
print (' -------------- ')

t = pd.get_dummies(t)

print (t)
print (' -------------- ')

"""

forming_data = pd.get_dummies(forming_data, columns = categorical_col_names)

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


y_predict = radm_clf.predict_proba(X_subset)[:,1]

# ##################################################################
#
# Write code to update the database. 
#
# ##################################################################

df_orig['sepsis_score_asha'] = y_predict
df_to_database =df_orig[['hospital_type','study_id','sepsis_score_asha']]

# dump to a temporary MySQL table
df_to_database.to_sql(
                        'tmp_asha_sepsis', engine,
                        if_exists='replace',
                        index=False,
                        dtype={
                         'hospital_type' : sqlalchemy.types.INTEGER,
                         'study_id': sqlalchemy.types.INTEGER,
                         'sepsis_score_asha': sqlalchemy.types.Numeric(5,3)
                        }
                    )

engine.execute(""" 
                create unique index idx_study_id on avyantra_dev.tmp_asha_sepsis (study_id); 
                """)

# ##################################################################
#
# Append new data.
#
# ##################################################################

engine.execute("""
                    insert ignore into avyantra_dev.sepsis_score_asha
                        select
                            `a`.`id` AS `id`,
                            000.0000 as sepsis_score
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
                        where
                            (`a`.`deleted_flag` = 0 or `a`.`deleted_flag` is null)
                            and `a`.hospital_type = 7
                            and `a`.`id` not in ('727', '621', '701');

                """)

# ##################################################################
#
# Update the scores. DO NOT touch the old scores.
#
# ##################################################################

engine.execute(
                """
                    UPDATE
                        avyantra_dev.sepsis_score_asha p
                    INNER JOIN 
                        avyantra_dev.tmp_asha_sepsis q 
                    ON
                        `p`.`id` = `q`.`study_id` 
                    SET
                        p.sepsis_score = q.sepsis_score_asha
                    WHERE
                        p.sepsis_score = 0 
                    AND
                         q.hospital_type=7;
                """
                )
