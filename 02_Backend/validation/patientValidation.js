const {body} = require('express-validator/check')
const constant = require('../helper/constant')

function saveValidateBabyAppears(){
  return [
    body('baby_appears.study_id').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isInt().withMessage(constant.field_int_msg),
    body('baby_appears.baby_appearance').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg),
    body('baby_appears.baby_skin_colour').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg),
    body('baby_appears.baby_cry_sound').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg),
    body('baby_appears.baby_cry_sound_status').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg),
    body('baby_appears.hypotonia_muscular_response_one_min_after_birth').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg),
    body('baby_appears.excessive_sleeping').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg),
    body('baby_appears.hypothermia').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg),
    body('baby_appears.hypothermia_status').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg),
    body('baby_appears.hypothermia_status_value').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg),
    body('baby_appears.baby_feeding_status').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg),
    body('baby_appears.baby_presence_of_convulsions').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg),
    body('baby_appears.baby_jaundice').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg),
    body('baby_appears.breast_feeding_initiation').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg),
    body('baby_appears.kangaroo_mother_care').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg),
    body('baby_appears.umbilical_discharge').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg),
    body('baby_appears.umbilical_redness').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg),
    body('baby_appears.umbilical_enduration').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg),
    body('baby_appears.skin_pustules').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg),

    body('baby_appears.reading').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg)
  ]
}

function updateValidateBabyAppears(){
  return [
    // body('baby_appearance').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg),
    // body('baby_skin_colour').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg),
    // body('baby_cry_sound').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg),
    // body('baby_cry_sound_status').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg),
    // body('hypotonia_muscular_response_one_min_after_birth').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg),
    // body('excessive_sleeping').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg),
    // body('hypothermia').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg),
    // body('hypothermia_status').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg),
    // body('hypothermia_status_value').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg),
    // body('baby_feeding_status').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg),
    // body('baby_presence_of_convulsions').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg),
    // body('baby_jaundice').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg),
    // body('breast_feeding_initiation').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg),
    // body('kangaroo_mother_care').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg),
    // body('umbilical_discharge').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg)
  ]
}

function saveValidationBabyResp(){
  return [
    body('baby_resp.groaning').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg),
    body('baby_resp.grunting').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg),
    body('baby_resp.stridor').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg),
    body('baby_resp.retraction').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg),
    body('baby_resp.fast_breathing').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg),
    body('baby_resp.oxygen_saturation').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg),
    body('baby_resp.breathing_rate').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg),
    body('baby_resp.baby_chest_indrawing').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg),
    body('baby_resp.x_ray_result').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg),
    body('baby_resp.x_ray_status_done').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg),
    body('baby_resp.x_ray_status').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg),
    body('baby_resp.apnea_diagnosis').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg),
    body('baby_resp.apnea_status').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg),
    //body('baby_resp.baby_respiratory_support').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg),
    body('baby_resp.baby_respiratory_support_if_yes').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg)
  ]
}

function updateValidationBabyResp(){
  return [
    body('groaning').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg),
    body('grunting').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg),
    body('stridor').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg),
    body('retraction').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg),
    body('fast_breathing').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg),
    body('oxygen_saturation').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg),
    body('breathing_rate').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg),
    body('baby_chest_indrawing').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg),
    body('x_ray_result').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg),
    body('x_ray_status_done').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg),
    body('x_ray_status').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg),
    body('apnea_diagnosis').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg),
    body('apnea_status').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg),
    body('baby_respiratory_support').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg),
    body('baby_respiratory_support_if_yes').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg)
  ]
}

function saveValidateBabyCV(){
  return[
  body('baby_cv.study_id').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isInt().withMessage(constant.field_int_msg),
  body('baby_cv.heart_rate').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg),
  body('baby_cv.urine_output').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg),
  body('baby_cv.baby_blood_pressure_mean_arterial_bp').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg),
  body('baby_cv.baby_blood_pressure_upper_limb').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg),
  body('baby_cv.baby_blood_pressure_lower_limb').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg),
  body('baby_cv.capillary_refill_unit').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg),
  body('baby_cv.low_peripheral_pulse_volume').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg),
  body('baby_cv.cool_peripheries').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg),
  body('baby_cv.two_d_echo_done').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg),
  body('baby_cv.two_d_echo_done_if_yes').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg),
  body('baby_cv.baby_on_ionotropes').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg),
  body('baby_cv.central_line').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg),
  body('baby_cv.skin_pustules').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg),
  body('baby_cv.infusion_of_blood_products').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg),
  body('baby_cv.reading').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg)
  ]
}

function updateValidateBabyCV(){
  return[
  // body('urine_output').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg),
  // body('baby_blood_pressure_mean_arterial_bp').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg),
  // body('baby_blood_pressure_upper_limb').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg),
  // body('baby_blood_pressure_lower_limb').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg),
  // body('capillary_refill_unit').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg),
  // body('low_peripheral_pulse_volume').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg),
  // body('cool_peripheries').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg),
  // body('two_d_echo_done').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg),
  // body('two_d_echo_done_if_yes').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg),
  // body('baby_on_ionotropes').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg),
  // body('central_line').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg),
  // body('skin_pustules').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg),
  // body('infusion_of_blood_products').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg)
  ]
}

function saveValidateBabyCNS(){
return[
  body('baby_cns.study_id').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isInt().withMessage(constant.field_int_msg),
  body('baby_cns.features_of_encephalopathy').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg),
  body('baby_cns.seizures').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg),
  body('baby_cns.abnormal_movements_like_tonic_posturing').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg),
  body('baby_cns.af_bulge').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg),
  body('baby_cns.reading').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg)
]
}

function updateValidateBabyCNS(){
  return[
    body('features_of_encephalopathy').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg),
    body('abnormal_movements_like_tonic_posturing').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg),
    body('af_bulge').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg)
  ]
}

function saveValidateBabyGIT(){
  return [
    body('baby_git.study_id').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isInt().withMessage(constant.field_int_msg),
    body('baby_git.abdominal_dystension').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg),
    body('baby_git.frequency_of_stools').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg),
    body('baby_git.diarrhea').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg),
    body('baby_git.vomiting').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg),
    body('baby_git.feeding_intolerance').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg),
    body('baby_git.reading').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg)
  ]
}

function updateValidateBabyGIT(){
  return [
    body('abdominal_dystension').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg),
    body('frequency_of_stools').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg),
    body('diarrhea').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg),
    body('vomiting').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg),
    body('feeding_intolerance').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg)
  ]
}

function saveValidateBabyAntibiotic(){
  return[
  body('baby_antibiotic.study_id').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isInt().withMessage(constant.field_int_msg),
  body('baby_antibiotic.antibiotic_given').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg),
  body('baby_antibiotic.date_of_administration_of_antiobiotic').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg),
  body('baby_antibiotic.time_of_administration_of_antiobiotic_hours').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg),
  body('baby_antibiotic.time_of_administration_of_antiobiotic_minute').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg),
  body('baby_antibiotic.antibiotic_name').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg),
  body('baby_antibiotic.date_of_blood_samples_sent_for_culture_test').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg),
  body('baby_antibiotic.time_of_blood_samples_sent_for_culture_test_hours').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg),
  body('baby_antibiotic.time_of_blood_samples_sent_for_culture_test_minute').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg),
  body('baby_antibiotic.blood_sample_taken_prior_to_antiobiotic_administration').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg),
  body('baby_antibiotic.reading').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg)
  ]
}

function updateValidateBabyAntibiotic(){
  return[
  body('antibiotic_given').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg),
  body('date_of_administration_of_antiobiotic').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg),
  body('time_of_administration_of_antiobiotic_hours').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg),
  body('time_of_administration_of_antiobiotic_minute').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg),
  body('antibiotic_name').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg),
  body('date_of_blood_samples_sent_for_culture_test').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg),
  body('time_of_blood_samples_sent_for_culture_test_hours').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg),
  body('time_of_blood_samples_sent_for_culture_test_minute').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg),
  body('blood_sample_taken_prior_to_antiobiotic_administration').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg)
  ]
}

function saveValidateBabyFinal(){
  return[
  //   body('baby_final.study_id').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isInt().withMessage(constant.field_int_msg),
  // body('baby_final.days_of_stay_in_hospital').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg),
  // body('baby_final.final_diagnosis_sepsis').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg),
  // body('baby_final.final_diagnosis_rds').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg),
  // body('baby_final.final_diagnosis_rds').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg),
  // body('baby_final.final_diagnosis_ttnb').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg),
  // body('baby_final.final_diagnosis_jaundice').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg),
  // body('baby_final.final_diagnosis_lbw').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg),
  // body('baby_final.final_diagnosis_lga').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg),
  // body('baby_final.final_diagnosis_aga').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg),
  // body('baby_final.final_diagnosis_anemia').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg),
  // body('baby_final.final_diagnosis_dextochordia').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg),
  // body('baby_final.final_diagnosis_hypoglycemia').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg),
  // body('baby_final.final_diagnosis_hypocalcemia').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg),
  // body('baby_final.final_diagnosis_gastroenteritis').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg),
  // body('baby_final.final_diagnosis_perinatal_respiratory_depression').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg),
  // body('baby_final.final_diagnosis_shock').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg),
  // body('baby_final.final_diagnosis_feeding_intolerence').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg),
  // body('baby_final.baby_discharge_date').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg),
  // body('baby_final.final_diagnosis_sga').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg),
  // body('baby_final.final_diagnosis_eos_los').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg),
  // body('baby_final.final_diagnosis_other').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg),
  // body('baby_final.reading').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg)
  ]
}

function updateValidateBabyFinal(){
  return[
  body('days_of_stay_in_hospital').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg),
  body('final_diagnosis_sepsis').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg),
  body('final_diagnosis_rds').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg),
  body('final_diagnosis_rds').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg),
  body('final_diagnosis_ttnb').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg),
  body('final_diagnosis_jaundice').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg),
  body('final_diagnosis_lbw').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg),
  //body('final_diagnosis_lga').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg),
  //body('final_diagnosis_aga').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg),
  body('final_diagnosis_anemia').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg),
  body('final_diagnosis_dextochordia').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg),
  body('final_diagnosis_hypoglycemia').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg),
  body('final_diagnosis_hypocalcemia').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg),
  body('final_diagnosis_gastroenteritis').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg),
  body('final_diagnosis_perinatal_respiratory_depression').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg),
  body('final_diagnosis_shock').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg),
  body('final_diagnosis_feeding_intolerence').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg),
  body('baby_discharge_date').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg),
 // body('final_diagnosis_sga').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg),
  body('final_diagnosis_eos_los').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg),
  body('final_diagnosis_other').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg)
  ]
}

function saveValidateBabyInvestigation(){
  return[
  body('baby_investigation.study_id').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isInt().withMessage(constant.field_int_msg),
  body('baby_investigation.baby_thyroid_status').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg),
  body('baby_investigation.baby_thyroid_result').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg),
  body('baby_investigation.baby_blood_glucose').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg),
  body('baby_investigation.baby_haemoglobin_levels').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg),
  body('baby_investigation.baby_c_reactive_protien_levels').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg),
  body('baby_investigation.micro_esr').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg),
  body('baby_investigation.baby_procalcitonin_levels').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg),
  body('baby_investigation.total_leucocute_count_unit').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg),
  body('baby_investigation.total_leucocute_count').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg),
  body('baby_investigation.absolute_neutrophil_count').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg),
  body('baby_investigation.absolute_neutrophil_count_unit').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg),
  body('baby_investigation.immature_to_mature_neutrophil_ratios').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg),
  body('baby_investigation.thrombocytopenia_unit').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg),
  body('baby_investigation.thrombocytopenia').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg),
  body('baby_investigation.thrombocytopenia_unit').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg),
  body('baby_investigation.urine_rest_for_pus_cells').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg),
  body('baby_investigation.urine_culture_test').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg),
  body('baby_investigation.blood_culture_report').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg),
  //body('baby_investigation.gram_positive_bacteria').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg),
  //body('baby_investigation.fungi').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg),
  body('baby_investigation.other_organism').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg),
  body('baby_investigation.antibiotic_status_resisitant').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg),
  body('baby_investigation.antibiotic_status_intermediate').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg),
 // body('baby_investigation.antibiotic_status_value').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg),
  body('baby_investigation.sodium').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg),
  body('baby_investigation.potassium').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg),
  body('baby_investigation.chlorine').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg),
  body('baby_investigation.calcium').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg),
  body('baby_investigation.phosphate').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg),
  body('baby_investigation.magnesium').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg),
  body('baby_investigation.urea').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg),
  body('baby_investigation.creatinine').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg),
  body('baby_investigation.lactate_levels').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg),
  body('baby_investigation.bilirubin_levels').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg),
  body('baby_investigation.cord_ph').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg),
  body('baby_investigation.arrhythmia').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg),
  body('baby_investigation.csf_culture').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg),
  body('baby_investigation.reading').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg)
  ]
}

function updateValidateBabyInvestigation(){
  return[
  body('baby_thyroid_status').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg),
  body('baby_thyroid_result').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg),
  body('baby_blood_glucose').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg),
  body('baby_haemoglobin_levels').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg),
  body('baby_c_reactive_protien_levels').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg),
  body('micro_esr').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg),
  body('baby_procalcitonin_levels').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg),
  body('total_leucocute_count_unit').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg),
  body('total_leucocute_count').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg),
  body('absolute_neutrophil_count').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg),
  body('absolute_neutrophil_count_unit').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg),
  body('immature_to_mature_neutrophil_ratios').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg),
  body('thrombocytopenia_unit').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg),
  body('thrombocytopenia').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg),
  body('thrombocytopenia_unit').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg),
  body('urine_rest_for_pus_cells').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg),
  body('urine_culture_test').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg),
  body('blood_culture_report').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg),
  //body('gram_positive_bacteria').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg),
  body('fungi').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg),
  body('other_organism').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg),
  body('antibiotic_status_resisitant').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg),
  body('antibiotic_status_intermediate').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg),
  body('antibiotic_status_value').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg),
  body('sodium').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg),
  body('potassium').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg),
  body('chlorine').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg),
  body('calcium').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg),
  body('phosphate').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg),
  body('magnesium').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg),
  body('urea').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg),
  body('creatinine').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg),
  body('lactate_levels').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg),
  body('bilirubin_levels').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg),
  body('cord_ph').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg),
  body('arrhythmia').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg),
  body('csf_culture').exists().withMessage(constant.field_not_exist).isLength({min:1}).withMessage(constant.field_empty_msg).isString().withMessage(constant.field_string_msg),
  ]
}

exports.validate =(method) =>{
switch(method){
    case 'savePatientModels':{
     return [
      saveValidateBabyAppears(),
      saveValidationBabyResp(),
      saveValidateBabyCV(),
      saveValidateBabyCNS(),
      saveValidateBabyGIT(),
      saveValidateBabyAntibiotic(),
      saveValidateBabyFinal(),
      saveValidateBabyInvestigation()
    ]
    };
    break;
    case 'updateBabyAppearsModel':{
    return updateValidateBabyAppears()
    };
    break;
    case 'updateBabyRespModel':{
    return updateValidationBabyResp()
    };
    break;
    case 'updateBabyCVModel':{
    return updateValidateBabyCV()
    };
    break;
    case 'updateBabyCNSModel':{
    return updateValidateBabyCNS()
    };
    break;
    case 'updateBabyGITModel':{
    return updateValidateBabyGIT()
    };
    break;
    case 'updateBabyAntibioticModel':{
    return updateValidateBabyAntibiotic()
    };
    break;
    case 'updateBabyFinalModel':{
    return updateValidateBabyFinal()
    };
    break;
    case 'updateBabyInvestigationModel':{
    return updateValidateBabyInvestigation()
    };
    break;
  }
}

