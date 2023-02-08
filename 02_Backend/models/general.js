import table_const from '../config/table'
module.exports = (sequelize, type) => {
  return sequelize.define(table_const.general, {
    id: {
      type: type.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    record_type: type.STRING,
    baby_admission_type: type.STRING,
    baby_birth_date: type.STRING,
    study_id: type.INTEGER,
    baby_place_of_birth_pin_code: type.STRING,
    baby_place_of_birth_name: type.STRING,
    baby_birth_time_hours: type.STRING,
    baby_birth_time_minit: type.STRING,
    baby_age_of_admission: type.STRING,
    baby_apgar_score_one_min: type.STRING,
    baby_apgar_score_five_min: type.STRING,
    baby_apgar_score_ten_min: type.STRING,
    baby_preterm: type.STRING,
    baby_condition_yes_eos_los: type.STRING,
    baby_condition_rds_yes_no: type.STRING,
    baby_gender: type.STRING,
    baby_appear_score: type.STRING,
    baby_condition_jaundice_suspect: type.STRING,
    baby_condition_ttnb_suspect: type.STRING,
    baby_condition_lga_suspect: type.STRING,
    baby_condition_aga_suspect: type.STRING,
    baby_condition_sga_suspect: type.STRING,
    baby_shock_aga_suspect: type.STRING,
    baby_condition_dextrocordia_suspect: type.STRING,
    baby_condition_anemia_suspect: type.STRING,
    baby_condition_lbw_suspect: type.STRING,
    mother_age: type.STRING,
    place_of_delivery: type.STRING,
    birth_facility: type.STRING,
    baby_gestational_age: type.STRING,
    baby_gestational_age_unit: type.STRING,
    baby_weight_at_birth: type.STRING,
    baby_condition_suspect: type.STRING,
    baby_day_of_event: type.STRING,
    baby_weight_at_admission: type.STRING,
    baby_condition_other_if_suspect: type.STRING,
    prelim_diagnosis_perinatal: type.STRING,
    prelim_diagnosis_hypoglycemia: type.STRING,
    prelim_diagnosis_hypocalcemia: type.STRING,
    prelim_diagnosis_feeding_intolerence: type.STRING,
    prelim_diagnosis_gastroenteritis: type.STRING,
    baby_weight_at_birth_unit: type.STRING,
    baby_weight_at_admission_unit: type.STRING,
    baby_date_of_admission: type.STRING,
    
    meningitis:type.STRING,
    umblical_sepsis:type.STRING,
    skin_pustules:type.STRING,
    seizures:type.STRING,
    bleeding_manifestation:type.STRING,
    central_peripheral:type.STRING,
    asphyxia:type.STRING,
    pneumonia:type.STRING,
    peritonitis:type.STRING,
    coagulopathy:type.STRING,
    soft_tissue_abscess:type.STRING,
    endocarditis:type.STRING,
    pulmonary_hemorrhage:type.STRING,
    thrombocytopenia:type.STRING,
    uti:type.STRING,

    septic_arthritis:type.STRING,
    hypoxia:type.STRING,
    metabolic_acidosis:type.STRING,
    rupture_time:type.STRING,
    baby_lga_sga_aga_suspect:type.STRING


    

// `baby_condition_lga_suspect`
// `baby_condition_aga_suspect`
// `baby_condition_sga_suspect`

    

    


  });
};