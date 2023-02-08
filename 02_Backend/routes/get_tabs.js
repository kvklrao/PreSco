import {
  baby_appear_model,
  general_model,
  maternal_model,
  baby_cns_model,
  sequelize,
  baby_git_model,
  baby_resp_model,
  baby_final_model,
  baby_cv_model,
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
   * @method :- get_general
   * @requires : - for the used the default Docter get_general
   * @return :-  User Response Send
   */
  app.post('/patient/get_general/:id/:hospital_id/:page_no', (req, res) => {
    //res.json({'ppp':})
    // const whereObj = {
    //   study_id: req.params.id
    // };
    // console.log(req.params.id)
    
    var record_no = req.params.page_no;
    record_no = record_no - 1;
    var queryStr = "SELECT *,patient_infos.baby_name, patient_infos.mother_name FROM patient_basic_infos JOIN patient_general_infos ON patient_basic_infos.id = patient_general_infos.study_id JOIN patient_infos ON patient_infos.study_id = patient_basic_infos.id WHERE (patient_basic_infos.baby_medical_record_number='"+req.params.id+"' OR patient_general_infos.study_id='"+req.params.id+"') AND  `patient_basic_infos`.`hospital_id`='"+req.params.hospital_id+"'  ORDER BY patient_general_infos.createdAt DESC LIMIT "+record_no+", 5;";
    
    console.clear();
    console.error(queryStr)
    sequelize.query(queryStr, {
      type: sequelize.QueryTypes.SELECT
    })

   /* general_model.findAll({
        where: whereObj,
        order: [
          ['id', 'DESC']

        ]
      }, )*/
      .then(resp => {
        result(res, resp);
      })
      .catch(err => {
        res.status(500).json(err);
      });
  });

 /**
   * @method :- get_final
   * @requires : - for the used the default Docter get_final
   * @return :-  User Response Send
   */
  app.post('/patient/get_final/:id/:hospital_id/:page_no', (req, res) => {
    // const whereObj = {
    //   study_id: req.params.id
    // };

    // baby_final_model.findAll({
    //     where: whereObj,
    //     order: [
    //       ['id', 'DESC']

    //     ]
    //   }, )

    // var record_no = req.params.page_no;
    // record_no = record_no - 1;
    var queryStr = "SELECT * FROM patient_basic_infos JOIN patient_baby_finals ON patient_basic_infos.id = patient_baby_finals.study_id WHERE (patient_basic_infos.baby_medical_record_number='"+req.params.id+"' OR patient_baby_finals.study_id='"+req.params.id+"') AND  `patient_basic_infos`.`hospital_id`='"+req.params.hospital_id+"'  ORDER BY patient_baby_finals.createdAt DESC LIMIT 1;";

    console.clear();
    console.error(queryStr)
    sequelize.query(queryStr, {
      type: sequelize.QueryTypes.SELECT
    })

      .then(resp => {
        result(res, resp);
      })
      .catch(err => {
        res.status(500).json(err);
      });
  });

 /**
   * @method :- baby_antibiotic
   * @requires : - for the used the default Docter get_general
   * @return :-  User Response Send
   */
  app.post('/patient/get_antibiotic/:id/:hospital_id/:page_no', (req, res) => {
    // const whereObj = {
    //   study_id: req.params.id
    // };

    // baby_antibiotic_model.findAll({
    //     where: whereObj,
    //     order: [
    //       ['id', 'DESC']

    //     ]
    //   }, )
    // var record_no = req.params.page_no;
    // record_no = record_no - 1;
    var queryStr = "SELECT * FROM patient_basic_infos JOIN patient_baby_antibiotics ON patient_basic_infos.id = patient_baby_antibiotics.study_id WHERE (patient_basic_infos.baby_medical_record_number='"+req.params.id+"' OR patient_baby_antibiotics.study_id='"+req.params.id+"') AND  `patient_basic_infos`.`hospital_id`='"+req.params.hospital_id+"'  ORDER BY patient_baby_antibiotics.createdAt DESC LIMIT 1;";

    console.clear();
    console.error(queryStr)
    sequelize.query(queryStr, {
      type: sequelize.QueryTypes.SELECT
    })
      .then(resp => {
        result(res, resp);
      })
      .catch(err => {
        res.status(500).json(err);
      });
  });

 /**
   * @method :- get_investigation
   * @requires : - for the used the default Docter get_general
   * @return :-  User Response Send
   */
  app.post('/patient/get_investigation/:id/:hospital_id/:page_no', (req, res) => {
    // const whereObj = {
    //   study_id: req.params.id
    // };

    // baby_investigation_model.findAll({
    //     where: whereObj,
    //     order: [
    //       ['id', 'DESC']

    //     ]
    //   }, )

    // var record_no = req.params.page_no;
    // record_no = record_no - 1;
    var queryStr = "SELECT * FROM patient_basic_infos JOIN patient_baby_investigations ON patient_basic_infos.id = patient_baby_investigations.study_id WHERE (patient_basic_infos.baby_medical_record_number='"+req.params.id+"' OR patient_baby_investigations.study_id='"+req.params.id+"') AND  `patient_basic_infos`.`hospital_id`='"+req.params.hospital_id+"'  ORDER BY patient_baby_investigations.createdAt DESC LIMIT 1;";

    console.clear();
    console.error(queryStr)
    sequelize.query(queryStr, {
      type: sequelize.QueryTypes.SELECT
    })
    
      .then(resp => {
        result(res, resp);
      })
      .catch(err => {
        res.status(500).json(err);
      });
  });
 /**
   * @method :- get_cv
   * @requires : - for the used the default Docter get_general
   * @return :-  User Response Send
   */
  app.post('/patient/get_cv/:id/:hospital_id/:page_no', (req, res) => {
    // const whereObj = {
    //   study_id: req.params.id
    // };

    // baby_cv_model.findAll({
    //     where: whereObj,
    //     order: [
    //       ['id', 'DESC']

    //     ]
    //   }, )
    // var record_no = req.params.page_no;
    // record_no = record_no - 1;
    var queryStrMJ = "SELECT * FROM patient_basic_infos JOIN patient_baby_cv_infos ON patient_basic_infos.id = patient_baby_cv_infos.study_id WHERE (patient_basic_infos.baby_medical_record_number='"+req.params.id+"' OR patient_baby_cv_infos.study_id='"+req.params.id+"') AND  `patient_basic_infos`.`hospital_id`='"+req.params.hospital_id+"'  ORDER BY patient_baby_cv_infos.createdAt DESC LIMIT 1;";
    // patient_basic_infos.createdAt DESC 
      console.clear();
      console.error(queryStrMJ)
      sequelize.query(queryStrMJ, {
        type: sequelize.QueryTypes.SELECT
      })
      .then(resp1 => {
        result(res, resp1);
      })
      .catch(err => {
        res.status(500).json(err);
      });
  });

  /**
   * @method :- get_maternal
   * @requires : - for the used the default get_maternal get_general
   * @return :-  User Response Send
   */
  app.post('/patient/get_maternal/:id/:hospital_id/:page_no', (req, res) => {
    // const whereObj = {
    //   study_id: req.params.id
    // };

    // maternal_model.findAll({
    //     where: whereObj,
    //     order: [
    //       ['id', 'DESC']
    //     ]
    //   }, )
    var record_no = req.params.page_no;
    record_no = record_no - 1;
    var queryStr = "SELECT * FROM patient_basic_infos JOIN patient_maternal_infos ON patient_basic_infos.id = patient_maternal_infos.study_id WHERE (patient_basic_infos.baby_medical_record_number='"+req.params.id+"' OR patient_maternal_infos.study_id='"+req.params.id+"') AND  `patient_basic_infos`.`hospital_id`='"+req.params.hospital_id+"'  ORDER BY patient_maternal_infos.createdAt DESC LIMIT "+record_no+", 5;";

      console.clear();
      console.error(queryStr)
      sequelize.query(queryStr, {
        type: sequelize.QueryTypes.SELECT
      })
      .then(resp => {
        result(res, resp);
      })
      .catch(err => {
        res.status(500).json(err);
      });
  });

  /**
   * @method :- get_baby_git
   * @requires : - for the used the default get_maternal get_general
   * @return :-  User Response Send
   */
  app.post('/patient/get_baby_git/:id/:hospital_id/:page_no', (req, res) => {
    // const whereObj = {
    //   study_id: req.params.id
    // };

    // baby_git_model.findAll({
    //     where: whereObj,
    //     order: [
    //       ['id', 'DESC']
    //     ]
    //   }, )

    // var record_no = req.params.page_no;
    // record_no = record_no - 1;
    var queryStr = "SELECT * FROM patient_basic_infos JOIN patient_baby_git_infos ON patient_basic_infos.id = patient_baby_git_infos.study_id WHERE (patient_basic_infos.baby_medical_record_number='"+req.params.id+"' OR patient_baby_git_infos.study_id='"+req.params.id+"') AND  `patient_basic_infos`.`hospital_id`='"+req.params.hospital_id+"'  ORDER BY patient_baby_git_infos.createdAt DESC LIMIT 1;";
    console.clear();
    console.error(queryStr)
    sequelize.query(queryStr, {
      type: sequelize.QueryTypes.SELECT
    })

      .then(resp => {
        result(res, resp);
      })
      .catch(err => {
        res.status(500).json(err);
      });
  });

  /**
   * @method :- get_baby_cns
   * @requires : - for the used the default get_maternal get_general
   * @return :-  User Response Send
   */
  app.post('/patient/get_baby_cns/:id/:hospital_id/:page_no', (req, res) => {
    // const whereObj = {
    //   study_id: req.params.id
    // };

    // baby_cns_model.findAll({
    //     where: whereObj,
    //     order: [
    //       ['id', 'DESC']
    //     ]
    //   }, )

    // var record_no = req.params.page_no;
    // record_no = record_no - 1;
    var queryStr = "SELECT * FROM patient_basic_infos JOIN patient_baby_cns_infos ON patient_basic_infos.id = patient_baby_cns_infos.study_id WHERE (patient_basic_infos.baby_medical_record_number='"+req.params.id+"' OR patient_baby_cns_infos.study_id='"+req.params.id+"') AND  `patient_basic_infos`.`hospital_id`='"+req.params.hospital_id+"'  ORDER BY patient_baby_cns_infos.createdAt DESC LIMIT 1;";

    console.clear();
    console.error(queryStr)
    sequelize.query(queryStr, {
      type: sequelize.QueryTypes.SELECT
    })
      .then(resp => {
        result(res, resp);
      })
      .catch(err => {
        res.status(500).json(err);
      });
  });

   /**
  * @method :- get_maternal
  * @requires : - for the used the default get_maternal get_general
  * @return :-  User Response Send
  */
 app.post('/patient/get_baby_resp/:id/:hospital_id/:page_no', (req, res) => {
  // const whereObj = {
  //   study_id: req.params.id
  // };

  // baby_resp_model.findAll({
  //     where: whereObj,
  //     order: [
  //       ['id', 'DESC']
  //     ]
  //   }, )

  // var record_no = req.params.page_no;
  //   record_no = record_no - 1;
    var queryStr = "SELECT * FROM patient_basic_infos JOIN patient_baby_resp_infos ON patient_basic_infos.id = patient_baby_resp_infos.study_id WHERE (patient_basic_infos.baby_medical_record_number='"+req.params.id+"' OR patient_baby_resp_infos.study_id='"+req.params.id+"') AND  `patient_basic_infos`.`hospital_id`='"+req.params.hospital_id+"'  ORDER BY patient_baby_resp_infos.createdAt DESC LIMIT 1;";

  console.clear();
  console.error(queryStr)
  sequelize.query(queryStr, {
    type: sequelize.QueryTypes.SELECT
  })
    .then(resp => {
      result(res, resp);
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

 /**
  * @method :- get_baby_appears
  * @requires : - for the used the default get_maternal get_general
  * @return :-  User Response Send
  */
 app.post('/patient/get_baby_appears/:id/:hospital_id/:page_no', (req, res) => {
  // const whereObj = {
  //   study_id: req.params.id
  // };

  // baby_appear_model.findAll({
  //     where: whereObj,
  //     order: [
  //       ['id', 'DESC']
  //     ]
  //   }, )

  // var record_no = req.params.page_no;
  //   record_no = record_no - 1;
    var queryStr = "SELECT * FROM patient_basic_infos JOIN patient_baby_appears_infos ON patient_basic_infos.id = patient_baby_appears_infos.study_id WHERE (patient_basic_infos.baby_medical_record_number='"+req.params.id+"' OR patient_baby_appears_infos.study_id='"+req.params.id+"') AND  `patient_basic_infos`.`hospital_id`='"+req.params.hospital_id+"'  ORDER BY patient_baby_appears_infos.createdAt DESC LIMIT 1;";

  console.clear();
  console.error(queryStr)
  sequelize.query(queryStr, {
    type: sequelize.QueryTypes.SELECT
  })

    .then(resp => {
      result(res, resp);
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

  /**
   * @method :- get_general
   * @requires : - for the used the default Docter get_general
   * @return :-  User Response Send
   */
  app.post('/patient/maternal/:id', (req, res) => {
    maternal_model.findAll({
        where: {
          study_id: req.params.id
        }
      })
      .then(resp => {
        result(res, res.resp);
      })
      .catch(err => {
        res.status(500).json(err);
      });
  });


  /**
   * @method :- get_general
   * @requires : - for the used the default Docter get_general
   * @return :-  User Response Send
   */
  // app.post('/patient/get_baby_cns/:id', (req, res) => {
  //   baby_cns_model.findAll({
  //       where: {
  //         study_id: req.params.id
  //       }
  //     })
  //     .then(resp => {
  //       result(res, res.resp);
  //     })
  //     .catch(err => {
  //       res.status(500).json(err);
  //     });
  // });


  /**
   * @method :- get_maternal
   * @requires : - for the used the default get_maternal get_general
   * @return :-  User Response Send
   */
  // app.post('/patient/get_baby_resp/:id', (req, res) => {
  //   const whereObj = {
  //     patient_id: req.params.id
  //   };

  //   baby_resp_model.findAll({
  //       where: whereObj,
  //       order: [
  //         ['id', 'DESC']
  //       ]
  //     }, )
  //     .then(resp => {
  //       result(res, resp);
  //     })
  //     .catch(err => {
  //       res.status(500).json(err);
  //     });
  // });
  /**
   * @method :- get_pesient
   * @requires : - for the used the default patient get_pesient
   * @return :-  User get_pesient get the  info...
   */
  app.post('/get_basic_tabs', (req, res) => {
    var queryStr = 'SELECT * FROM `patient_levels` as pl INNER JOIN patient_basic_infos as bn ON (pl.patient_id =bn.patient_id) where pl.patient_id="' + req.body.patient_id + '"';
    if (!req.body.initial) {
      queryStr += ' and pl.patient_level=' + req.body.patient_level;
    }
    queryStr += " ORDER BY bn.id DESC LIMIT 0 , 1";
    console.clear();
    console.error(queryStr)
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
 * @param {*} res 
 * @param {*} resp 
 * @function {*} result
 */
const result = (res, resp) => {
  if (resp && resp.length > 0) {
    res.json(res_help.success(constant.success, resp));
  } else {
    res.json(res_help.notFound("record not found.", resp));
  }
}