import {
  sequelize,
  patient_model,
  patient_level_model,
  basic_model,
  general_model,
  maternal_model,
  baby_appear_model,
  baby_resp_model,
  baby_cv_model,
  baby_cns_model,
  baby_git_model,
  baby_final_model,
  baby_antibiotic_model,
  baby_investigation_model
} from '../sequelize';
import bcrypt from 'bcrypt';
import jwtSecret from '../config/jwtConfig';
import jwt from 'jsonwebtoken';
import res_help from '../helper/res';
import constant from '../helper/constant';
let Validator = require('validatorjs');
const BCRYPT_SALT_ROUNDS = constant.bcrypt_solt_text;
module.exports = app => {


  /**
   * @method :- signup
   * @requires : - for the used the default Docter signup
   * @return :-  User Response Send
   */
  app.post('/patient/signup', (req, res) => {
    const reqData = {
      patient_first_name: req.body.patient_first_name,
      patient_last_name: req.body.patient_last_name,
      phone: req.body.phone,
      city: req.body.city,
      state: req.body.state,
      country: req.body.country
    };

    let rules = {
      patient_first_name: 'required',
      patient_last_name: 'required',
      phone: 'required',
      city: 'required',
      state: 'required',
      country: 'required'
    };
    let validation = new Validator(reqData, rules);
    if (validation.fails()) {
      res.status(200).json(res_help.notFound(constant.common_required));
    }
    isExists(patient_model, 'phone', reqData.phone, (res_status, response) => {
      if (res_status) {
        res.json(res_help.success(constant.patient_alreay_taken_msg, [], constant.username_alreay_taken_status));
      } else {
        patient_model.create(reqData).then((response) => {
          res.json(res_help.success(constant.patient_success, response));
        });
      }
    });
  });
  /**
  * @method :- baby_cv add
  * @requires : - for the used the default Docter signup
  * @return :-  User Response Send
  */
 app.post('/patient/baby_cv/add', (req, res) => {
  const reqData = {
    urine_output: req.body.urine_output,
    baby_blood_pressure_mean_arterial_bp: req.body.baby_blood_pressure_mean_arterial_bp,
    baby_blood_pressure_upper_limb: req.body.baby_blood_pressure_upper_limb,
    baby_blood_pressure_lower_limb: req.body.baby_blood_pressure_lower_limb,
    capillary_refill: req.body.capillary_refill,
    capillary_refill_unit: req.body.capillary_refill_unit,
    low_peripheral_pulse_volume: req.body.low_peripheral_pulse_volume,
    cool_peripheries: req.body.cool_peripheries,
    two_d_echo_done: req.body.two_d_echo_done,
    two_d_echo_done_if_yes: req.body.two_d_echo_done_if_yes,
    baby_on_ionotropes: req.body.baby_on_ionotropes,
    heart_rate: req.body.heart_rate,
    central_line: req.body.central_line,
    skin_pustules: req.body.skin_pustules,
    infusion_of_blood_products: req.body.infusion_of_blood_products,
    study_id: req.body.study_id
  };

  let rules = {
    study_id: 'required'
  };
  let validation = new Validator(reqData, rules);
  if (validation.fails()) {
    return res.status(200).json(res_help.notFound(constant.common_required));
  }
  baby_cv_model.create(reqData).then((response) => {
    // level_update(req, req.body.patient_id);
    return res.json(res_help.success(constant.success, response));
  }).catch((error) => {
    return res.json(res_help.serveError("Internal  server error.", []));
  })
});

  /**
   * @method :- patient basic add
   * @requires : - for the used the default Docter signup
   * @return :-  User Response Send
   */
  app.post('/patient/basic/add', (req, res) => {
    const reqData = {
      hospital_id: req.body.id,
      hospital_name: req.body.hospital_name,
      hospital_branch_name: req.body.hospital_branch_name,

      baby_mother_medical_record_number: req.body.baby_mother_medical_record_number,
      baby_medical_record_number: req.body.baby_medical_record_number,

      is_update: false
    };

    let rules = {
      baby_medical_record_number: 'required',
      baby_mother_medical_record_number: 'required'
    };


    let validation = new Validator(reqData, rules);
    if (validation.fails()) {
      return res.status(200).json(res_help.notFound(constant.common_required));
    }
    let whereObj = {
      hospital_id: req.body.id,
      'baby_medical_record_number': req.body.baby_medical_record_number
    };
    isExistsWhere(basic_model, whereObj, (status, response) => {
      if (status) {
        return res.json(res_help.alreadyExist('This record number already exist.', response, 422));
      } else {
        basic_model.create(reqData).then((response) => {
          // level_update(req, req.body.study_id);
          return res.json(res_help.success(constant.patient_basic_success, response));
        });
      }
    });
  });

  app.post('/patient/basic/add_dup/:hospital_id', (req, res) => {
    const reqData = {
      hospital_name: req.body.hospital_name,
      hospital_branch_name: req.body.hospital_branch_name,
      hospital_id : req.params.hospital_id,
      baby_mother_medical_record_number: req.body.baby_mother_medical_record_number,
      baby_medical_record_number: req.body.baby_medical_record_number,
      
      is_update: false
    };
    
    let rules = {
      baby_medical_record_number: 'required',
      baby_mother_medical_record_number: 'required'
    };
    
    
    let validation = new Validator(reqData, rules);
      if (validation.fails()) {
        return res.status(200).json(res_help.notFound(constant.common_required));
      }
    let whereObj = {
      hospital_name: req.body.hospital_name,
        'baby_medical_record_number': req.body.baby_medical_record_number
      };
    //isExistsWhere(basic_model, whereObj, (status) => {
    /*if (status) {
    return res.json(res_help.alreadyExist('This record number already exist.'));
    } else {*/
    basic_model.create(reqData).then((response) => {
      // level_update(req, req.body.study_id);
        return res.json(res_help.success(constant.patient_basic_success, response));
      });
    });


  app.post('/patient/general/add/:uStaffId', (req, res) => {
      const reqData = req.body;
      
      reqData.active_flag = 1
      general_model.findAll({
        where:{
          study_id:req.body.study_id
        }
      }).then(result => {
        // if(result.length > 0){
        //   res.json(res_help.resourceAlreadyExist(constant.record_already_exist, result));
        // }else{
          
          general_model.create(reqData).then((response) => {

            patient_model.findOne({
              where:{
                study_id:req.body.study_id
              }
            }).then(pResult=>{
              pResult.updated_by=req.params.uStaffId
              pResult.save()
            })
            res.json(res_help.success(constant.patient_basic_success, response));

          }).catch((error) => {
            res.json(res_help.serveError("Internal  server error.", []));
          })
      //  }
      })
  });

  /**
   * @method :- patient maternal add
   * @requires : - for the used the default Docter signup
   * @return :-  User Response Send
   */
  app.post('/patient/maternal/add/:uStaffId', (req, res) => {
    const reqData = req.body;

    let rules = {
      study_id: 'required'
    };
    let validation = new Validator(reqData, rules);
    if (validation.fails()) {
      return res.status(200).json(res_help.notFound(constant.common_required));
    }
    maternal_model.create(reqData).then((response) => {
      // level_update(req, req.body.study_id);
      patient_model.findOne({
        where:{
          study_id:req.body.study_id
        }
      }).then(pResult=>{
        pResult.updated_by=req.params.uStaffId
        pResult.save()
      })
      return res.json(res_help.success(constant.patient_basic_success, response));
    }).catch((error) => {
      return res.json(res_help.serveError("Internal  server error.", []));
    })
  });


  /**
    * @method :- patient maternal add
    * @requires : - for the used the default Docter signup
    * @return :-  User Response Send
    */
  app.post('/patient/baby_appears/add', (req, res) => {

    const reqData = req.body;

    let rules = {
      study_id: 'required'
    };
    let validation = new Validator(reqData, rules);
    if (validation.fails()) {
      return res.status(200).json(res_help.notFound(constant.common_required));
    }
    baby_appear_model.create(reqData).then((response) => {
      //level_update(req, req.body.patient_id);
      return res.json(res_help.success(constant.success, response));
    }).catch((error) => {
      return res.json(res_help.serveError("Internal  server error.", []));
    })
  });

  /**
  * @method :- patient maternal add
  * @requires : - for the used the default Docter signup
  * @return :-  User Response Send
  */
  app.post('/patient/baby_resp/add', (req, res) => {
    const reqData = {
      groaning: req.body.groaning,
      grunting: req.body.grunting,
      stridor: req.body.stridor,
      retraction: req.body.retraction,
      fast_breathing: req.body.fast_breathing,
      oxygen_saturation: req.body.oxygen_saturation,
      breathing_rate: req.body.breathing_rate,
      baby_chest_indrawing: req.body.baby_chest_indrawing,
      x_ray_status_done: req.body.x_ray_status_done,
      x_ray_result: req.body.x_ray_result,
      x_ray_status: req.body.x_ray_status,
      x_ray_diagnosis_any_other: req.body.x_ray_diagnosis_any_other,
      apnea_status: req.body.apnea_status,
      apnea_diagnosis: req.body.apnea_diagnosis,
      baby_respiratory_support: req.body.baby_respiratory_support,
      baby_respiratory_support_if_yes: req.body.baby_respiratory_support_if_yes,
      baby_respiratory_support_if_other: req.body.baby_respiratory_support_if_other,
      study_id: req.body.study_id
    };

    let rules = {
      study_id: 'required'
    };
    let validation = new Validator(reqData, rules);
    if (validation.fails()) {
      return res.status(200).json(res_help.notFound(constant.common_required));
    }
    baby_resp_model.create(reqData).then((response) => {
      //level_update(req, req.body.patient_id);
      return res.json(res_help.success(constant.success, response));
    }).catch((error) => {
      return res.json(res_help.serveError("Internal  server error.", []));
    })
  });


  /**
   * @method :- patient maternal add
   * @requires : - for the used the default Docter signup
   * @return :-  User Response Send
   */
  app.post('/patient/baby_cv/add', (req, res) => {
    const reqData = {
      urine_output: req.body.urine_output,
      baby_blood_pressure_mean_arterial_bp: req.body.baby_blood_pressure_mean_arterial_bp,
      baby_blood_pressure_upper_limb: req.body.baby_blood_pressure_upper_limb,
      baby_blood_pressure_lower_limb: req.body.baby_blood_pressure_lower_limb,
      capillary_refill: req.body.capillary_refill,
      capillary_refill_unit: req.body.capillary_refill_unit,
      low_peripheral_pulse_volume: req.body.low_peripheral_pulse_volume,
      cool_peripheries: req.body.cool_peripheries,
      two_d_echo_done: req.body.two_d_echo_done,
      two_d_echo_done_if_yes: req.body.two_d_echo_done_if_yes,
      baby_on_ionotropes: req.body.baby_on_ionotropes,
      heart_rate: req.body.heart_rate,
      study_id: req.body.study_id
    };
 
    let rules = {
      study_id: 'required'
    };
    let validation = new Validator(reqData, rules);
    if (validation.fails()) {
      return res.status(200).json(res_help.notFound(constant.common_required));
    }
    baby_cv_model.create(reqData).then((response) => {
      // level_update(req, req.body.patient_id);
      return res.json(res_help.success(constant.success, response));
    }).catch((error) => {
      return res.json(res_help.serveError("Internal  server error.", []));
    })
  });

  app.post('/patient/baby_cns/add', (req, res) => {
    const reqData = req.body;
    let rules = {
      study_id: 'required'
    };
    let validation = new Validator(reqData, rules);
    if (validation.fails()) {
      return res.status(200).json(res_help.notFound(constant.common_required));
    }
    baby_cns_model.create(reqData).then((response) => {
      //level_update(req, req.body.study_id);
      return res.json(res_help.success(constant.success, response));
    }).catch((error) => {
      return res.json(res_help.serveError("Internal  server error.", []));
    })
  });



  /**
    * @method :- baby git add
    * @requires : - for the used the default Docter signup
    * @return :-  User Response Send
    */

  app.post('/patient/baby_git/add', (req, res) => {
    const reqData = req.body;
    console.clear();
    console.error(reqData)
    let rules = {
      study_id: 'required'
    };
    let validation = new Validator(reqData, rules);
    if (validation.fails()) {
      return res.status(200).json(res_help.notFound(constant.common_required));
    }
    baby_git_model.create(reqData).then((response) => {
      //level_update(req, req.body.study_id);
      return res.json(res_help.success(constant.success, response));
    }).catch((error) => {
      return res.json(res_help.serveError("Internal  server error.", []));
    })
  });

   /**
   * @method :- baby investigation
   * @requires : - for the used the default Docter signup
   * @return :-  User Response Send
   */
  app.post('/patient/baby_investigation/add', (req, res) => {
    const reqData = req.body;

    let rules = {
      study_id: 'required'
    };
    let validation = new Validator(reqData, rules);
    if (validation.fails()) {
      return res.status(200).json(res_help.notFound(constant.common_required));
    }
    baby_investigation_model.create(reqData).then((response) => {
      //level_update(req, req.body.study_id);
      return res.json(res_help.success(constant.success, response));
    }).catch((error) => {
      return res.json(res_help.serveError("Internal  server error.", []));
    })
  });
/**
   * @method :- baby_antibiotic
   * @requires : - for the used the default Docter signup
   * @return :-  User Response Send
   */
  app.post('/patient/baby_antibiotic/add', (req, res) => {
    const reqData = req.body;
    console.clear();
    console.error(reqData)
    let rules = {
      study_id: 'required'
    };
    let validation = new Validator(reqData, rules);
    if (validation.fails()) {
      return res.status(200).json(res_help.notFound(constant.common_required));
    }
    baby_antibiotic_model.create(reqData).then((response) => {
      //level_update(req, req.body.study_id);
      return res.json(res_help.success(constant.success, response));
    }).catch((error) => {
      return res.json(res_help.serveError("Internal  server error.", []));
    })
  });
  /**
   * @method :- baby_final
   * @requires : - for the used the default Docter signup
   * @return :-  User Response Send
   */
  app.post('/patient/baby_final/add', (req, res) => {
    const reqData = req.body;
    console.clear();
    console.error(reqData)
    let rules = {
      study_id: 'required'
    };
    let validation = new Validator(reqData, rules);
    if (validation.fails()) {
      return res.status(200).json(res_help.notFound(constant.common_required));
    }
    baby_final_model.create(reqData).then((response) => {
      //level_update(req, req.body.study_id);
      return res.json(res_help.success(constant.success, response));
    }).catch((error) => {
      return res.json(res_help.serveError("Internal  server error.", []));
    })
  });

  /**
   * @method :- signup
   * @requires : - for the used the default Docter signup
   * @return :-  User Response Send
   */
  app.post('/patient/get_patients', (req, res) => {
    basic_model.findAll({
      where: {
        is_update: false,
        hospital_name: req.body.hospital_name
      }
    })
      .then(patients => {
        res.json(res_help.success(constant.get_patients_success, patients));
      })
      .catch(err => {
        res.status(500).json(err);
      });
  });


  /**
   * @method :- get_level
   * @requires : - for the used the default patient get_level
   * @return :-  User get_level Send
   */
  app.post('/patient/get_level/:id', (req, res) => {
    // level_update(req);
    patient_level_model.findOne({
      patient_id: req.params.id
    })
      .then(level => {
        res.json(res_help.success(constant.get_level, level));
      })
      .catch(err => {
        res.status(500).json(err);
      });
  });


  /**
   * @method :- get_pesient
   * @requires : - for the used the default patient get_pesient
   * @return :-  User get_pesient get the  info...
   */
  app.post('/patient/get_patient/:id', (req, res) => {
    basic_model.findAll({
      where: {
        patient_id: req.params.id,
        is_update: false
      }
    })
      .then(resp => {
        if (resp && resp.length > 0) {

          res.json(res_help.success(constant.success, resp));
        } else {
          res.json(res_help.notFound("record not found.", resp));
        }

      })
      .catch(err => {
        res.json(res_help.serveError())
      });
  });


  /**
   * @method :- get_pesient
   * @requires : - for the used the default patient get_pesient
   * @return :-  User get_pesient get the  info...
   */
  app.post('/patient/like', (req, res) => {
    // const queryStr = 'select * from patient_basic_infos where (baby_medical_record_number like "%' + req.body.like + '%"or baby_mother_medical_record_number like "%' + req.body.like + '%" or id like "%' + req.body.like + '%") and id ="' + req.body.hospital_id + '"';
    const queryStr = "SELECT * FROM patient_basic_infos WHERE (baby_medical_record_number = '"+req.body.like+"' OR id = '"+req.body.like+"' ) AND hospital_id ='"+req.body.hospital_id+"'";
    sequelize.query(queryStr, {
      type: sequelize.QueryTypes.SELECT
    }).then(resp => {
      if (resp && resp.length > 0) {
        res.json(res_help.success(constant.success, resp));
      } else {
        res.json(res_help.notFound("record not found.", resp));
      }
    });

  });


  /**
   * @method :- get_pesient
   * @requires : - for the used the default patient get_pesient
   * @return :-  User get_pesient get the  info...
   */
  app.post('/search_general', (req, res) => {
    // const queryStr = 'SELECT * FROM `patient_general_infos` WHERE (createdAt like "%' + req.body.date + '%") and  study_id = ' + req.body.study_id + ' ORDER by createdAt DESC';
    const queryStr = 'SELECT * FROM `patient_general_infos` WHERE DATE(createdAt )  ="' + req.body.date + '" AND  study_id = "' + req.body.study_id + '" ORDER BY createdAt DESC'
    sequelize.query(queryStr, {
      type: sequelize.QueryTypes.SELECT
    }).then(resp => {
      if (resp && resp.length > 0) {
        res.json(res_help.success(constant.success, resp));
      } else {
        res.json(res_help.notFound("record not found.", resp));
      }
    });

  });


  //SELECT * FROM `patient_general_infos` WHERE (createdAt like '2019-04-27%') and  study_id = 4 ORDER by createdAt


  /**
   * @method :- search_parent_hospital
   * @requires : - used to return parent hospitals for sign up
   * @return :-  parent hospital json with id and name
   */
  app.post('/search_parent_hospital', (req, res) => {
  
    const queryStr = "SELECT h_id,parent_hospital_name FROM parent_hospitals WHERE parent_hospital_name LIKE '%"+req.body.hospital_name+"%'";

    // console.error('-----parentquery------'+queryStr);
 
    sequelize.query(queryStr, {
      type: sequelize.QueryTypes.SELECT
    }).then(resp => {
      if (resp && resp.length > 0) {
        res.json(res_help.success(constant.success, resp));
      } else {
        res.json(res_help.notFound("record not found.", resp));
      }
    });

  });



};


/**
 * 
 * @param {*} schmea 
 * @param {*} col_name 
 * @param {*} col_value 
 * @param {*} cb 
 */

let isExists = (schmea, col_name_text, col_value, cb) => {
  const whereObj = {}
  whereObj[col_name_text] = col_value;
  schmea.findOne({
    where: whereObj,
  })
    .then(response => {
      if (response != null) {
        cb(true, response);
      } else {
        cb(false, []);
      }
    }).catch(err => {
      cb(false, [])
    });
}

let isExistsWhere = (schmea, where_obj, cb) => {
  const whereObj = {}
  // whereObj[col_name_text] = col_value;
  const queryStr = "SELECT * FROM patient_basic_infos WHERE hospital_id = '"+where_obj.hospital_id+"' AND baby_medical_record_number='"+where_obj.baby_medical_record_number+"' ORDER BY createdAt DESC LIMIT 1";
  sequelize.query(queryStr, {
  type: sequelize.QueryTypes.SELECT,
  raw: true
  }).then(response => {
  //console.log('----------MJMJMJMJM------'+JSON.stringify(response));
  // JSON.stringify(response[0])
  if (response.length > 0) {
  cb(true, response[0]);
  } else {
  cb(false, []);
  }
  }).catch(err => {
  cb(false, [])
  });
  }
/**
 * 
 * @param {*} patient_id 
 * @purpose :-  For the used as check the level and update also
 */
let level_update = (req, study_id) => {
  // parient_id = (req.params.id) ? (req.params.id) : (parient_id);
  const whereObj = {
    study_id: parient_id,
    tab_name: req.body.tab_name
  }
  patient_level_model.findAll({
    where: whereObj
  })
    .then(response => {
      if (response != null && response.length > 0) {
        patient_level_model.update({
          is_last: true
        }, {
            where: whereObj
          })
          .then(function (result) {
            let reqData = {
              study_id: study_id,
              patient_level: Number(response.length) + 1,
              tab_name: req.body.tab_name,
              is_last: false
            }
            console.error(reqData, 'reqData');
            patient_level_model.create(reqData).then((response) => {
              return true;
            });
          }).catch(function (err) {

          });
      } else {
        let reqData = {
          patient_id: parient_id,
          patient_level: 1,
          tab_name: req.body.tab_name,
          is_last: false
        }
        console.error(reqData, 'reqData');
        patient_level_model.create(reqData).then((response) => {
          return true;
        });
      }
    }).catch(err => {
      console.error(err)
      return false;
    });
}


