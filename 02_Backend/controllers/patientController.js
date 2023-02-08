const pReadingModels = require('../sequelize')
const { validationResult } = require('express-validator/check')
const responseHelper = require('../helper/res')
const constant = require('../helper/constant')
const { sequelize } = require('../sequelize')
const queries = require('../helper/queries')
const mapper = require('../mapper/mapper')
const excel = require('exceljs');
const enumConst = require('../helper/enum')
const utils = require('../helper/util')
const constData = require('../helper/constant')
const sharp = require("sharp")
const server = require('../server')
const logger = server.log


exports.updateBabyProfileByStudyId = (req, res, next) => {

  pReadingModels.general_model.findAll({
    where: {
      study_id: req.params.studyId
    }
  })
    .then(result => {
      
      if (result.length == 0) {
        const reqData = req.body;
        return pReadingModels.general_model.create(reqData)
      }
      else{
        result = mapper.babyGeneralProfileMapper(result[0], req)
        return result.save()
      }
    })
    .then(result => {
      pReadingModels.patient_model.findOne({
        where: {
          study_id: req.params.studyId
        }
      })
        .then(pResult => {
          pResult.updated_by = req.params.sUserId
          pResult.save()
        })
      return result
    })
    .then(result => {
      res.json(responseHelper.success(constant.data_updated_successfully, result))
    })
    .catch(err => {
      res.json(responseHelper.serveError(constant.error_msg, err))
    })
}

exports.updateMotherProfileByStudyId = (req, res, next) => {

  console.log(req.body, "update mother profile")

  pReadingModels.maternal_model.findAll({
    where: {
      study_id: req.params.studyId
    }
  })
    .then(result => {
      if (result.length == 0) {
        const reqData = req.body;
        return pReadingModels.maternal_model.create(reqData)
      }else{
        result = mapper.babyMaternalProfileMapper(result[0], req)
        return result.save()
      }
    })
    .then(result => {
      pReadingModels.patient_model.findOne({
        where: {
          study_id: req.params.studyId
        }
      })
        .then(pResult => {
          pResult.updated_by = req.params.sUserId
          pResult.save()
        })
      return result
    })
    .then(result => {
      res.json(responseHelper.success(constant.data_updated_successfully, result))
    })
    .catch(err => {
      res.json(responseHelper.serveError(constant.error_msg, err))
    })
}

exports.updatebabyHealthParameters = async (req, res, next) => {

  try {
    const [results, metadata] = await sequelize.query(`
      UPDATE patient_baby_appears_infos d 
        JOIN  patient_baby_git_infos h ON d.study_id = h.study_id
        JOIN  patient_baby_cv_infos f ON  d.study_id =f.study_id
        JOIN  patient_baby_resp_infos e ON d.study_id =e.study_id
      SET 
        d.baby_appearance = '${req.body.baby_appearance}',
        d.breast_feeding_initiation = '${req.body.breast_feeding_initiation}',
        d.baby_feeding_status='${req.body.baby_feeding_status}',
        f.baby_blood_pressure_upper_limb ='${req.body.baby_blood_pressure_upper_limb}',		
        f.baby_blood_pressure_lower_limb 	='${req.body.baby_blood_pressure_lower_limb}',				
        f.baby_blood_pressure_mean_arterial_bp ='${req.body.baby_blood_pressure_mean_arterial_bp}',	
        f.urine_output 				='${req.body.urine_output}',
        h.frequency_of_stools 	='${req.body.frequency_of_stools}',		
        h.vomiting 			='${req.body.vomiting}',	
        h.abdominal_dystension 	='${req.body.abdominal_dystension}',			
        e.retraction 				='${req.body.retraction}',	
        e.fast_breathing 		='${req.body.fast_breathing}',	
        e.baby_chest_indrawing 	='${req.body.baby_chest_indrawing}',		
        h.baby_movement ='${req.body.baby_movement}'
      where d.study_id = ${req.params.studyId} and d.reading = 'R1'`, {
    })
    res.json(responseHelper.success(constant.data_updated_successfully, results))
  } catch (e) {

    res.json(responseHelper.serveError(constant.error_msg, e))
  }

}

/**
 * 
 * Function to save a patient. Now improved to update if record already exists.
 * 
 */
exports.savePatientModels = async (req, res, next) => {

  let result;
  let row;

  try{

    result = await pReadingModels.maternal_model.findAll({
      where: {
        study_id: req.body.baby_appears.study_id
      }
    })
    
    if (result.length == 0) {
      res.json(responseHelper.notFound(constant.no_maternal_record_found, result))
      return;
    }

    result = await pReadingModels.baby_appear_model.findAll({
        where:
        {
          study_id: req.body.baby_appears.study_id,
          reading: req.body.baby_appears.reading
        }
      })
      
      if (result.length == 0) {
        await pReadingModels.baby_appear_model.create(req.body.baby_appears)
      } 
      else {
        result = mapper.babyAppearsMapper(result[0], req.body.baby_appears)
        await result.save()
      }

    result = await pReadingModels.baby_resp_model.findAll(
      {
        where:
        {
          study_id: req.body.baby_resp.study_id,
          reading: req.body.baby_resp.reading
        }
      })
  
      var baby_respiratory_support = JSON.parse(req.body.baby_resp.baby_respiratory_support);
      req.body.baby_resp.baby_respiratory_support = baby_respiratory_support
        
      if (result.length == 0) {
        await pReadingModels.baby_resp_model.create(req.body.baby_resp)
      } 
      else {
        
        row = result[0]

        row.groaning = req.body.baby_resp.groaning;
        row.grunting = req.body.baby_resp.grunting;
        row.stridor = req.body.baby_resp.stridor;
        row.retraction = req.body.baby_resp.retraction;
        row.fast_breathing = req.body.baby_resp.fast_breathing;
        row.oxygen_saturation = req.body.baby_resp.oxygen_saturation;
        row.breathing_rate = req.body.baby_resp.breathing_rate;
        row.baby_chest_indrawing = req.body.baby_resp.baby_chest_indrawing;
        row.x_ray_result = req.body.baby_resp.x_ray_result;
        row.x_ray_status_done = req.body.baby_resp.x_ray_status_done;
        row.x_ray_status = req.body.baby_resp.x_ray_status;
        row.x_ray_diagnosis_any_other = req.body.baby_resp.x_ray_diagnosis_any_other;
        row.apnea_diagnosis = req.body.baby_resp.apnea_diagnosis;
        row.apnea_status = req.body.baby_resp.apnea_status;
        row.baby_respiratory_support = req.body.baby_resp.baby_respiratory_support;
        row.baby_respiratory_support_if_yes = req.body.baby_resp.baby_respiratory_support_if_yes;
        row.tab_name = req.body.baby_resp.tab_name

        await row.save()
      }
  
    result = await pReadingModels.baby_cv_model.findAll(
        {
          where:
          {
            study_id: req.body.baby_cv.study_id,
            reading: req.body.baby_cv.reading
          }
        })

        if (result.length == 0) {
          await pReadingModels.baby_cv_model.create(req.body.baby_cv)
        } 
        else {

            row = result[0]

            row.heart_rate = req.body.baby_cv.heart_rate;
            row.urine_output = req.body.baby_cv.urine_output;
            row.baby_blood_pressure_mean_arterial_bp = req.body.baby_cv.baby_blood_pressure_mean_arterial_bp;
            row.baby_blood_pressure_upper_limb = req.body.baby_cv.baby_blood_pressure_upper_limb;
            row.baby_blood_pressure_lower_limb = req.body.baby_cv.baby_blood_pressure_lower_limb;
            row.capillary_refill_unit = req.body.baby_cv.capillary_refill_unit;
            row.low_peripheral_pulse_volume = req.body.baby_cv.low_peripheral_pulse_volume;
            row.cool_peripheries = req.body.baby_cv.cool_peripheries;
            row.two_d_echo_done = req.body.baby_cv.two_d_echo_done;
            row.two_d_echo_done_if_yes = req.body.baby_cv.two_d_echo_done_if_yes;
            row.baby_on_ionotropes = req.body.baby_cv.baby_on_ionotropes;
            row.central_line = req.body.baby_cv.central_line;
            row.skin_pustules = req.body.baby_cv.skin_pustules;
            row.infusion_of_blood_products = req.body.baby_cv.infusion_of_blood_products;
            row.central_line_if_applicable = req.body.baby_cv.central_line_if_applicable;
            row.central_line_value = req.body.baby_cv.central_line_value;
            row.central_line_insert_date = req.body.baby_cv.central_line_insert_date;
            row.central_line_removed_date = req.body.baby_cv.central_line_removed_date;
  
            await row.save()
        }

    result = await pReadingModels.baby_cns_model.findAll(
      {
        where:
        {
          study_id: req.body.baby_cns.study_id,
          reading: req.body.baby_cns.reading
        }
      })
        
      if (result.length == 0) {       
        await pReadingModels.baby_cns_model.create(req.body.baby_cns)
      } 
      else {
        row = result[0]

        row.features_of_encephalopathy = req.body.baby_cns.features_of_encephalopathy;
        row.seizures = req.body.baby_cns.seizures;
        row.abnormal_movements_like_tonic_posturing = req.body.baby_cns.abnormal_movements_like_tonic_posturing;
        row.baby_movement = req.body.baby_cns.baby_movement;
        row.af_bulge = req.body.baby_cns.af_bulge;
        row.tab_name = req.body.baby_cns.tab_name;

        await row.save()
      }

    result = await pReadingModels.baby_git_model.findAll(
        {
          where:
          {
            study_id: req.body.baby_git.study_id,
            reading: req.body.baby_git.reading
          }
        })

        if (result.length == 0) {
            await pReadingModels.baby_git_model.create(req.body.baby_git)
        } 
        else {

          row = result[0];
          
          row.abdominal_dystension = req.body.baby_git.abdominal_dystension;
          row.frequency_of_stools = req.body.baby_git.frequency_of_stools;
          row.diarrhea = req.body.baby_git.diarrhea;
          row.vomiting = req.body.baby_git.vomiting;
          row.feeding_intolerance = req.body.baby_git.feeding_intolerance;
          row.baby_movement = req.body.baby_git.baby_movement;
          row.tab_name = req.body.baby_git.tab_name;

          await row.save()
        }

    /**
     * 
     * Ignore final as it will not be created in ASHA ? 
     * 
     */

    result = await  pReadingModels.baby_final_model.findAll({
          where:
            {
              study_id: req.body.baby_final.study_id,
              reading: req.body.baby_final.reading
            }
          })

      if (result.length == 0) {
        await pReadingModels.baby_final_model.create(req.body.baby_final)
      }

    result = await pReadingModels.baby_antibiotic_model.findAll(
        {
          where:
          {
            study_id: req.body.baby_antibiotic.study_id,
            reading: req.body.baby_antibiotic.reading
          }
        })
          
      if (result.length == 0) {
          await pReadingModels.baby_antibiotic_model.create(req.body.baby_antibiotic)
      } 
      else {
          
        row = result[0]
          
        row.antibiotic_given = req.body.baby_antibiotic.antibiotic_given;
        row.date_of_administration_of_antiobiotic = req.body.baby_antibiotic.date_of_administration_of_antiobiotic;
        row.time_of_administration_of_antiobiotic_hours = req.body.baby_antibiotic.time_of_administration_of_antiobiotic_hours;
        row.time_of_administration_of_antiobiotic_minute = req.body.baby_antibiotic.time_of_administration_of_antiobiotic_minute;
        row.antibiotic_name = req.body.baby_antibiotic.antibiotic_name;
        row.antibiotic_name_if_other = req.body.baby_antibiotic.antibiotic_name_if_other;
        row.date_of_blood_samples_sent_for_culture_test = req.body.baby_antibiotic.date_of_blood_samples_sent_for_culture_test;
        row.time_of_blood_samples_sent_for_culture_test_hours = req.body.baby_antibiotic.time_of_blood_samples_sent_for_culture_test_hours;
        row.time_of_blood_samples_sent_for_culture_test_minute = req.body.baby_antibiotic.time_of_blood_samples_sent_for_culture_test_minute;
        row.blood_sample_taken_prior_to_antiobiotic_administration = req.body.baby_antibiotic.blood_sample_taken_prior_to_antiobiotic_administration;
        
        await row.save()
      }

    result = await pReadingModels.baby_investigation_model.findAll(
      {
        where:
        {
          study_id: req.body.baby_investigation.study_id,
          reading: req.body.baby_investigation.reading
        }
      })
      
      if (result.length == 0) {
          await pReadingModels.baby_investigation_model.create(req.body.baby_investigation)
      } 
      else {
  
        row = result[0]

        row.baby_thyroid_status = req.body.baby_investigation.baby_thyroid_status;
        row.baby_thyroid_result = req.body.baby_investigation.baby_thyroid_result;
        row.baby_blood_glucose = req.body.baby_investigation.baby_blood_glucose;
        row.baby_haemoglobin_levels = req.body.baby_investigation.baby_haemoglobin_levels;
        row.baby_c_reactive_protien_levels = req.body.baby_investigation.baby_c_reactive_protien_levels;
        row.micro_esr = req.body.baby_investigation.micro_esr;
        row.baby_procalcitonin_levels = req.body.baby_investigation.baby_procalcitonin_levels;
        row.total_leucocute_count_unit = req.body.baby_investigation.total_leucocute_count_unit;
        row.total_leucocute_count = req.body.baby_investigation.total_leucocute_count;
        row.absolute_neutrophil_count = req.body.baby_investigation.absolute_neutrophil_count;
        row.absolute_neutrophil_count_unit = req.body.baby_investigation.absolute_neutrophil_count_unit;
        row.immature_to_mature_neutrophil_ratios = req.body.baby_investigation.immature_to_mature_neutrophil_ratios;
        row.thrombocytopenia_unit = req.body.baby_investigation.thrombocytopenia_unit;
        row.thrombocytopenia = req.body.baby_investigation.thrombocytopenia;
        row.urine_rest_for_pus_cells = req.body.baby_investigation.urine_rest_for_pus_cells;
        row.urine_culture_test = req.body.baby_investigation.urine_culture_test;
        row.blood_culture_report = req.body.baby_investigation.blood_culture_report;
        row.gram_positive_bacteria = req.body.baby_investigation.gram_positive_bacteria;
        row.gram_positive_bacteria_if_other = req.body.baby_investigation.gram_positive_bacteria_if_other;
        row.gram_negative_bacteria = req.body.baby_investigation.gram_negative_bacteria;
        row.gram_negative_bacteria_if_other = req.body.baby_investigation.gram_negative_bacteria_if_other;
        row.fungi = req.body.baby_investigation.fungi;
        row.other_organism = req.body.baby_investigation.other_organism;
        row.antibiotic_status_resisitant = req.body.baby_investigation.antibiotic_status_resisitant;
        row.antibiotic_status_intermediate = req.body.baby_investigation.antibiotic_status_intermediate;
        row.antibiotic_status_value = req.body.baby_investigation.antibiotic_status_value;
        row.sodium = req.body.baby_investigation.sodium;
        row.potassium = req.body.baby_investigation.potassium;
        row.chlorine = req.body.baby_investigation.chlorine;
        row.calcium = req.body.baby_investigation.calcium;
        row.phosphate = req.body.baby_investigation.phosphate;
        row.magnesium = req.body.baby_investigation.magnesium;
        row.urea =req.body.baby_investigation.urea;
        row.creatinine = req.body.baby_investigation.creatinine;
        row.lactate_levels = req.body.baby_investigation.lactate_levels;
        row.bilirubin_levels = req.body.baby_investigation.bilirubin_levels;
        row.cord_ph = req.body.baby_investigation.cord_ph;
        row.arrhythmia = req.body.baby_investigation.arrhythmia;
        row.csf_culture = req.body.baby_investigation.csf_culture;
        row.csf_culture_tsb_value = req.body.baby_investigation.csf_culture_tsb_value;
        row.tab_name = req.body.baby_investigation.tab_name;
        row.prothrombin_type = req.body.baby_investigation.prothrombin_type;
        row.activated_partial_prothrombine_type = req.body.baby_investigation.activated_partial_prothrombine_type;
        row.baby_c_reactive_protien_result = req.body.baby_investigation.baby_c_reactive_protien_result;
  
        await row.save()
      }

      result = await pReadingModels.patient_model.findAll({
        where: {
          study_id: 1037
        }
      })

      if (result.length > 0) {
        
        row = result[0]
        row.updated_by = req.params.sUserId 
        row.save()
      }

      res.json(responseHelper.success(constant.success, result))
  }
  catch(err) {
    res.json(responseHelper.serveError(constant.error_msg, err))
  };
}

exports.getBabyAppearsModel = (req, res, next) => {

  var study_id = req.params.studyId
  var hospital_id = req.params.hospitalId
  var reading = req.params.readingId
  let query = `SELECT  DISTINCT patient_baby_appears_infos.*,
  patient_basic_infos.hospital_id,
  patient_basic_infos.hospital_name,
  patient_basic_infos.hospital_branch_id,
  patient_basic_infos.baby_medical_record_number,
  patient_basic_infos.baby_mother_medical_record_number
  FROM patient_baby_appears_infos  
  JOIN patient_basic_infos ON  patient_baby_appears_infos.study_id = patient_basic_infos.id 
  WHERE patient_baby_appears_infos.study_id =:study_id 
  AND patient_basic_infos.hospital_id=:hospital_id  AND patient_baby_appears_infos.reading = :reading LIMIT 1`

  // sequelize.query('SELECT  DISTINCT * FROM patient_baby_appears_infos pbai  JOIN patient_basic_infos pbi ON  pbai.study_id = pbi.id WHERE pbai.study_id =:study_id AND pbi.hospital_id=:hospital_id AND pbai.reading = :reading LIMIT 1',
  sequelize.query(query,
    {
      replacements: {
        study_id: study_id,
        hospital_id: hospital_id,
        reading: reading
      }, type: sequelize.QueryTypes.SELECT
    }
  ).then(result => {
    res.json(responseHelper.success(constant.success, result))
  })
    .catch(err => {
      res.json(responseHelper.serveError(constant.error_msg, err))
    })
}

exports.getBabyRespModel = (req, res, next) => {
  var study_id = req.params.studyId
  var hospital_id = req.params.hospitalId
  var reading = req.params.readingId
  var query = `SELECT  DISTINCT patient_baby_resp_infos.*,
  patient_basic_infos.hospital_id,
  patient_basic_infos.hospital_name,
  patient_basic_infos.hospital_branch_id,
  patient_basic_infos.baby_medical_record_number,
  patient_basic_infos.baby_mother_medical_record_number
  FROM patient_baby_resp_infos  
  JOIN patient_basic_infos ON  patient_baby_resp_infos.study_id = patient_basic_infos.id 
  WHERE patient_baby_resp_infos.study_id =:study_id 
  AND patient_basic_infos.hospital_id=:hospital_id  AND patient_baby_resp_infos.reading = :reading LIMIT 1`

  // sequelize.query('SELECT  DISTINCT * FROM patient_baby_resp_infos pbai  JOIN patient_basic_infos pbi ON  pbai.study_id = pbi.id WHERE study_id =:study_id AND hospital_id=:hospital_id AND reading = :reading LIMIT 1',
  sequelize.query(query,
    {
      replacements: {
        study_id: study_id,
        hospital_id: hospital_id,
        reading: reading
      }, type: sequelize.QueryTypes.SELECT
    }
  ).then(result => {
    res.json(responseHelper.success(constant.success, result))
  })
    .catch(err => {
      res.json(responseHelper.serveError(constant.error_msg, err))
    })
}

exports.getBabyCVModel = (req, res, next) => {
  var study_id = req.params.studyId
  var hospital_id = req.params.hospitalId
  var reading = req.params.readingId

  var query = `SELECT  DISTINCT patient_baby_cv_infos.*,
  patient_basic_infos.hospital_id,
  patient_basic_infos.hospital_name,
  patient_basic_infos.hospital_branch_id,
  patient_basic_infos.baby_medical_record_number,
  patient_basic_infos.baby_mother_medical_record_number
  FROM patient_baby_cv_infos  
  JOIN patient_basic_infos ON  patient_baby_cv_infos.study_id = patient_basic_infos.id 
  WHERE patient_baby_cv_infos.study_id =:study_id 
  AND patient_basic_infos.hospital_id=:hospital_id  AND patient_baby_cv_infos.reading = :reading LIMIT 1`
  // sequelize.query('SELECT  DISTINCT * FROM patient_baby_cv_infos pbai  JOIN patient_basic_infos pbi ON  pbai.study_id = pbi.id WHERE study_id =:study_id AND hospital_id=:hospital_id AND reading = :reading LIMIT 1',
  sequelize.query(query,
    {
      replacements: {
        study_id: study_id,
        hospital_id: hospital_id,
        reading: reading
      }, type: sequelize.QueryTypes.SELECT
    }
  ).then(result => {
    res.json(responseHelper.success(constant.success, result))
  })
    .catch(err => {
      res.json(responseHelper.serveError(constant.error_msg, err))
    })
}

exports.getBabyCNSModel = (req, res, next) => {
  var study_id = req.params.studyId
  var hospital_id = req.params.hospitalId
  var reading = req.params.readingId

  var query = `SELECT  DISTINCT patient_baby_cns_infos.*,
  patient_basic_infos.hospital_id,
  patient_basic_infos.hospital_name,
  patient_basic_infos.hospital_branch_id,
  patient_basic_infos.baby_medical_record_number,
  patient_basic_infos.baby_mother_medical_record_number
  FROM patient_baby_cns_infos  
  JOIN patient_basic_infos ON  patient_baby_cns_infos.study_id = patient_basic_infos.id 
  WHERE patient_baby_cns_infos.study_id =:study_id 
  AND patient_basic_infos.hospital_id=:hospital_id  AND patient_baby_cns_infos.reading = :reading LIMIT 1`
  // sequelize.query('SELECT  DISTINCT * FROM patient_baby_cns_infos pbai  JOIN patient_basic_infos pbi ON  pbai.study_id = pbi.id WHERE study_id =:study_id AND hospital_id=:hospital_id AND reading = :reading LIMIT 1',
  sequelize.query(query,
    {
      replacements: {
        study_id: study_id,
        hospital_id: hospital_id,
        reading: reading
      }, type: sequelize.QueryTypes.SELECT
    }
  ).then(result => {
    res.json(responseHelper.success(constant.success, result))
  })
    .catch(err => {
      res.json(responseHelper.serveError(constant.error_msg, err))
    })
}

exports.getBabyGITModel = (req, res, next) => {
  var study_id = req.params.studyId
  var hospital_id = req.params.hospitalId
  var reading = req.params.readingId

  var query = `SELECT  DISTINCT patient_baby_git_infos.*,
  patient_basic_infos.hospital_id,
  patient_basic_infos.hospital_name,
  patient_basic_infos.hospital_branch_id,
  patient_basic_infos.baby_medical_record_number,
  patient_basic_infos.baby_mother_medical_record_number
  FROM patient_baby_git_infos  
  JOIN patient_basic_infos ON  patient_baby_git_infos.study_id = patient_basic_infos.id 
  WHERE patient_baby_git_infos.study_id =:study_id 
  AND patient_basic_infos.hospital_id=:hospital_id  AND patient_baby_git_infos.reading = :reading LIMIT 1`
  // sequelize.query('SELECT  DISTINCT * FROM patient_baby_git_infos pbai  JOIN patient_basic_infos pbi ON  pbai.study_id = pbi.id WHERE study_id =:study_id AND hospital_id=:hospital_id AND reading = :reading LIMIT 1',
  sequelize.query(query,
    {
      replacements: {
        study_id: study_id,
        hospital_id: hospital_id,
        reading: reading
      }, type: sequelize.QueryTypes.SELECT
    }
  ).then(result => {
    res.json(responseHelper.success(constant.success, result))
  })
    .catch(err => {
      res.json(responseHelper.serveError(constant.error_msg, err))
    })
}

exports.getBabyInvestigationModel = (req, res, next) => {
  var study_id = req.params.studyId
  var hospital_id = req.params.hospitalId
  var reading = req.params.readingId
  var query = `SELECT  DISTINCT patient_baby_investigations.*,
  patient_basic_infos.hospital_id,
  patient_basic_infos.hospital_name,
  patient_basic_infos.hospital_branch_id,
  patient_basic_infos.baby_medical_record_number,
  patient_basic_infos.baby_mother_medical_record_number
  FROM patient_baby_investigations  
  JOIN patient_basic_infos ON  patient_baby_investigations.study_id = patient_basic_infos.id 
  WHERE patient_baby_investigations.study_id =:study_id 
  AND patient_basic_infos.hospital_id=:hospital_id  AND patient_baby_investigations.reading = :reading LIMIT 1`
  // sequelize.query('SELECT  DISTINCT * FROM patient_baby_investigations pbai  JOIN patient_basic_infos pbi ON  pbai.study_id = pbi.id WHERE study_id =:study_id AND hospital_id=:hospital_id AND reading = :reading LIMIT 1',
  sequelize.query(query,
    {
      replacements: {
        study_id: study_id,
        hospital_id: hospital_id,
        reading: reading
      }, type: sequelize.QueryTypes.SELECT
    }
  ).then(result => {
    res.json(responseHelper.success(constant.success, result))
  })
    .catch(err => {
      res.json(responseHelper.serveError(constant.error_msg, err))
    })
}

exports.getBabyAntibioticModel = (req, res, next) => {
  var study_id = req.params.studyId
  var hospital_id = req.params.hospitalId
  var reading = req.params.readingId
  var query = `SELECT  DISTINCT patient_baby_antibiotics.*,
  patient_basic_infos.hospital_id,
  patient_basic_infos.hospital_name,
  patient_basic_infos.hospital_branch_id,
  patient_basic_infos.baby_medical_record_number,
  patient_basic_infos.baby_mother_medical_record_number
  FROM patient_baby_antibiotics  
  JOIN patient_basic_infos ON  patient_baby_antibiotics.study_id = patient_basic_infos.id 
  WHERE patient_baby_antibiotics.study_id =:study_id 
  AND patient_basic_infos.hospital_id=:hospital_id  AND patient_baby_antibiotics.reading = :reading LIMIT 1`
  // sequelize.query('SELECT  DISTINCT * FROM patient_baby_antibiotics pbai  JOIN patient_basic_infos pbi ON  pbai.study_id = pbi.id WHERE study_id =:study_id AND hospital_id=:hospital_id AND reading = :reading LIMIT 1',
  sequelize.query(query,
    {
      replacements: {
        study_id: study_id,
        hospital_id: hospital_id,
        reading: reading
      }, type: sequelize.QueryTypes.SELECT
    }
  ).then(result => {
    res.json(responseHelper.success(constant.success, result))
  })
    .catch(err => {
      res.json(responseHelper.serveError(constant.error_msg, err))
    })
}

exports.getBabyFinalModel = (req, res, next) => {
  var study_id = req.params.studyId
  var hospital_id = req.params.hospitalId
  var reading = req.params.readingId
  var query = `SELECT  DISTINCT patient_baby_finals.*,
  patient_basic_infos.hospital_id,
  patient_basic_infos.hospital_name,
  patient_basic_infos.hospital_branch_id,
  patient_basic_infos.baby_medical_record_number,
  patient_basic_infos.baby_mother_medical_record_number
  FROM patient_baby_finals  
  JOIN patient_basic_infos ON  patient_baby_finals.study_id = patient_basic_infos.id 
  WHERE patient_baby_finals.study_id =:study_id 
  AND patient_basic_infos.hospital_id=:hospital_id  AND patient_baby_finals.reading = :reading LIMIT 1`
  // sequelize.query('SELECT  DISTINCT * FROM patient_baby_finals pbai  JOIN patient_basic_infos pbi ON  pbai.study_id = pbi.id WHERE study_id =:study_id AND hospital_id=:hospital_id AND reading = :reading LIMIT 1',
  sequelize.query(query,
    {
      replacements: {
        study_id: study_id,
        hospital_id: hospital_id,
        reading: reading
      }, type: sequelize.QueryTypes.SELECT
    }
  ).then(result => {
    res.json(responseHelper.success(constant.success, result))
  })
    .catch(err => {
      res.json(responseHelper.serveError(constant.error_msg, err))
    })
}

exports.getReadingIdByStudyId = (req, res, next) => {

  pReadingModels.baby_appear_model.findAll(
    {
      where: { study_id: req.params.study_id },
      order: [
        ['createdAt', 'DESC']
      ],
      limit: 1
    }
  )
    .then(result => {
      console.log('result :', result.length)
      if (result.length == 0) {
        res.json(responseHelper.success(constant.data_created_successfully,
          {
            study_id: req.params.study_id,
            reading_id: 'R1'
          }))
      } else {
        var reading = result[0].reading
        var readingChar = reading.substring(0, 1)
        var readingNo = reading.substring(1);
        ++readingNo
        reading = readingChar.concat(readingNo);
        res.json(responseHelper.success(constant.data_created_successfully,
          {
            study_id: req.params.study_id,
            reading_id: reading
          }))
      }
    }).catch(err => {
      res.json(responseHelper.serveError(constant.error_msg, err))
    })
}

exports.searchReadingIdByStudyIdAndMrn = (req, res, next) => {
  var id = req.params.id
  var hospitalId = req.params.hospitalId
  var array = []
  pReadingModels.basic_model.findAll({
    where: {
      baby_medical_record_number: id,
      hospital_id: hospitalId,
      hospital_branch_id: req.params.hospitalBranchId
    }
  }).then(result => {

    if (result.length == 0) {
      res.json(responseHelper.notFound(constant.no_record_found))
    }
    var basicResult = {
      study_id: result[0].id,
      baby_medical_record_number: result[0].baby_medical_record_number,
      reading: null
    }
    array[0] = basicResult
    var studyId = result[0].id
    pReadingModels.baby_appear_model.findAll({
      where: {
        study_id: studyId
      }
    })
      .then(result => {
        if (result.length == 0) {
          res.json(responseHelper.success(constant.success, array))
        } else {
          sequelize.query('SELECT DISTINCT pbai.study_id,pbi.baby_medical_record_number,pbai.reading FROM patient_baby_appears_infos AS pbai,patient_basic_infos AS pbi WHERE pbai.study_id= pbi.id AND pbi.baby_medical_record_number= :baby_medical_record_number AND pbi.hospital_id =:hospital_id',
            { replacements: { baby_medical_record_number: id, hospital_id: hospitalId }, type: sequelize.QueryTypes.SELECT }
          )
            .then(result => {
              res.json(responseHelper.success(constant.success, result))
            })
        }
      })
  })
    .catch(err => {
      res.json({
        error_message: err
      })
    })
}

exports. getPatientModels = (req, res, next) => {
  var models = {
    baby_appears: {},
    baby_resp: {},
    baby_cv: {},
    baby_cns: {},
    baby_git: {},
    baby_investigation: {},
    baby_antibiotic: {},
    baby_final: {}
  }

  pReadingModels.baby_appear_model.findAll(
    {
      where:
      {
        study_id: req.params.studyId,
      },
      order: [
        ['createdAt', 'DESC']
      ],
      limit: 1
    }).then(result => {

      if (result.length == 0) {

        res.json(responseHelper.notFound(constant.no_record_found))

      }

      models.baby_appears = result[0]
    }).catch(err => {
      console.log("error :", err)
    })

  pReadingModels.baby_resp_model.findAll(
    {
      where:
      {
        study_id: req.params.studyId,
      },
      order: [
        ['createdAt', 'DESC']
      ],
      limit: 1
    }).then(result => {
      models.baby_resp = result[0]
    }).catch(err => {
      console.log("error :", err)
    })

  pReadingModels.baby_cv_model.findAll(
    {
      where:
      {
        study_id: req.params.studyId,
      },
      order: [
        ['createdAt', 'DESC']
      ],
      limit: 1
    }).then(result => {
      models.baby_cv = result[0]
    }).catch(err => {
      console.log("error :", err)
    })

  pReadingModels.baby_cns_model.findAll(
    {
      where:
      {
        study_id: req.params.studyId,
      },
      order: [
        ['createdAt', 'DESC']
      ],
      limit: 1
    }).then(result => {
      models.baby_cns = result[0]
    }).catch(err => {
      console.log("error :", err)
    })

  pReadingModels.baby_git_model.findAll(
    {
      where:
      {
        study_id: req.params.studyId,
      },
      order: [
        ['createdAt', 'DESC']
      ],
      limit: 1
    }).then(result => {
      models.baby_git = result[0]

    }).catch(err => {
      console.log("error :", err)
    })

  pReadingModels.baby_investigation_model.findAll(
    {
      where:
      {
        study_id: req.params.studyId,
      },
      order: [
        ['createdAt', 'DESC']
      ],
      limit: 1
    }).then(result => {
      models.baby_investigation = result[0]

    }).catch(err => {
      console.log("error :", err)
    })

  pReadingModels.baby_antibiotic_model.findAll(
    {
      where:
      {
        study_id: req.params.studyId,
      },
      order: [
        ['createdAt', 'DESC']
      ],
      limit: 1
    }).then(result => {
      models.baby_antibiotic = result[0]
    }).catch(err => {
      console.log("error :", err)
    })

  pReadingModels.baby_final_model.findAll(
    {
      where:
      {
        study_id: req.params.studyId,
      },
      order: [
        ['createdAt', 'DESC']
      ],
      limit: 1
    }).then(result => {
      models.baby_final = result[0]
      res.json(responseHelper.success(constant.success, models))
    }).catch(err => {
      res.json(responseHelper.serveError(constant.error_msg, err))
    })

}

exports.updateBabyAppearsModel = (req, res, next) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() });
    return;
  }

  pReadingModels.baby_appear_model.findAll(
    {
      where:
      {
        study_id: req.params.study_id,
        reading: req.params.reading
      }
    }).then(result => {

      if (result.length == 0) {
        const reqData = req.body;
        return pReadingModels.baby_appear_model.create(reqData)
      } 
      else {
        result = mapper.babyAppearsMapper(result[0], req.body)
        return result.save()
      }
    })
    .then(result => {
      pReadingModels.patient_model.findOne({
        where: {
          study_id: req.params.study_id
        }
      })
        .then(pResult => {
          pResult.updated_by = req.params.sUserId
          pResult.save()
        })
      return result
    })
    .then(result => {
      res.json(responseHelper.success(constant.data_updated_successfully, result))
    })
    .catch(err => {
      res.json(responseHelper.serveError(constant.error_msg, err))
    })
}

exports.updateBabyRespModel = (req, res, next) => {

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() });
    return;
  }
  pReadingModels.baby_resp_model.findAll(
    {
      where:
      {
        study_id: req.params.study_id,
        reading: req.params.reading
      }
    }).then(result => {

      console.log("baby resp model response :", result)

      if (result.length == 0) {

        const reqData = req.body;
        return pReadingModels.baby_resp_model.create(reqData)

      } else {
        var row = result[0]
        var baby_respiratory_support = JSON.parse(req.body.baby_respiratory_support);
        row.groaning = req.body.groaning,
          row.grunting = req.body.grunting,
          row.stridor = req.body.stridor,
          row.retraction = req.body.retraction,
          row.fast_breathing = req.body.fast_breathing,
          row.oxygen_saturation = req.body.oxygen_saturation,
          row.breathing_rate = req.body.breathing_rate,
          row.baby_chest_indrawing = req.body.baby_chest_indrawing,
          row.x_ray_result = req.body.x_ray_result,
          row.x_ray_status_done = req.body.x_ray_status_done,
          row.x_ray_status = req.body.x_ray_status,
          row.x_ray_diagnosis_any_other = req.body.x_ray_diagnosis_any_other,
          row.apnea_diagnosis = req.body.apnea_diagnosis,
          row.apnea_status = req.body.apnea_status,
          row.baby_respiratory_support = baby_respiratory_support,
          row.baby_respiratory_support_if_yes = req.body.baby_respiratory_support_if_yes,
          row.tab_name = req.body.tab_name
        return row.save()
      }
    })
    .then(result => {
      pReadingModels.patient_model.findOne({
        where: {
          study_id: req.params.study_id
        }
      })
        .then(pResult => {
          pResult.updated_by = req.params.sUserId
          pResult.save()
        })
      return result
    })
    .then(result => {
      res.json(responseHelper.success(constant.data_updated_successfully, req.body))
    })
    .catch(err => {
      res.json(responseHelper.serveError(constant.error_msg, err))
    })
}

exports.updateBabyCVModel = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() });
    return;
  }
  pReadingModels.baby_cv_model.findAll(
    {
      where:
      {
        study_id: req.params.study_id,
        reading: req.params.reading
      }
    }).then(result => {
      if (result.length == 0) {

        const reqData = req.body;
        return pReadingModels.baby_cv_model.create(reqData)

      } else {
        var row = result[0]
        row.heart_rate = req.body.heart_rate,
          row.urine_output = req.body.urine_output,
          row.baby_blood_pressure_mean_arterial_bp = req.body.baby_blood_pressure_mean_arterial_bp,
          row.baby_blood_pressure_upper_limb = req.body.baby_blood_pressure_upper_limb,
          row.baby_blood_pressure_lower_limb = req.body.baby_blood_pressure_lower_limb,
          row.capillary_refill_unit = req.body.capillary_refill_unit,
          row.low_peripheral_pulse_volume = req.body.low_peripheral_pulse_volume,
          row.cool_peripheries = req.body.cool_peripheries,
          row.two_d_echo_done = req.body.two_d_echo_done,
          row.two_d_echo_done_if_yes = req.body.two_d_echo_done_if_yes,
          row.baby_on_ionotropes = req.body.baby_on_ionotropes,
          row.central_line = req.body.central_line,
          row.skin_pustules = req.body.skin_pustules,
          row.infusion_of_blood_products = req.body.infusion_of_blood_products,
          row.central_line_if_applicable = req.body.central_line_if_applicable,
          row.central_line_value = req.body.central_line_value,
          row.central_line_insert_date = req.body.central_line_insert_date,
          row.central_line_removed_date = req.body.central_line_removed_date

        return row.save()
      }
    })
    .then(result => {
      pReadingModels.patient_model.findOne({
        where: {
          study_id: req.params.study_id
        }
      })
        .then(pResult => {
          pResult.updated_by = req.params.sUserId
          pResult.save()
        })
      return result
    })
    .then(result => {
      res.json(responseHelper.success(constant.data_updated_successfully, req.body))
    })
    .catch(err => {
      res.json(responseHelper.serveError(constant.error_msg, err))
    })
}

exports.updateBabyCNSModel = (req, res, next) => {

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() });
    return;
  }
  pReadingModels.baby_cns_model.findAll(
    {
      where:
      {
        study_id: req.params.study_id,
        reading: req.params.reading
      }
    }).then(result => {
      if (result.length == 0) {

        const reqData = req.body;
        return pReadingModels.baby_cns_model.create(reqData)

      } else {
        var row = result[0]
        row.features_of_encephalopathy = req.body.features_of_encephalopathy,
          row.seizures = req.body.seizures,
          row.abnormal_movements_like_tonic_posturing = req.body.abnormal_movements_like_tonic_posturing,
          row.baby_movement = req.body.baby_movement,
          row.af_bulge = req.body.af_bulge,
          row.tab_name = req.body.tab_name
        // row.baby_movement=req.body.baby_movement
        return row.save()
      }
    })
    .then(result => {
      pReadingModels.patient_model.findOne({
        where: {
          study_id: req.params.study_id
        }
      })
        .then(pResult => {
          pResult.updated_by = req.params.sUserId
          pResult.save()
        })
      return result
    })
    .then(result => {
      res.json(responseHelper.success(constant.data_updated_successfully, req.body))
    })
    .catch(err => {
      res.json(responseHelper.serveError(constant.error_msg, err))
    })
}

exports.updateBabyGITModel = (req, res, next) => {

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() });
    return;
  }

  pReadingModels.baby_git_model.findAll(
    {
      where:
      {
        study_id: req.params.study_id,
        reading: req.params.reading
      }
    }).then(result => {
      if (result.length == 0) {

        const reqData = req.body;
        return pReadingModels.baby_git_model.create(reqData)

      } else {
        var row = result[0]
        row.abdominal_dystension = req.body.abdominal_dystension,
          row.frequency_of_stools = req.body.frequency_of_stools,
          row.diarrhea = req.body.diarrhea,
          row.vomiting = req.body.vomiting,
          row.feeding_intolerance = req.body.feeding_intolerance,
          row.baby_movement = req.body.baby_movement,
          row.tab_name = req.body.tab_name
        return row.save()
      }
    })
    .then(result => {
      pReadingModels.patient_model.findOne({
        where: {
          study_id: req.params.study_id
        }
      })
        .then(pResult => {
          pResult.updated_by = req.params.sUserId
          pResult.save()
        })
      return result
    })
    .then(result => {
      res.json(responseHelper.success(constant.data_updated_successfully, req.body))
    })
    .catch(err => {
      res.json(responseHelper.serveError(constant.error_msg, err))
    })
}

exports.updateBabyInvestigationModel = (req, res, next) => {

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() });
    return;
  }
  pReadingModels.baby_investigation_model.findAll(
    {
      where:
      {
        study_id: req.params.study_id,
        reading: req.params.reading
      }
    }).then(result => {
      if (result.length == 0) {

        const reqData = req.body;
        return pReadingModels.baby_investigation_model.create(reqData)

      } else {
        var row = result[0]
        row.baby_thyroid_status = req.body.baby_thyroid_status,
          row.baby_thyroid_result = req.body.baby_thyroid_result,
          row.baby_blood_glucose = req.body.baby_blood_glucose,
          row.baby_haemoglobin_levels = req.body.baby_haemoglobin_levels,
          row.baby_c_reactive_protien_levels = req.body.baby_c_reactive_protien_levels,
          row.micro_esr = req.body.micro_esr,
          row.baby_procalcitonin_levels = req.body.baby_procalcitonin_levels,
          row.total_leucocute_count_unit = req.body.total_leucocute_count_unit,
          row.total_leucocute_count = req.body.total_leucocute_count,
          row.absolute_neutrophil_count = req.body.absolute_neutrophil_count,
          row.absolute_neutrophil_count_unit = req.body.absolute_neutrophil_count_unit,
          row.immature_to_mature_neutrophil_ratios = req.body.immature_to_mature_neutrophil_ratios,
          row.thrombocytopenia_unit = req.body.thrombocytopenia_unit,
          row.thrombocytopenia = req.body.thrombocytopenia,
          row.urine_rest_for_pus_cells = req.body.urine_rest_for_pus_cells,
          row.urine_culture_test = req.body.urine_culture_test,
          row.blood_culture_report = req.body.blood_culture_report,
          row.gram_positive_bacteria = req.body.gram_positive_bacteria,
          row.gram_positive_bacteria_if_other = req.body.gram_positive_bacteria_if_other,
          row.gram_negative_bacteria = req.body.gram_negative_bacteria,
          row.gram_negative_bacteria_if_other = req.body.gram_negative_bacteria_if_other,
          row.fungi = req.body.fungi,
          row.other_organism = req.body.other_organism,
          row.antibiotic_status_resisitant = req.body.antibiotic_status_resisitant,
          row.antibiotic_status_intermediate = req.body.antibiotic_status_intermediate,
          row.antibiotic_status_value = req.body.antibiotic_status_value,
          row.sodium = req.body.sodium,
          row.potassium = req.body.potassium,
          row.chlorine = req.body.chlorine,
          row.calcium = req.body.calcium,
          row.phosphate = req.body.phosphate,
          row.magnesium = req.body.magnesium,
          row.urea = req.body.urea,
          row.creatinine = req.body.creatinine,
          row.lactate_levels = req.body.lactate_levels,
          row.bilirubin_levels = req.body.bilirubin_levels,
          row.cord_ph = req.body.cord_ph,
          row.arrhythmia = req.body.arrhythmia,
          row.csf_culture = req.body.csf_culture,
          row.csf_culture_tsb_value = req.body.csf_culture_tsb_value,
          row.tab_name = req.body.tab_name
          row.prothrombin_type = req.body.prothrombin_type
          row.activated_partial_prothrombine_type = req.body.activated_partial_prothrombine_type,
          row.baby_c_reactive_protien_result = req.body.baby_c_reactive_protien_result


        return row.save()
      }
    })
    .then(result => {
      pReadingModels.patient_model.findOne({
        where: {
          study_id: req.params.study_id
        }
      })
        .then(pResult => {
          pResult.updated_by = req.params.sUserId
          pResult.save()
        })
      return result
    })
    .then(result => {
      res.json(responseHelper.success(constant.data_updated_successfully, req.body))
    })
    .catch(err => {
      res.json(responseHelper.serveError(constant.error_msg, err))
    })
}

exports.updateBabyAntibioticModel = (req, res, next) => {

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() });
    return;
  }

  pReadingModels.baby_antibiotic_model.findAll(
    {
      where:
      {
        study_id: req.params.study_id,
        reading: req.params.reading
      }
    }).then(result => {
      if (result.length == 0) {

        const reqData = req.body;
        return pReadingModels.baby_antibiotic_model.create(reqData)

      } else {
        var row = result[0]
        row.antibiotic_given = req.body.antibiotic_given,
          row.date_of_administration_of_antiobiotic = req.body.date_of_administration_of_antiobiotic,
          row.time_of_administration_of_antiobiotic_hours = req.body.time_of_administration_of_antiobiotic_hours,
          row.time_of_administration_of_antiobiotic_minute = req.body.time_of_administration_of_antiobiotic_minute,
          row.antibiotic_name = req.body.antibiotic_name,
          row.antibiotic_name_if_other = req.body.antibiotic_name_if_other,
          row.date_of_blood_samples_sent_for_culture_test = req.body.date_of_blood_samples_sent_for_culture_test,
          row.time_of_blood_samples_sent_for_culture_test_hours = req.body.time_of_blood_samples_sent_for_culture_test_hours,
          row.time_of_blood_samples_sent_for_culture_test_minute = req.body.time_of_blood_samples_sent_for_culture_test_minute,
          row.blood_sample_taken_prior_to_antiobiotic_administration = req.body.blood_sample_taken_prior_to_antiobiotic_administration
        return row.save()
      }
    })
    .then(result => {
      pReadingModels.patient_model.findOne({
        where: {
          study_id: req.params.study_id
        }
      })
        .then(pResult => {
          pResult.updated_by = req.params.sUserId
          pResult.save()
        })
      return result
    })
    .then(result => {
      res.json(responseHelper.success(constant.data_updated_successfully, req.body))
    })
    .catch(err => {
      res.json(responseHelper.serveError(constant.error_msg, err))
    })
}

exports.updateBabyFinalModel = (req, res, next) => {

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() });
    return;
  }
  pReadingModels.baby_final_model.findAll(
    {
      where:
      {
        study_id: req.params.study_id,
        reading: req.params.reading
      }
    }).then(result => {
      if (result.length == 0) {

        res.json(responseHelper.notFound(constant.no_record_found))

      } else {
        var row = result[0]
        row.days_of_stay_in_hospital = req.body.days_of_stay_in_hospital,
          row.final_diagnosis_sepsis = req.body.final_diagnosis_sepsis,
          row.final_diagnosis_rds = req.body.final_diagnosis_rds,
          row.final_diagnosis_ttnb = req.body.final_diagnosis_ttnb,
          row.final_diagnosis_jaundice = req.body.final_diagnosis_jaundice,
          row.final_diagnosis_lbw = req.body.final_diagnosis_lbw,
          // row.final_diagnosis_lga = req.body.final_diagnosis_lga,
          // row.final_diagnosis_aga = req.body.final_diagnosis_aga,
          row.final_diagnosis_anemia = req.body.final_diagnosis_anemia,
          row.final_diagnosis_dextochordia = req.body.final_diagnosis_dextochordia,
          row.final_diagnosis_hypoglycemia = req.body.final_diagnosis_hypoglycemia,
          row.final_diagnosis_hypocalcemia = req.body.final_diagnosis_hypocalcemia,
          row.final_diagnosis_gastroenteritis = req.body.final_diagnosis_gastroenteritis,
          row.final_diagnosis_perinatal_respiratory_depression = req.body.final_diagnosis_perinatal_respiratory_depression,
          row.final_diagnosis_shock = req.body.final_diagnosis_shock,
          row.final_diagnosis_feeding_intolerence = req.body.final_diagnosis_feeding_intolerence,
          row.baby_discharge_date = req.body.baby_discharge_date,
          //  row.final_diagnosis_sga = req.body.final_diagnosis_sga,
          row.final_diagnosis_eos_los = req.body.final_diagnosis_eos_los,
          row.final_diagnosis_other = req.body.final_diagnosis_other

        row.final_diagnosis_meningitis = req.body.final_diagnosis_meningitis
        row.final_diagnosis_hypoxia = req.body.final_diagnosis_hypoxia
        row.final_diagnosis_metabolic_acidosis = req.body.final_diagnosis_metabolic_acidosis
        row.final_diagnosis_asphyxia = req.body.final_diagnosis_asphyxia
        row.final_diagnosis_septic_arthritis = req.body.final_diagnosis_septic_arthritis
        row.final_diagnosis_endocarditis = req.body.final_diagnosis_endocarditis
        row.final_diagnosis_peritonitis = req.body.final_diagnosis_peritonitis
        row.final_diagnosis_soft_tissue_abscess = req.body.final_diagnosis_soft_tissue_abscess
        row.final_diagnosis_coagulopathy = req.body.final_diagnosis_coagulopathy
        row.final_diagnosis_uti = req.body.final_diagnosis_uti
        row.final_diagnosis_umblical_sepsis = req.body.final_diagnosis_umblical_sepsis
        row.final_diagnosis_bleeding_manifestation = req.body.final_diagnosis_bleeding_manifestation
        row.final_diagnosis_central_peripheral = req.body.final_diagnosis_central_peripheral
        row.final_lga_sga_aga_suspect = req.body.final_lga_sga_aga_suspect
        //  row.rupture_time=req.body.rupture_time ,
        row.discharge_status = req.body.discharge_status,
          row.final_diagnosis_skin_pustules = req.body.final_diagnosis_skin_pustules,
          row.final_diagnosis_seizures = req.body.final_diagnosis_seizures,
          row.final_diagnosis_pneumonia = req.body.final_diagnosis_pneumonia,
          row.final_diagnosis_pulmonary_hemorrhage = req.body.final_diagnosis_pulmonary_hemorrhage,
          // row.final_diagnosis_pulmonary_hemorrhage = req.body.pulmonary_hemorrhage,
          row.final_diagnosis_thrombocytopenia = req.body.final_diagnosis_thrombocytopenia



        return row.save()
      }
    })
    .then(result => {
      pReadingModels.patient_model.findOne({
        where: {
          study_id: req.params.study_id
        }
      })
        .then(pResult => {
          pResult.updated_by = req.params.sUserId
          pResult.save()
        })
      return result
    })
    .then(result => {
      res.json(responseHelper.success(constant.data_updated_successfully, req.body))
    })
    .catch(err => {
      res.json(responseHelper.serveError(constant.error_msg, err))
    })
}

exports.generateReport = (req, res, next) => {

  // WHERE hospital_id =:hospital_id

  sequelize.query('SELECT * FROM vw_get_all_data',
    {
      // replacements: { 
      //     hospital_id:req.params.hospitalId
      // }, 
      type: sequelize.QueryTypes.SELECT
    }
  ).then(result => {
    console.log(result.length)
    result.forEach((data, index) => {

      if (data.time_of_reading_hours == null) {
        data.time_of_reading_hours = '00'
      }
      if (data.time_of_reading_minute == null) {
        data.time_of_reading_minute = '00'
      }
      data.reading_time = data.time_of_reading_hours + ":" + data.time_of_reading_minute
      if (data.baby_respiratory_support != 'NA' && data.baby_respiratory_support != 'Ventilator') {
        var babyRespiratorySupportObj = JSON.parse(data.baby_respiratory_support)
        // console.log(data.id)
        var babyRespiratorySupportStr = ''
        babyRespiratorySupportObj.forEach((data, index) => {
          if (babyRespiratorySupportStr.length == 0) {
            babyRespiratorySupportStr = data.itemName
          } else {
            babyRespiratorySupportStr = babyRespiratorySupportStr + "," + data.itemName
          }
        })
        data.baby_respiratory_support = babyRespiratorySupportStr
      }

      if (data.gram_positive_bacteria != 'NA') {
        var gramPositiveBacteriaObj = JSON.parse(data.gram_positive_bacteria)
        var gramPositiveBacteriaStr = ''
        gramPositiveBacteriaObj.forEach((data, index) => {
          if (gramPositiveBacteriaStr.length == 0) {
            gramPositiveBacteriaStr = data.itemName
          } else {
            gramPositiveBacteriaStr = gramPositiveBacteriaStr + "," + data.itemName
          }
        })
        data.gram_positive_bacteria = gramPositiveBacteriaStr
      }

      if (data.gram_negative_bacteria != 'NA') {
        var gramNegativeBacteriaObj = JSON.parse(data.gram_negative_bacteria)
        var gramNegativeBacteriaStr = ''
        gramNegativeBacteriaObj.forEach((data, index) => {
          if (gramNegativeBacteriaStr.length == 0) {
            gramNegativeBacteriaStr = data.itemName
          } else {
            gramNegativeBacteriaStr = gramNegativeBacteriaStr + "," + data.itemName
          }
        })
        data.gram_negative_bacteria = gramNegativeBacteriaStr
      }


      if (data.fungi != 'NA') {
        var fungiObj = JSON.parse(data.fungi)
        var fungiStr = ''
        fungiObj.forEach((data, index) => {
          if (fungiStr.length == 0) {
            fungiStr = data.itemName
          } else {
            fungiStr = fungiStr + data.itemName
          }
        })
        data.fungi = fungiStr
      }

      if (data.antibiotic_status_value != 'NA') {
        var antibioticStatusValueObj = JSON.parse(data.antibiotic_status_value)
        var antibioticStatusValueStr = ''
        antibioticStatusValueObj.forEach((data, index) => {
          if (antibioticStatusValueStr.length == 0) {
            antibioticStatusValueStr = data.itemName
          } else {
            antibioticStatusValueStr = antibioticStatusValueStr + ',' + data.itemName
          }
        })
        data.antibiotic_status_value = antibioticStatusValueStr
      }

      if (data.antibiotic_name != 'NA' && data.antibiotic_name != 'Vancomycin') {
        var antibioticNameObj = JSON.parse(data.antibiotic_name)
        var antibioticNameStr = ''
        antibioticNameObj.forEach((data, index) => {
          if (antibioticNameStr.length == 0) {
            antibioticNameStr = data.itemName
          } else {
            antibioticNameStr = antibioticNameStr + "," + data.itemName
          }
        })
        data.antibiotic_name = antibioticNameStr
      }

      if (data.antibiotic_status_resisitant != 'NA') {
        var antibioticStatusResisitantObj = JSON.parse(data.antibiotic_status_resisitant)
        var antibioticStatusResisitantStr = ''
        antibioticStatusResisitantObj.forEach((data, index) => {
          if (antibioticStatusResisitantStr.length == 0) {
            antibioticStatusResisitantStr = data.itemName
          } else {
            antibioticStatusResisitantStr = antibioticStatusResisitantStr + "," + data.itemName
          }
        })
        data.antibiotic_status_resisitant = antibioticStatusResisitantStr
      }

      if (data.antibiotic_status_intermediate != 'NA') {
        var antibioticStatusIntermediateObj = JSON.parse(data.antibiotic_status_intermediate)
        var antibioticStatusIntermediateStr = ''
        antibioticStatusIntermediateObj.forEach((data, index) => {
          if (antibioticStatusIntermediateStr.length == 0) {
            antibioticStatusIntermediateStr = data.itemName
          } else {
            antibioticStatusIntermediateStr = antibioticStatusIntermediateStr + "," + data.itemName
          }
        })
        data.antibiotic_status_intermediate = antibioticStatusIntermediateStr
      }
    })

    var filename = 'BMR Report.xlsx'

    var workbook = new excel.Workbook();

    var sheet = workbook.addWorksheet('Report');

    sheet.columns = [
      { header: 'Record ID', key: 'id', width: 7 },
      { header: 'Hospital Name', key: 'hospital_name', width: 20 },
      { header: 'Branch Name', key: 'hospital_branch_name', width: 20 },
      { header: 'Baby Medical Record Number', key: 'baby_medical_record_number', width: 20 },
      { header: 'Mother Medical Record Number', key: 'baby_mother_medical_record_number', width: 20 },
      { header: 'Type of Record', key: 'record_type', width: 20 },
      { header: 'Baby Admission Type', key: 'baby_admission_type', width: 20 },
      { header: 'Baby Birth Date', key: 'baby_birth_date', width: 20 },
      { header: 'Baby Place of Birth (Pincode)', key: 'baby_place_of_birth_pin_code', width: 20 },
      { header: 'Baby Place of Birth ( Name)', key: 'baby_place_of_birth_name', width: 20 },
      { header: 'Baby Birth time (Hours)', key: 'baby_birth_time_hours', width: 20 },
      { header: 'Baby Birth Time (Minutes)', key: 'baby_birth_time_minit', width: 20 },
      { header: 'Baby Age at Admission (Days)', key: 'baby_age_of_admission', width: 20 },
      { header: 'Baby Apgar Score (One Minute)', key: 'baby_apgar_score_one_min', width: 20 },
      { header: 'Baby Apgar Score (Five Minutes)', key: 'baby_apgar_score_five_min', width: 20 },
      { header: 'Baby Apgar Score (Ten Minitues)', key: 'baby_apgar_score_ten_min', width: 20 },
      { header: 'Baby Preterm ( Yes /No)', key: 'baby_preterm', width: 20 },
      { header: 'Preliminary Diagnosis ( EOS/LOS/NA)', key: 'baby_condition_yes_eos_los', width: 20 },
      { header: 'Preliminary Diagnosis (RDS)', key: 'baby_condition_rds_yes_no', width: 20 },
      { header: 'Baby Gender', key: 'baby_gender', width: 20 },
      { header: 'Preliminary Diagnosis (Jaundice)', key: 'baby_condition_jaundice_suspect', width: 20 },
      { header: 'Preliminary Diagnosis (TTNB)', key: 'baby_condition_ttnb_suspect', width: 20 },
      { header: 'Preliminary Diagnosis (LGA)', key: 'baby_condition_lga_suspect', width: 20 },
      { header: 'Preliminary Diagnosis (AGA)', key: 'baby_condition_aga_suspect', width: 20 },
      { header: 'Preliminary Diagnosis (SGA)', key: 'baby_condition_sga_suspect', width: 20 },
      { header: 'Preliminary Diagnosis (Shock)', key: 'baby_shock_aga_suspect', width: 20 },
      { header: 'Preliminary Diagnosis (Dextrocardia)', key: 'baby_condition_dextrocordia_suspect', width: 20 },
      { header: 'Preliminary Diagnosis (Anemia)', key: 'baby_condition_anemia_suspect', width: 20 },
      { header: 'Preliminary Diagnosis (LBW)', key: 'baby_condition_lbw_suspect', width: 20 },
      { header: 'Place of Delivery', key: 'place_of_delivery', width: 20 },
      { header: 'Birth Facility', key: 'birth_facility', width: 20 },
      { header: 'Baby Gestational Age (Weeks)', key: 'baby_gestational_age', width: 20 },
      { header: 'Baby Gestational Age (Unit)', key: 'baby_gestational_age_unit', width: 20 },
      { header: 'Baby Weight at Birth (Kgs)', key: 'baby_weight_at_birth', width: 20 },
      { header: 'Baby Weight At Birth (Unit)', key: 'baby_weight_at_birth_unit', width: 20 },
      { header: 'Preliminary Diagnosis (Sepsis) ', key: 'baby_condition_suspect', width: 20 },
      { header: 'Baby Day of Event for Sepsis', key: 'baby_day_of_event', width: 20 },
      { header: 'Baby Weight at admission (Kgs)', key: 'baby_weight_at_admission', width: 20 },
      { header: 'Baby Weight At Admission (Unit)', key: 'baby_weight_at_admission_unit', width: 20 },
      { header: 'Preliminary Diagnosis (Other)', key: 'baby_condition_other_if_suspect', width: 20 },
      { header: 'Preliminary Diagnosis (Perinatal Depression)', key: 'prelim_diagnosis_perinatal', width: 20 },
      { header: 'Preliminary Diagnosis (Hypoglycemia)', key: 'prelim_diagnosis_hypoglycemia', width: 20 },
      { header: 'Preliminary Diagnosis (Hypocalcemia)', key: 'prelim_diagnosis_hypocalcemia', width: 20 },
      { header: 'Preliminary Diagnosis (Feeding Intolerance)', key: 'prelim_diagnosis_feeding_intolerence', width: 20 },
      { header: 'Preliminary Diagnosis (Gastroenteritis)', key: 'prelim_diagnosis_gastroenteritis', width: 20 },
      { header: 'Baby Date Of Admission', key: 'baby_date_of_admission', width: 20 },
      { header: 'Mother Age (Years)', key: 'mother_age', width: 20 },
      { header: 'Mother Weight (Kgs)', key: 'mother_weight', width: 20 },
      { header: 'Mother Weight (Unit)', key: 'mother_weight_unit', width: 20 },
      { header: 'Mother Height (Value)', key: 'mother_height', width: 20 },
      { header: 'Mother Height (Unit)', key: 'mother_height_unit', width: 20 },
      { header: 'Mother (Haemoglobin Value)', key: 'mother_haemoglobin', width: 20 },
      { header: 'Mother (BMI)', key: 'mother_bmi', width: 20 },
      { header: 'Mother Blood Pressure (Systolic)', key: 'maternal_blood_pressure', width: 20 },
      { header: 'MotherBlood Pressure (Diastolic)', key: 'maternal_blood_pressure_diastolic', width: 20 },
      { header: 'Maternnal Diabetes (Present)', key: 'maternal_diabetes', width: 20 },
      { header: 'Maternal Fever (Value)', key: 'maternal_fever', width: 20 },
      { header: 'Maternal Fever (Unit)', key: 'maternal_fever_unit', width: 20 },
      { header: 'Maternal Fever (Present)', key: 'maternal_fever_basic', width: 20 },
      { header: 'Maternal Throid Function Normal (Yes /No)', key: 'maternal_thyroid_function', width: 20 },
      { header: 'Maternal Throid Function (If Abnormal)', key: 'maternal_thyroid_function_basic', width: 20 },
      { header: 'Maternal Thyroid Function (Value)', key: 'maternal_thyroid_function_unit_basic', width: 20 },
      { header: 'Maternal Throid Function (Unit)', key: 'maternal_thyroid_function_unit_basic_unit', width: 20 },
      { header: 'More than 3 Vaginal Examinations done during labor', key: 'more_than_3_vaginal_examinations_during_labor', width: 20 },
      { header: 'Type of Rupture of Membranes  (PROM/SROM/NA)', key: 'rupture_of_membranes_rom_one', width: 20 },
      { header: 'Leaking PV (Present)', key: 'leaking_pv', width: 20 },
      { header: 'Rupture of Membranes (ROM - Present)', key: 'rupture_of_membranes_rom', width: 20 },
      { header: 'Smelly Amniotic Fluid (Present)', key: 'smelly_amniotic_fluid', width: 20 },
      { header: 'Chorioamnionitis (Present)', key: 'chorioamnionitis', width: 20 },
      { header: 'GBS Infection (Present)', key: 'gbs_infection', width: 20 },
      { header: 'Colonisation or Urinary Tract Infection (Present)', key: 'colonisation_or_urinary_tract_infection', width: 20 },
      { header: 'Torch Infections (Present)', key: 'torch_infections', width: 20 },
      { header: 'Type of Delivery', key: 'type_of_delivery', width: 20 },
      { header: 'Delayed Cord Clamping (Present)', key: 'delayed_cord_clamping', width: 20 },
      { header: 'Vaginal Swab Culture Result (Positive/Negitive/NA)', key: 'vaginal_swab_culture_two', width: 20 },
      { header: 'Vaginal Swab Culture Result (Organism)', key: 'vaginal_swab_culture_three', width: 20 },
      { header: 'Amniotic Fluid Culture Done (Yes/No/NA)', key: 'amniotic_fluid_culture', width: 20 },
      { header: 'Amniotic Fluid Culture Result (Organism)', key: 'amniotic_fluid_culture_three', width: 20 },
      { header: 'Amniotic Fluid Culture Result (Positive/Negitive/NA)', key: 'amniotic_fluid_culture_two', width: 20 },
      { header: 'Rupture of Membranes (No of hrs for ROM)', key: 'rupture_of_membranes_rom_two', width: 20 },
      { header: 'Vaginal Swab Culture Test Done (Yes/No)', key: 'vaginal_swab_culture', width: 20 },
      { header: 'Baby Appearance', key: 'baby_appearance', width: 20 },
      { header: 'Baby Skin Colour', key: 'baby_skin_colour', width: 20 },
      { header: 'Baby Cry Sound', key: 'baby_cry_sound', width: 20 },
      { header: 'Baby Cry Sound Status', key: 'baby_cry_sound_status', width: 20 },
      { header: 'Hypotonia Muscular Response (One Min After Birth)', key: 'hypotonia_muscular_response_one_min_after_birth', width: 20 },
      { header: 'Hypotonia Muscular Response (Five Mins After Birth)', key: 'hypotonia_muscular_response_five_min_after_birth', width: 20 },
      { header: 'Excessive Sleeping Present (Yes/No/NA)', key: 'excessive_sleeping', width: 20 },
      { header: 'Hypothermia (Present)', key: 'hypothermia', width: 20 },
      { header: 'Hypthermia Status (Value)', key: 'hypothermia_status_value', width: 20 },
      { header: 'Hypothermia (Unit)', key: 'hypothermia_status', width: 20 },
      { header: 'Baby Feeding Status', key: 'baby_feeding_status', width: 20 },
      { header: 'Baby Jaundice Present', key: 'baby_jaundice', width: 20 },
      { header: 'Breast Feeding Initiation', key: 'breast_feeding_initiation', width: 20 },
      { header: 'Kangaroo Mother Care', key: 'kangaroo_mother_care', width: 20 },
      { header: 'Umblical Discharge Present', key: 'umbilical_discharge', width: 20 },
      { header: 'Groaning (Present)', key: 'groaning', width: 20 },
      { header: 'Grunting (Present)', key: 'grunting', width: 20 },
      { header: 'Stridor (Present)', key: 'stridor', width: 20 },
      { header: 'Retraction (Present)', key: 'retraction', width: 20 },
      { header: 'Fast Breathing (Present)', key: 'fast_breathing', width: 20 },
      { header: 'Oxygen Saturation (Value)', key: 'oxygen_saturation', width: 20 },
      { header: 'Breathing Rate (Value)', key: 'breathing_rate', width: 20 },
      { header: 'Baby Chest in Drawing (Present)', key: 'baby_chest_indrawing', width: 20 },
      { header: 'X-Ray (Status - Done)', key: 'x_ray_status_done', width: 20 },
      { header: 'X-Ray (Result)', key: 'x_ray_result', width: 20 },
      { header: 'X-Ray Diagnosis (Any Other)', key: 'x_ray_diagnosis_any_other', width: 20 },
      { header: 'Apnea Status (Present)', key: 'apnea_status', width: 20 },
      { header: 'Apnea Diagnosis', key: 'apnea_diagnosis', width: 20 },
      { header: 'Baby Respiratory Support', key: 'baby_respiratory_support', width: 20 },
      { header: 'Baby Respiratory Support (Present)', key: 'baby_respiratory_support_if_yes', width: 20 },
      { header: 'Heart Rate (Value)', key: 'heart_rate', width: 20 },
      { header: 'Urine Output (Value)', key: 'urine_output', width: 20 },
      { header: 'Baby Blood Pressure (Systolic)', key: 'baby_blood_pressure_mean_arterial_bp', width: 20 },
      { header: 'Baby Blood Pressure (Diastolic)', key: 'baby_blood_pressure_upper_limb', width: 20 },
      { header: 'Baby Blood Pressure (Mean Value)', key: 'baby_blood_pressure_lower_limb', width: 20 },
      { header: 'Capillary Refill Time (Value)', key: 'capillary_refill_unit', width: 20 },
      { header: 'Low Peripheral Pulse Volume (Present)', key: 'low_peripheral_pulse_volume', width: 20 },
      { header: 'Cool Peripheries (Present)', key: 'cool_peripheries', width: 20 },
      { header: '2D Echo (Status-Done)', key: 'two_d_echo_done', width: 20 },
      { header: '2D Echo Diagnosis', key: 'two_d_echo_done_if_yes', width: 20 },
      { header: 'Baby on Inotropes', key: 'baby_on_ionotropes', width: 20 },
      { header: 'Central Line Inserted', key: 'central_line', width: 20 },
      { header: 'Skin Pustules(Present)', key: 'skin_pustules', width: 20 },
      { header: 'Infusion Of Blood Products', key: 'infusion_of_blood_products', width: 20 },
      { header: 'Features Of Encephalopathy', key: 'features_of_encephalopathy', width: 20 },
      { header: 'Seizures(Present)', key: 'seizures', width: 20 },
      { header: 'Abnormal Movements Like Tonic Posturing (Present)', key: 'abnormal_movements_like_tonic_posturing', width: 20 },
      { header: 'AF Bulge (Present)', key: 'af_bulge', width: 20 },
      { header: 'Abdominal Dystension (Present)', key: 'abdominal_dystension', width: 20 },
      { header: 'Frequency of Stools', key: 'frequency_of_stools', width: 20 },
      { header: 'Diarrhea (Present)', key: 'diarrhea', width: 20 },
      { header: 'Vomiting (Present)', key: 'vomiting', width: 20 },
      { header: 'Feeding Intolerance (Present)', key: 'feeding_intolerance', width: 20 },
      { header: 'Baby Movement on Stimulation', key: 'baby_movement', width: 20 },
      { header: 'Baby Thyroid Status', key: 'baby_thyroid_status', width: 20 },
      { header: 'Baby Thyroid Result (Value)', key: 'baby_thyroid_result', width: 20 },
      { header: 'Baby Blood Glucose Level (Value)', key: 'baby_blood_glucose', width: 20 },
      { header: 'Baby Haemoglobin Level (Value)', key: 'baby_haemoglobin_levels', width: 20 },
      { header: 'Baby C-Reactive Protien Level (Value)', key: 'baby_c_reactive_protien_levels', width: 20 },
      { header: 'Micro ESR Level (Value)', key: 'micro_esr', width: 20 },
      { header: 'Baby Procalcitonin Level (Value)', key: 'baby_procalcitonin_levels', width: 20 },
      { header: 'Total Leucocyte Count (Value)', key: 'total_leucocute_count', width: 20 },
      { header: 'Total Leucocyte Count (Unit)', key: 'total_leucocute_count_unit', width: 20 },
      { header: 'Absolute Neutrophil Count (Value)', key: 'absolute_neutrophil_count', width: 20 },
      { header: 'Absolute Neutrophil Count (Unit)', key: 'absolute_neutrophil_count_unit', width: 20 },
      { header: 'Immature To Mature Neutrophil Ratio (Value)', key: 'immature_to_mature_neutrophil_ratios', width: 20 },
      { header: 'Thrombocytopenia (Value)', key: 'thrombocytopenia', width: 20 },
      { header: 'Thrombocytopenia (Unit)', key: 'thrombocytopenia_unit', width: 20 },
      { header: 'Urine Test for Pus cells (Result)', key: 'urine_rest_for_pus_cells', width: 20 },
      { header: 'Urine Culture Test (Result)', key: 'urine_culture_test', width: 20 },
      { header: 'Blood Culture Test (Result)', key: 'blood_culture_report', width: 20 },
      { header: 'Gram Positice Bacteria (Organism)', key: 'gram_positive_bacteria', width: 20 },
      { header: 'Gram Positice Bacteria (Organism)', key: 'gram_negative_bacteria', width: 20 },
      { header: 'Gram Positive Bacteria(Other Organism)', key: 'gram_positive_bacteria_if_other', width: 20 },
      { header: 'Gram Negative Bacteria (Organism)', key: 'gram_negative_bacteria_if_other', width: 20 },
      { header: 'Fungi', key: 'fungi', width: 20 },
      { header: 'Other Organism', key: 'other_organism', width: 20 },
      { header: 'Other Organism', key: 'other_organism', width: 20 },
      { header: 'Sodium (Value)', key: 'sodium', width: 20 },
      { header: 'Potassium (Value)', key: 'potassium', width: 20 },
      { header: 'Chlorine (Value)', key: 'chlorine', width: 20 },
      { header: 'Calcium (Value)', key: 'calcium', width: 20 },
      { header: 'Phosphate (Value)', key: 'phosphate', width: 20 },
      { header: 'Magnesium (Value)', key: 'magnesium', width: 20 },
      { header: 'Urea (Value)', key: 'urea', width: 20 },
      { header: 'Creatinine (Value)', key: 'creatinine', width: 20 },
      { header: 'Lactate Levels (Value)', key: 'lactate_levels', width: 20 },
      { header: 'Bilirubin Levels (Value)', key: 'bilirubin_levels', width: 20 },
      { header: 'Cord Ph (Value)', key: 'cord_ph', width: 20 },
      { header: 'Arrhythmia (Present)', key: 'arrhythmia', width: 20 },
      { header: 'CSF Culture Test (Result)', key: 'csf_culture', width: 20 },
      { header: 'CSF Culture Test (Value)', key: 'csf_culture_tsb_value', width: 20 },
      { header: 'Name of Antibiotic Administered', key: 'antibiotic_status_value', width: 20 },
      { header: 'Antibiotic Administered', key: 'antibiotic_given', width: 20 },
      { header: 'Date Of Administration Of Antiobiotic', key: 'date_of_administration_of_antiobiotic', width: 20 },
      { header: 'Time Of Administration Of Antiobiotic (Hours)', key: 'time_of_administration_of_antiobiotic_hours', width: 20 },
      { header: 'Time Of Administration Of Antiobiotic (Minutes)', key: 'time_of_administration_of_antiobiotic_minute', width: 20 },
      { header: 'Antibiotic Name', key: 'antibiotic_name', width: 20 },
      { header: 'Name of Antibiotic Administered (Other if any)', key: 'antibiotic_name_if_other', width: 20 },
      { header: 'Grade of Antibiotic', key: 'grade_of_antibiotic', width: 20 },
      { header: 'Date of Blood Sample Sent for Culture Test', key: 'date_of_blood_samples_sent_for_culture_test', width: 20 },
      { header: 'Time Of Blood Samples Sent For Culture Test (Hours)', key: 'time_of_blood_samples_sent_for_culture_test_hours', width: 20 },
      { header: 'Time Of Blood Samples Sent For Culture Test (Minutes)', key: 'time_of_blood_samples_sent_for_culture_test_minute', width: 20 },
      { header: 'Blood Sample Taken Prior To Antiobiotic Administration', key: 'blood_sample_taken_prior_to_antiobiotic_administration', width: 20 },
      { header: 'Number of days of stay in Hospital', key: 'days_of_stay_in_hospital', width: 20 },
      { header: 'Final Diagnosis - Sepsis (Present)', key: 'final_diagnosis_sepsis', width: 20 },
      { header: 'Final Diagnosis - RDS (Present)', key: 'final_diagnosis_rds', width: 20 },
      { header: 'Final Diagnosis - TTNB (Present)', key: 'final_diagnosis_ttnb', width: 20 },
      { header: 'Final Diagnosis - Jaundice (Present)', key: 'final_diagnosis_jaundice', width: 20 },
      { header: 'Final Diagnosis - LBW (Present)', key: 'final_diagnosis_lbw', width: 20 },
      // { header: 'Final Diagnosis - LGA (Present)', key: 'final_diagnosis_lga', width: 20 },
      //{ header: 'Final Diagnosis - AGA (Present)', key: 'final_diagnosis_aga', width: 20 },
      // { header: 'Final Diagnosis - SGA (Present)', key: 'final_diagnosis_sga', width: 20 },
      { header: 'Final Diagnosis - Anemia (Present)', key: 'final_diagnosis_anemia', width: 20 },
      { header: 'Final Diagnosis - Congenital Heart Disease (Present)', key: 'final_diagnosis_dextochordia', width: 20 },
      { header: 'Final Diagnosis - Hypoglycemia (Present)', key: 'final_diagnosis_hypoglycemia', width: 20 },
      { header: 'Final Diagnosis - Hypocalcemia (Present)', key: 'final_diagnosis_hypocalcemia', width: 20 },
      { header: 'Final Diagnosis - Gastroenteritis (Present)', key: 'final_diagnosis_gastroenteritis', width: 20 },
      { header: 'Final Diagnosis - Perinatal Depression (Present)', key: 'final_diagnosis_perinatal_respiratory_depression', width: 20 },
      { header: 'Final Diagnosis - Shock (Present)', key: 'final_diagnosis_shock', width: 20 },
      { header: 'Final Diagnosis - Feeding Intolerance (Present)', key: 'final_diagnosis_feeding_intolerence', width: 20 },
      { header: 'Baby Discharge Date', key: 'baby_discharge_date', width: 20 },
      { header: 'Antibiotic Status (Resistant)', key: 'antibiotic_status_resisitant', width: 20 },
      { header: 'Antibiotic Status (Intermediate)', key: 'antibiotic_status_intermediate', width: 20 },
      { header: 'Final Diagnosis (EOS/LOS)', key: 'final_diagnosis_eos_los', width: 20 },
      { header: 'Final Diagnosis (Other)', key: 'final_diagnosis_other', width: 20 },
      { header: 'Record Reading Number', key: 'reading', width: 20 },
      { header: 'Record Reading Date', key: 'reading_date', width: 20 },
      { header: 'Record Reading Time', key: 'reading_time', width: 20 },
      { header: 'Date of Record Entry', key: 'createdAt', width: 10 },
    ]

    result.forEach((data, index) => {
      sheet.addRow(data)
    })

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader("Content-Disposition", "attachment; filename=" + filename)

    workbook.xlsx.write(res)
      .then(function (data) {
      });
  })
    .catch(err => {
      res.json(responseHelper.serveError(constant.error_msg, err))
    })
}

exports.saveBabyMedicalRecord = (req, res, next) => {

  var patientBasicInfos = {
    hospital_id: req.params.hospitalId,
    hospital_branch_id: req.params.hospitalBranchId,
    baby_medical_record_number: req.body.bmrn,
    baby_mother_medical_record_number: req.body.mmrn,
    deleted_flag: 0,
    active_flag: 1
  }

  var patient = {
    baby_name: req.body.babyName,
    mother_name: req.body.motherName,
    father_name: req.body.fatherName,
    primary_contact_no: req.body.contactNumberPrimary,
    secondary_contact_no: req.body.contactNumberSecondary,
    address: req.body.address,
    city: req.body.city,
    state: req.body.state,
    pincode: req.body.pincode,
    nationality: req.body.nationality,
    email_id: req.body.email,
    active_flag: req.body.status,
    created_by: enumConst.userType.hospital_branch,
    deleted_flag: 0
  }

  pReadingModels.basic_model.findAll({
    where: {
      baby_medical_record_number: req.body.bmrn,
      hospital_branch_id: req.params.hospitalBranchId
    }
  }).then(result => {
    if (result.length > 0) {
      res.json(responseHelper.alreadyExist('Baby medical record already exist', result))
    } else {
      pReadingModels.basic_model.create(patientBasicInfos)
        .then(result => {
          if (result != null) {
            patient.study_id = result.id
            patient = pReadingModels.patient_model.create(patient)
          }
          // return patient
          res.json(responseHelper.success(constant.success, result));
        })
    }
    // return result
  }).catch(err => {
    res.json(responseHelper.serveError(constant.error_msg, err))
  })

}

exports.getBabyMedicalRecord = async (req, res, next) => {
  var start = (req.params.start - 1) * req.params.end
  var hospital_id = req.params.hospitalId
  var hospital_branch_id = req.params.hospitalBranchId
  var isStaff = eval(req.params.isStaff);
  var staffId = req.params.staffId;
  let searchText = '%' + req.query.searchText + '%'
  let query = null
  if (req.query.searchText == "null") {

    query = `SELECT patient_infos.baby_name,patient_infos.mother_name, 
      patient_infos.father_name,patient_infos.primary_contact_no,patient_infos.secondary_contact_no,
      patient_infos.createdAt,patient_infos.updated_by, 
      patient_infos.address,patient_infos.city,patient_infos.state,patient_infos.pincode, 
      patient_infos.nationality,patient_infos.email_id,patient_infos.study_id, 
      patient_infos.active_flag AS status , patient_infos.patient_id,patient_infos.created_by, 
      patient_basic_infos.hospital_id,m_hospitals.hospital_name,patient_basic_infos.hospital_branch_id, 
      patient_basic_infos.baby_medical_record_number,patient_basic_infos.baby_mother_medical_record_number, 
      m_hospitals_branches.branch_name,patient_basic_infos.id AS patient_basic_infos_id
      FROM patient_infos 
      JOIN patient_basic_infos ON patient_basic_infos.id=patient_infos.study_id`;
    if (isStaff) {
      query += ` JOIN map_staff_hospitals ON 
        patient_basic_infos.hospital_branch_id = map_staff_hospitals.hospital_branch_id`;
    }
    query += ` JOIN m_hospitals_branches ON  
      m_hospitals_branches.hospital_branch_id=patient_basic_infos.hospital_branch_id 
      JOIN m_hospitals ON  
      m_hospitals.hospital_id=patient_basic_infos.hospital_id 
      WHERE patient_basic_infos.hospital_id=:hospital_id`
    if (!isStaff) {
      query += ` and patient_basic_infos.hospital_branch_id=:hospital_branch_id`;
    }
    if (isStaff) {
      query += ` and patient_infos.active_flag =1 and map_staff_hospitals.staff_id=:staffID and map_staff_hospitals.active_flag = 1`;
    }
    query += ' order by patient_infos.createdAt desc LIMIT ' + req.params.end + ' OFFSET ' + start;
  }
  else {
    // query = `SELECT patient_infos.baby_name,patient_infos.mother_name, patient_infos.father_name,patient_infos.primary_contact_no,patient_infos.secondary_contact_no,patient_infos.createdAt,patient_infos.updated_by, patient_infos.address,patient_infos.city,patient_infos.state,patient_infos.pincode, patient_infos.nationality,patient_infos.email_id,patient_infos.study_id, patient_infos.active_flag AS status ,patient_infos.patient_id,patient_infos.created_by, 
    //     patient_basic_infos.hospital_id,patient_basic_infos.hospital_name,patient_basic_infos.hospital_branch_id, patient_basic_infos.baby_medical_record_number,patient_basic_infos.baby_mother_medical_record_number, 
    //     m_hospitals_branches.branch_name,
    //     patient_basic_infos.id AS patient_basic_infos_id 
    //     FROM patient_infos join patient_basic_infos 
    //     on patient_basic_infos.id=patient_infos.study_id
    //     join m_hospitals_branches
    //     on m_hospitals_branches.hospital_branch_id=patient_basic_infos.hospital_branch_id
    //     and ( patient_infos.mother_name LIKE(:searchText)
    //     or patient_basic_infos.baby_medical_record_number like(:searchText)
    //     or patient_basic_infos.baby_mother_medical_record_number LIKE (:searchText)
    //     or patient_infos.primary_contact_no LIKE (:searchText)
    //     or patient_infos.createdAt LIKE (:searchText)
    //     or patient_infos.active_flag LIKE (:searchText)
    //     or patient_infos.updatedAt LIKE (:searchText))
    //     where patient_basic_infos.hospital_id=:hospital_id and 
    //     patient_basic_infos.hospital_branch_id=:hospital_branch_id`

    // if(isStaff){
    //   query += ` and patient_infos.active_flag =1`
    // }

    query = `SELECT patient_infos.baby_name,patient_infos.mother_name, 
      patient_infos.father_name,patient_infos.primary_contact_no,patient_infos.secondary_contact_no,
      patient_infos.createdAt,patient_infos.updated_by, 
      patient_infos.address,patient_infos.city,patient_infos.state,patient_infos.pincode, 
      patient_infos.nationality,patient_infos.email_id,patient_infos.study_id, 
      patient_infos.active_flag AS status , patient_infos.patient_id,patient_infos.created_by, 
      patient_basic_infos.hospital_id,m_hospitals.hospital_name,patient_basic_infos.hospital_branch_id, 
      patient_basic_infos.baby_medical_record_number,patient_basic_infos.baby_mother_medical_record_number, 
      m_hospitals_branches.branch_name,patient_basic_infos.id AS patient_basic_infos_id
      FROM patient_infos 
      JOIN patient_basic_infos ON patient_basic_infos.id=patient_infos.study_id`;
    if (isStaff) {
      query += ` JOIN map_staff_hospitals ON 
        patient_basic_infos.hospital_branch_id = map_staff_hospitals.hospital_branch_id`;
    }
    query += ` JOIN m_hospitals_branches ON  
      m_hospitals_branches.hospital_branch_id=patient_basic_infos.hospital_branch_id
      JOIN m_hospitals ON  
      m_hospitals.hospital_id=patient_basic_infos.hospital_id  
      WHERE patient_basic_infos.hospital_id=:hospital_id`
    if (!isStaff) {
      query += ` and patient_basic_infos.hospital_branch_id=:hospital_branch_id`;
    }
    if (isStaff) {
      query += ` and patient_infos.active_flag =1 and map_staff_hospitals.staff_id=:staffID and map_staff_hospitals.active_flag = 1`;
    }
    query += ` and ( patient_infos.mother_name LIKE(:searchText)
      or patient_basic_infos.baby_medical_record_number like(:searchText)
      or patient_basic_infos.baby_mother_medical_record_number LIKE (:searchText)
      or patient_infos.primary_contact_no LIKE (:searchText)
      or patient_infos.createdAt LIKE (:searchText)
      or patient_infos.active_flag LIKE (:searchText)
      or patient_infos.updatedAt LIKE (:searchText))`;
    query += ' order by patient_infos.createdAt desc LIMIT ' + req.params.end + ' OFFSET ' + start;
  }

  var result = await sequelize.query(query,
    {
      replacements: {
        hospital_id: hospital_id,
        hospital_branch_id: hospital_branch_id,
        searchText: searchText,
        staffID: staffId
      },
      type: sequelize.QueryTypes.SELECT
    }
  )

  // var finalResult = function (result) {
  //   return new Promise(function (resolve, reject) {
  //     result.forEach(async(data,index)=>{
  //       var babyAppear = await pReadingModels.baby_appear_model.findAll({
  //          where:{
  //            study_id:data.study_id
  //          },
  //          order:[
  //            ['createdAt', 'DESC']
  //           ],
  //           limit: 1
  //          })
  //           data.reading=babyAppear[0].reading
  //          })
  //       resolve(false);
  //   });
  // }

  if (result.length > 0) {

    result.forEach(async (data, index) => {

      if (data.updated_by != null) {

        let uResult = await sequelize.query(`SELECT * FROM m_users WHERE user_id =:user_id`,
          {
            replacements: {
              user_id: data.updated_by,
            }, type: sequelize.QueryTypes.SELECT
          }
        )
        if (uResult.length > 0) {
          if (uResult[0].user_type_id == 3) {

            let hbResult = await sequelize.query(`SELECT * FROM m_hospitals_branches WHERE user_id =:user_id`,
              {
                replacements: {
                  user_id: data.updated_by,
                }, type: sequelize.QueryTypes.SELECT
              }
            )
            if (hbResult.length > 0) {
              data.updated_by = hbResult[0].branch_name
            }

          } else if (uResult[0].user_type_id == 2) {

            // sequelize.query(`SELECT m_hospitals_branches.branch_name FROM m_hospitals JOIN m_hospitals_branches ON m_hospitals_branches.hospital_id = m_hospitals.hospital_id WHERE m_hospitals.user_id=:user_id AND  m_hospitals_branches.hospital_branch_id=:hospital_branch_id`,
            let hbResult = await sequelize.query(`SELECT hospital_name FROM m_hospitals where user_id = :user_id`,
              {
                replacements: {
                  user_id: data.updated_by,
                  hospital_branch_id: hospital_branch_id,
                }, type: sequelize.QueryTypes.SELECT
              }
            )
            if (hbResult.length > 0) {
              data.updated_by = hbResult[0].hospital_name
            }
          }
          else if (uResult[0].user_type_id == 4) {
            let sResult = await sequelize.query(`SELECT  CONCAT(m_staffs.first_name, ' ' ,m_staffs.last_name )  AS name  FROM m_staffs
      WHERE m_staffs.user_id =:user_id`,
              {
                replacements: {
                  user_id: data.updated_by,
                }, type: sequelize.QueryTypes.SELECT
              }
            )
            if (sResult.length > 0) {
              data.updated_by = sResult[0].name
            }
          }
        }
      }
    })
  }

  result.forEach(async (data, index) => {
    var babyAppear = await pReadingModels.baby_appear_model.findAll({
      where: {
        study_id: data.study_id
      },
      order: [
        ['createdAt', 'DESC']
      ],
      limit: 1
    })

    if (babyAppear.length > 0) {
      data.reading = babyAppear[0].reading
    } else {
      data.reading = null
    }
  })
  if (result.length > 0) {
    var sortedArray = result.sort(function (a, b) {
      return b.createdAt - a.createdAt
    });
    setTimeout(function () {
      res.json(responseHelper.success(constant.success, result))
    }, 300);
  }
}

exports.updateBabyMedicalRecord = (req, res, next) => {
  pReadingModels.basic_model.findOne({
    where: {
      id: req.params.studyId
    }
  })
    .then(result => {
      if (result != null) {
        result.hospital_id = req.params.hospitalId
        result.hospital_branch_id = req.params.hospitalBranchId
        result.hospital_name = req.body.hospital_name
        result.hospital_branch_name = req.body.hospital_branch_name
        result.baby_medical_record_number = req.body.bmrn
        result.baby_mother_medical_record_number = req.body.mmrn
        return result.save()
      }
    })
    .then(result => {
      if (result != null) {
        var patientResult = pReadingModels.patient_model.findOne({
          where: {
            patient_id: req.params.patientId
          }
        })
        return patientResult
      }
    })
    .then(patientResult => {
      patientResult.baby_name = req.body.babyName
      patientResult.mother_name = req.body.motherName
      patientResult.father_name = req.body.fatherName
      patientResult.state = req.body.state
      patientResult.address = req.body.address
      patientResult.city = req.body.city
      patientResult.nationality = req.body.nationality
      patientResult.email_id = req.body.email
      patientResult.primary_contact_no = req.body.contactNumberPrimary
      patientResult.secondary_contact_no = req.body.contactNumberSecondary
      patientResult.pincode = req.body.pincode
      patientResult.updated_by = req.params.userID
      patientResult.active_flag = req.body.status
      return patientResult.save()
    })
    .then(patientResult => {
      res.json(responseHelper.success(constant.success, patientResult))
    })
    .catch(err => {
      res.json(responseHelper.serveError(constant.error_msg, err))
    })
}


exports.babyMedicalRecordCount = async (req, res, next) => {
  let searchText = '%' + req.query.searchText + '%';
  var isStaff = eval(req.params.isStaff);
  var staffId = req.params.staffId;
  let query = null;
  if (req.query.searchText == "null") {
    // query=`SELECT
    //  patient_infos.baby_name as  count, count(*) as total
    //  FROM patient_infos 
    //  JOIN patient_basic_infos ON patient_basic_infos.id=patient_infos.study_id 
    //  JOIN m_hospitals_branches ON  m_hospitals_branches.hospital_branch_id=patient_basic_infos.hospital_branch_id 
    //  WHERE patient_basic_infos.hospital_id=:hospital_id AND patient_basic_infos.hospital_branch_id=:hospital_branch_id`
    //  if(isStaff){
    //   query += ` and patient_infos.active_flag =1`;
    //  }

    query = `SELECT
     patient_infos.baby_name as  count, count(*) as total
     FROM patient_infos 
     JOIN patient_basic_infos ON patient_basic_infos.id=patient_infos.study_id 
     JOIN m_hospitals_branches ON  m_hospitals_branches.hospital_branch_id=patient_basic_infos.hospital_branch_id`;
    if (isStaff) {
      query += ` JOIN map_staff_hospitals ON 
        patient_basic_infos.hospital_branch_id = map_staff_hospitals.hospital_branch_id`;
    }
    query += ` WHERE patient_basic_infos.hospital_id=:hospital_id`
    if (!isStaff) {
      query += ` and patient_basic_infos.hospital_branch_id=:hospital_branch_id`;
    }
    if (isStaff) {
      query += ` and patient_infos.active_flag =1 and map_staff_hospitals.staff_id=:staffID and map_staff_hospitals.active_flag = 1`;
    }
  }
  else {
    // query = `select patient_infos.baby_name as count, count(*) as total
    // FROM patient_infos join patient_basic_infos 
    //   on patient_basic_infos.id=patient_infos.study_id
    //   join m_hospitals_branches
    //   on m_hospitals_branches.hospital_branch_id=patient_basic_infos.hospital_branch_id
    //   and ( patient_infos.mother_name LIKE(:searchText)
    //   or patient_basic_infos.baby_medical_record_number like(:searchText)
    //   or patient_basic_infos.baby_mother_medical_record_number LIKE (:searchText)
    //   or patient_infos.primary_contact_no LIKE (:searchText)
    //   or patient_infos.createdAt LIKE (:searchText)
    //   or patient_infos.active_flag LIKE (:searchText)
    //   or patient_infos.updatedAt LIKE (:searchText))
    //   where patient_basic_infos.hospital_id=:hospital_id and 
    //   patient_basic_infos.hospital_branch_id=:hospital_branch_id`;
    // if (isStaff) {
    //   query += ` and patient_infos.active_flag =1`;
    // }


    query = `SELECT
      patient_infos.baby_name as  count, count(*) as total
      FROM patient_infos 
      JOIN patient_basic_infos ON patient_basic_infos.id=patient_infos.study_id 
      JOIN m_hospitals_branches ON  m_hospitals_branches.hospital_branch_id=patient_basic_infos.hospital_branch_id`;
    if (isStaff) {
      query += ` JOIN map_staff_hospitals ON 
         patient_basic_infos.hospital_branch_id = map_staff_hospitals.hospital_branch_id`;
    }
    query += ` WHERE patient_basic_infos.hospital_id=:hospital_id`
    if (!isStaff) {
      query += ` and patient_basic_infos.hospital_branch_id=:hospital_branch_id`;
    }
    if (isStaff) {
      query += ` and patient_infos.active_flag =1 and map_staff_hospitals.staff_id=:staffID and map_staff_hospitals.active_flag = 1`;
    }

    query += ` and ( patient_infos.mother_name LIKE(:searchText)
      or patient_basic_infos.baby_medical_record_number like(:searchText)
      or patient_basic_infos.baby_mother_medical_record_number LIKE (:searchText)
      or patient_infos.primary_contact_no LIKE (:searchText)
      or patient_infos.createdAt LIKE (:searchText)
      or patient_infos.active_flag LIKE (:searchText)
      or patient_infos.updatedAt LIKE (:searchText))`;
  }
  var result = await sequelize.query(query,
    {
      replacements: {
        hospital_id: req.params.hospitalId,
        hospital_branch_id: req.params.hospitalBranchId,
        searchText: searchText,
        staffID: staffId
      }, type: sequelize.QueryTypes.SELECT
    }
  )

  var data = result[0]['total'];
  res.json(responseHelper.success(constant.success, { medical_record_count: data }))

  //pReadingModels.basic_model

  // .findAndCountAll({
  //   where: {
  //     hospital_id: req .params.hospitalId,
  //     hospital_branch_id: req.params.hospitalBranchId,
  //     deleted_flag: 0
  //   }
  // })
  //.then(result => {
  //  res.json(responseHelper.success(constant.success, { medical_record_count: result.count }))

  // .catch(err => {
  //   res.json(responseHelper.serveError(constant.error_msg, err))
  // })
}
exports.scoreGeneratedReport = (req, res, next) => {

  var query = `SELECT * FROM vw_get_all_data WHERE study_id =` + req.params.studyId;

  sequelize.query(query,
    {
      type: sequelize.QueryTypes.SELECT
    }
  ).then(result => {
    var mQuery = `SELECT * FROM sepsis_score_metrics`;
    sequelize.query(mQuery,
      {
        type: sequelize.QueryTypes.SELECT
      }
    ).then(mResult => {
      var tWidth = constData.svgWidth;
      var score = 30; //hard coded
      var circCol = utils.colRanger(score);
      var fontSize = constData.svgFontSize;
      var colShift = constData.colShift;
      var rowShift = constData.rowShift;
      var filename = 'Score Generated Report.xlsx'
      var svgStr = utils.getSvg(circCol, tWidth, score, fontSize);
      var buffer = new Buffer.from(svgStr)
      sharp(buffer).png().toBuffer().then((buffer) => {
        var wb = utils.getExcel(colShift, rowShift, buffer, score, result, mResult)
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader("Content-Disposition", "attachment; filename=" + filename)
        wb.write(filename, res);
      });
    })
  }).catch(err => {
    res.json(responseHelper.serveError(constant.error_msg, err))
  })
}

exports.createPatient = (req, res, next) => {

  var baby = {
    "hospital_type_id": req.body.hospital_type_id,
    "baby_medical_record_number": req.body.baby_medical_record_number,
    "baby_mother_medical_record_number": req.body.baby_mother_medical_record_number,
    "hospital_id": req.body.hospital_id,
    "hospital_type": req.body.hospitalType
  }

  var baby_info = {
    "baby_name": req.body.baby_name,
    "mother_name": req.body.baby_mother_name,
    "study_id": "",
    "active_flag": 1,
    "deleted_flag": 0
  }
  pReadingModels.basic_model.findAll({
    where: {
      baby_medical_record_number: req.body.baby_medical_record_number,
      hospital_id: req.body.hospital_id
    }
  }).then(result => {
    if (result.length > 0) {
      res.json(responseHelper.alreadyExist('Medical record already exists', result));
    } else {
      pReadingModels.basic_model.create(baby)
        .then(result => {
          if (result != null) {
            baby_info.study_id = result.id
            pReadingModels.patient_model.create(baby_info)
              .then(bInfo => {
                res.json(responseHelper.success(constant.success, result))
              })
          }
        })
        .catch(err => {
          res.json(responseHelper.serveError(constant.error_msg, err))
        })
    }
  })
}

exports.getGeneratedScrore = (req, res, next) => {

  var score = {
    "prediction_score": "",
    "positive_sepsis": null,
    "negative-sepsis": null,
    "meningtis": null,
    "sensitivity": " ",
    "specificity": " ",
    "accuracy": " "
  }
  //TRUNCATE(sepsis_score*100,2)
  var query = `SELECT 
                  sepsis_score as sepsis_score 
              FROM 
                  vw_get_generated_score 
              WHERE 
                   study_id = ` + `'` + req.params.bmrn + `'` +
    `AND reading =` + `'` + req.params.reading + `'`

  //console.log(query);

  if (req.query.hospitalType == 7) {
    query = query + ' AND record_flag = 2'
  } else {
    query = query + ' AND record_flag = 1'
  }

  var squery = `SELECT * FROM  sepsis_score_metrics `

  // res.json({
  //   query:query
  // })

  sequelize.query(query,
    {
      type: sequelize.QueryTypes.SELECT
    }
  ).then(result => {

    if (result.length == 0) {
      res.json(responseHelper.notFound(constant.score_message))
    } else {
      score.prediction_score = result[0].sepsis_score

      sequelize.query(squery,
        {
          type: sequelize.QueryTypes.SELECT
        }
      ).then(sResult => {

        sResult.forEach((data, index) => {
          if (data.Metrics === "Accuracy") {
            //  score.accuracy= data.Score *100
            score.accuracy = data.Score
          } else if (data.Metrics === "Specificity") {
            // score.specificity= data.Score*100
            score.specificity = data.Score
          } else if (data.Metrics === "Sensitivity") {
            // score.sensitivity= data.Score*100
            score.sensitivity = data.Score
          }
        })
        res.json(responseHelper.success(constant.success, score))
      })
    }
  }).catch(err => {
    res.json(responseHelper.serveError(constant.error_msg, err))
  })
}

exports.getAashaBaby = (req, res, next) => {

  var start = (req.params.start - 1) * req.params.end;

  var query = ` 
    SELECT
      patient_infos.baby_name,
      patient_infos.mother_name,
      patient_infos.father_name,
      patient_infos.primary_contact_no,
      patient_infos.secondary_contact_no,
      patient_infos.createdAt,
      patient_infos.updated_by,
      patient_infos.address,
      patient_infos.city,
      patient_infos.state,
      patient_infos.pincode,
      patient_infos.nationality,
      patient_infos.email_id,
      patient_infos.study_id,
      patient_infos.active_flag AS STATUS,
      patient_infos.patient_id,
      patient_infos.created_by,
      patient_basic_infos.hospital_id,
      m_hospitals.hospital_name,
      m_hospitals.user_id,
      patient_basic_infos.baby_medical_record_number,
      patient_basic_infos.baby_mother_medical_record_number,
      patient_basic_infos.hospital_type,
      patient_basic_infos.id AS patient_basic_infos_id,
      sepsis_score_asha.sepsis_score * 10 as sepsis_score
    FROM
      patient_infos
      JOIN patient_basic_infos ON patient_basic_infos.id = patient_infos.study_id
      JOIN m_hospitals ON m_hospitals.hospital_id = patient_basic_infos.hospital_id
      left JOIN sepsis_score_asha on patient_infos.study_id = sepsis_score_asha.id
    WHERE patient_basic_infos.hospital_type = `+ req.query.hospitalType +
      ` AND m_hospitals.hospital_id = ` + req.params.hospitalId +
      ` AND patient_infos.active_flag = 1  `

  if (req.query.searchText != "null") {
    query = query + `AND (patient_basic_infos.baby_medical_record_number LIKE('%` + req.query.searchText + `%')` +
      ` OR (patient_infos.study_id LIKE ('%` + req.query.searchText + `%')) )`
  }

  if (req.query.scoreSort != undefined) {
    query = query + ` ORDER BY vw_get_generated_score.sepsis_score ` + req.query.scoreSort + `
    LIMIT `+ req.params.end + ` OFFSET ` + start 
  }
  
  if (req.query.dateSort != undefined) {
  query = query + ` ORDER BY patient_infos.createdAt ` + req.query.dateSort + `
  LIMIT `+ req.params.end + ` OFFSET ` + start
  }

  sequelize.query(query,
    {
      type: sequelize.QueryTypes.SELECT
    }
  ).then(result => {

    if (result.length > 0) {

      result.forEach((data, index) => {

        var rQuery = `SELECT reading FROM patient_baby_appears_infos WHERE study_id= ` + data.study_id
        sequelize.query(rQuery,
          {
            type: sequelize.QueryTypes.SELECT
          })
          .then(result => {
            if (result.length > 0) {
              data.reading = result[0].reading
            } else {
              data.reading = null
            }
          })
      })
    }

    setTimeout(function () {
      res.json(responseHelper.success(constant.success, result))
    }, 400)

  }).catch(err => {
    res.json(responseHelper.serveError(constant.error_msg, err))
  })
}

exports.getAashaBabyCount = (req, res, next) => {

  var query = `SELECT COUNT(*) as aasha_medical_count FROM
patient_infos
JOIN patient_basic_infos ON patient_basic_infos.id = patient_infos.study_id
JOIN m_hospitals ON m_hospitals.hospital_id = patient_basic_infos.hospital_id
WHERE patient_basic_infos.hospital_type = `+ req.query.hospitalType +
    ` AND patient_infos.active_flag = 1
AND patient_basic_infos.hospital_id = `+ req.params.hospitalId

  if (req.query.searchText != "null") {
    query = query + ` AND (patient_basic_infos.baby_medical_record_number LIKE('%` + req.query.searchText + `%')` +
      ` OR (patient_infos.study_id LIKE ('%` + req.query.searchText + `%')) )`
  }

  sequelize.query(query,
    {
      type: sequelize.QueryTypes.SELECT
    }
  ).then(result => {
    res.json(responseHelper.success(constant.success, result))
  }).catch(err => {
    res.json(responseHelper.serveError(constant.error_msg, err))
  })

}

exports.addReport = (req, res, next) => {

  // console.log(req.params.study_id,"study_id");
  sequelize.query(`
    INSERT INTO reports (study_id,report_type,report_name)
    values (${req.params.study_id},${req.body.report_type},'${req.body.report_name}');	
  `, {

  }).then(result => {

    res.json(responseHelper.success(constant.data_created_successfully, req.body))
  }).catch(err => {
    res.json(responseHelper.serveError(constant.error_msg, err))
  })

}

exports.getReports = (req, res, next) => {

  sequelize.query(`
    SELECT report_type,report_name FROM reports
    WHERE study_id = ${req.params.study_id} 
    ORDER BY report_type 
  `, {

  }).then(result => {
    res.json(responseHelper.success(constant.success, result[0]))
  }).catch(err => {
    res.json(responseHelper.serveError(constant.error_msg, err))
  })
}

exports.deleteReport = (req, res, next) => {

  sequelize.query(`
    DELETE FROM reports WHERE report_name = '${req.params.report_name}';	
  `, {

  }).then(result => {

    res.json(responseHelper.success(constant.success, "deleted succesfully"))
  }).catch(err => {
    res.json(responseHelper.serveError(constant.error_msg, err))
  })

}

exports.referralDoctorsList = (req, res, next) => {

 var state = req.query.state;
 var speciality = req.query.speciality;

  if (req.query.state != undefined && req.query.speciality != undefined) {
  
    var completequery = 'where mu.state = ' +  `'${state}'` + ' and ms.speciality = ' + ` '${speciality}' and mrd.active_flag =1 and mu.user_type_id = 5`;
  } else {

    if (req.query.state != undefined) {
     
      var completequery = 'where mu.state = ' + `'${req.query.state}' and mrd.active_flag =1 and mu.user_type_id = 5` ;

    } else if (req.query.speciality != undefined) {
      
      var completequery = 'where ms.speciality = ' + `'${req.query.speciality}' and mrd.active_flag =1 and mu.user_type_id = 5` ;
    } else {
      
      var completequery = 'where mrd.active_flag =1 and mu.user_type_id = 5';
    }
  }

  sequelize.query(`
 select mu.user_id,mu.user_name,mu.user_type_id,mu.state,mu.pincode,ms.speciality ,
 mrd.first_name,mrd.last_name,mu.email_address,
 mu.active_flag ,mrd.active_flag 
 from m_users mu right join
 m_referral_doctors mrd on mu.user_id =mrd.user_id 
 left join m_specialities ms on ms.speciality_id =mrd.hospital_branch_speciality_id 
 ${completequery}
  	
 `, {

  }).then(result => {

    res.json(responseHelper.success(constant.success, result[0]))
  }).catch(err => {
    res.json(responseHelper.serveError(constant.error_msg, err))
  })

}
