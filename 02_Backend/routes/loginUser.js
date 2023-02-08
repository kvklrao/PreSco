import { hospital_model,user_model,hospital_branch_model,user_type_model } from '../sequelize';
const pReadingModels = require('../sequelize');
import bcrypt from 'bcrypt';

import res_help from '../helper/res';
import constant from '../helper/constant';
import { generatePasscode, portDecider } from '../helper/util';

const responseHelper = require('../helper/res');
let Validator = require('validatorjs');
const BCRYPT_SALT_ROUNDS = constant.bcrypt_solt_text;
const enumConst = require('../helper/enum')
const {sequelize} = require('../sequelize')
const setting = require('../config/setting')

module.exports = app => {
  /**
   * @method :- login
   * @requires : - for the used the default Docter login
   * @return :- Login User Response
   */
  app.post('/login', (req, res) => {
      user_model
      .findOne({
        where: {
          user_name: req.body.username,
          password: req.body.password,
        },
      })
      .then((result) => {
        if (result != null) {
            let loginResponse = {
              access_token: { access_token: "access_token" },
            }
            user_model.findOne({
              where: sequelize.and(
                sequelize.where(sequelize.literal('user_name'), '=', req.body.username),
                //sequelize.where(sequelize.literal('binary password'), '=', req.body.password),
                sequelize.where(sequelize.literal('active_flag'), '=', 1),
              )
            })
            .then(result => {
              if(result!=null){
                
                var userId = result.user_id
                
                loginResponse.username=result.user_name
                loginResponse.email=result.email_address
                loginResponse.phone=result.contact_number

                user_type_model.findOne({
                  where:{
                    user_type_id:result.user_type_id
                  }
                }).then(result=>{
                  loginResponse.user_type=result.user_type
                })
                
                if(result.user_type_id == enumConst.userType.hospital){

                  hospital_model.findOne({
                    where: {
                      user_id: result.user_id         
                    }
                  })
                  .then(result=>{
                    loginResponse.id=result.hospital_id
                    loginResponse.hospital_name=result.hospital_name
                    loginResponse.user_id = result.user_id
          
                    if(result!=null){
          
                      hospital_branch_model.findAll({
                        where: {
                          hospital_id: result.hospital_id         
                        },
                        order:[
                          ['branch_name', 'ASC']
                        ],
                        limit: 1
                      }).then(result=>{
                        if(result.length>0){
                          loginResponse.hospital_branch_name=result[0].branch_name
                          loginResponse.hospital_branch_id=result[0].hospital_branch_id
                          res.json( res_help.success(constant.login_success,loginResponse))
                        }else{
                          loginResponse.hospital_branch_name=null
                          loginResponse.hospital_branch_id=null
                          res.json( res_help.success(constant.login_success,loginResponse))
                        }
                      })
                    }
                  })

                }else if (result.user_type_id == enumConst.userType.hospital_branch){
                
                  sequelize.query('SELECT  m_hospitals_branches.hospital_branch_id,m_hospitals_branches.user_id,m_hospitals_branches.branch_name,m_hospitals_branches.hospital_id,m_hospitals.hospital_name '+
                  ' FROM m_hospitals_branches '+
                  ' JOIN m_hospitals ON m_hospitals.hospital_id = m_hospitals_branches.hospital_id '+
                  ' WHERE m_hospitals_branches.user_id=:user_id',
                  { replacements: { 
                    user_id: result.user_id,
                  }, type: sequelize.QueryTypes.SELECT })
                  .then(result =>{
                    loginResponse.hospital_name=result[0].hospital_name
                    loginResponse.id=result[0].hospital_id
                    loginResponse.hospital_branch_name=result[0].branch_name
                    loginResponse.hospital_branch_id=result[0].hospital_branch_id
                    loginResponse.user_id=result[0].user_id
                    loginResponse.user_type='Hospital Branch'
                    return loginResponse
                  })
                  .then(loginResponse =>{
                    res.json( res_help.success(constant.login_success,loginResponse))
                  })


                }else if(result.user_type_id == enumConst.userType.hospital_staff){
                
                  sequelize.query('SELECT m_staffs.staff_id,m_staffs.user_id,m_staffs.first_name ,m_staffs.last_name, '+
                ' map_staff_hospitals.hospital_branch_id, map_staff_hospitals.hospital_id, '+
                ' m_hospitals.hospital_name,m_hospitals_branches.branch_name '+
                ' FROM m_staffs '+
                ' JOIN  map_staff_hospitals ON map_staff_hospitals.staff_id = m_staffs.staff_id '+
                ' JOIN m_hospitals ON m_hospitals.hospital_id = map_staff_hospitals.hospital_id '+
                ' JOIN m_hospitals_branches ON m_hospitals_branches.hospital_branch_id = map_staff_hospitals.hospital_branch_id '+
                ' WHERE m_staffs.user_id =:user_id and map_staff_hospitals.active_flag=1',
                  { replacements: { 
                      user_id: result.user_id,
                  }, type: sequelize.QueryTypes.SELECT }
                  ).then(result => {
                    var query = `SELECT permission_id FROM map_staff_hospitals WHERE staff_id =`+result[0].staff_id+` and hospital_branch_id = `+result[0].hospital_branch_id
                  
                    sequelize.query(query,
                    { replacements: { 
                        user_id: userId,
                    }, type: sequelize.QueryTypes.SELECT }
                    ).then(permissionResult => {
                      if(permissionResult[0].permission_id == null){
                        loginResponse.data_entry=false
                        loginResponse.generate_score=false
                    }
                    else if(permissionResult[0].permission_id == 1){
                      loginResponse.data_entry=true
                      loginResponse.generate_score=false
                    }
                    else if(permissionResult[0].permission_id == 2){
                      loginResponse.data_entry=false
                      loginResponse.generate_score=true
                    }
                    else if(permissionResult[0].permission_id == 3){
                      loginResponse.data_entry=true
                      loginResponse.generate_score=true
                    }
                      return loginResponse
                    }).then(loginResponse =>{
                      if(result.length > 0){
                        loginResponse.hospital_name=result[0].hospital_name
                        loginResponse.id=result[0].hospital_id
                        loginResponse.hospital_branch_name=result[0].branch_name
                        loginResponse.hospital_branch_id=result[0].hospital_branch_id
                        loginResponse.staff_id=result[0].staff_id
                        loginResponse.first_name=result[0].first_name
                        loginResponse.last_name=result[0].last_name
                        loginResponse.user_type='Hospital Staff'
                        loginResponse.user_id= result[0].user_id
                        res.json( res_help.success(constant.login_success,loginResponse))
                      }else{
                        res.json( res_help.notFound(constant.invalid_credential_msg,loginResponse))
                      }
                    })
                })
              }
              else if(result.user_type_id == enumConst.userType.referral_doctor){

                sequelize.query('SELECT m_referral_doctors.referral_id,m_referral_doctors.first_name,m_referral_doctors.last_name, '+
                ' m_users.user_id , m_users.user_type_id,m_users.user_name,m_users.contact_number,m_users.email_address,m_users.created_by '+
                ' FROM m_referral_doctors '+ 
                ' JOIN m_users ON m_users.user_id = m_referral_doctors.user_id '+
                ' WHERE m_referral_doctors.user_id =:user_id',
                { replacements: { 
                    user_id: result.user_id,
                }, type: sequelize.QueryTypes.SELECT }
                ).then(result => {
                  if(result.length >0){
                    loginResponse.referral_id=result[0].referral_id
                    loginResponse.first_name=result[0].first_name
                    loginResponse.last_name=result[0].last_name
                    loginResponse.user_id =result[0].user_id
                    loginResponse.user_type_id=result[0].user_type_id
                    loginResponse.user_name = result[0].user_name
                    loginResponse.contact_number = result[0].contact_number
                    loginResponse.email_address=result[0].email_address
                    loginResponse.created_by = result[0].created_by
                    loginResponse.user_type='Referral Doctor'
                    res.json( res_help.success(constant.login_success,loginResponse))
                  }else{
                    res.json( res_help.notFound(constant.invalid_credential_msg,loginResponse))
                  }
                  
              })
            }
            else if(result.user_type_id == enumConst.userType.aasha){
            sequelize.query(` SELECT m_hospitals.hospital_name,m_hospitals.hospital_id,m_hospitals.user_id, m_users.user_name,m_users.email_address, m_users.user_type_id FROM m_hospitals
            JOIN m_users ON m_users.user_id=m_hospitals.user_id
            WHERE m_hospitals.user_id=:user_id `,
                { replacements: { 
                    user_id: result.user_id,
                }, type: sequelize.QueryTypes.SELECT }
                ).then(result => {
                  if(result.length >0){
                    loginResponse.hospital_name=result[0].hospital_name
                    loginResponse.hospital_id=result[0].hospital_id
                    loginResponse.id=result[0].hospital_id
                    loginResponse.user_id =result[0].user_id
                    loginResponse.user_type_id=result[0].user_type_id
                    loginResponse.user_name = result[0].user_name
                    loginResponse.email_address=result[0].email_address
                    loginResponse.user_type='Aasha'

                    res.json( res_help.success(constant.login_success,loginResponse))
                  }else{
                    res.json( res_help.notFound(constant.invalid_credential_msg,loginResponse))
                  }          
              })
            } else if(result.user_type_id == enumConst.userType.PSC){
              sequelize.query(` SELECT m_hospitals.hospital_name,m_hospitals.hospital_id,m_hospitals.user_id, m_users.user_name,m_users.email_address, m_users.user_type_id FROM m_hospitals
              JOIN m_users ON m_users.user_id=m_hospitals.user_id
              WHERE m_hospitals.user_id=:user_id `,
                  { replacements: { 
                      user_id: result.user_id,
                  }, type: sequelize.QueryTypes.SELECT }
                  ).then(result => {
                    if(result.length >0){
                    loginResponse.hospital_name=result[0].hospital_name
                    loginResponse.hospital_id=result[0].hospital_id
                    loginResponse.id=result[0].hospital_id
                    loginResponse.user_id =result[0].user_id
                    loginResponse.user_type_id=result[0].user_type_id
                    loginResponse.user_name = result[0].user_name
                    loginResponse.email_address=result[0].email_address
                    loginResponse.user_type='PHC'
        
                    res.json( res_help.success(constant.login_success,loginResponse))
                    }else{
                    res.json( res_help.notFound(constant.invalid_credential_msg,loginResponse))
                    }          
                })
            }
          }else{
                res.json( res_help.notFound(constant.invalid_credential_msg,loginResponse))
              }
            })
        }
      });
  });

  /**
    * @method :- signup
    * @requires : - for the used the default Docter signup
    * @return :-  User Response Send
    */
  app.post('/signup', (req, res) => {

    const reqData = {
      first_name: "",
      last_name: "",
      email: req.body.email,
      username: req.body.username,
      password: req.body.password,
      hospital_name: req.body.hospital_name,
      hospital_branch_name: req.body.hospital_branch_name,
      user_type: req.body.user_type,
    };

    let rules = {
      username: 'required',
      password: 'required',
      email: 'required|email'
    };

    let validation = new Validator(reqData, rules);
    if (validation.fails()) {
      res.status(200).json(res_help.notFound(constant.common_required));
    }

    

    isExists(hospital_model, 'username', reqData.username, (res_status, response) => {
      console.log("run1");
      
      if (res_status) {
        console.log("run2");
        res.json(res_help.success(constant.username_alreay_taken_msg, [], constant.username_alreay_taken_status));
      } else {
        isExists(hospital_model, 'email', reqData.email, (res_status, response) => {
          console.log("run3");
          if (res_status) {
            console.log("run4");

            res.json(res_help.success(constant.email_alreay_taken_msg, [], constant.username_alreay_taken_status));
          } else {
            console.log("run5");

            bcrypt
              .hash(reqData.password, BCRYPT_SALT_ROUNDS)
              .then(function (hashedPassword) {
                reqData.password = hashedPassword;
                hospital_model.create(reqData).then((response) => {
                  res.json(res_help.success(constant.signup_success, response));
                });
              });
          }
        });
      }
    });
  });

  app.post('/forgotPassword', (req, res) => {
    
    var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    if (req.body.email.match(mailformat)) {
      pReadingModels.user_model.findOne({
        where: {
          email_address: req.body.email,
          active_flag: 1
        }
      }).then((result) => {
        if (!result) {
          res.json(responseHelper.alreadyExist('Email does not exist', result))
        } else {
          var passcode = result.passcode
          if (!passcode) {
            passcode = generatePasscode();
            result.passcode = passcode;
            result.save();
          }

          const url = setting.SERVER_URL + '/#/reset_password/' + passcode;

          let transporter = nodeMailer.createTransport({
            host: setting.EMAIL_SERVER,
            port: 465,
            secure: true,
            auth: {
                user: setting.EMAIL_USER, 
                pass: setting.EMAIL_PASSWORD
            }
          });

   
          let msg = {
            to: req.body.email,
            from: setting.EMAIL_USER,
            subject: 'Password reset',
            text: `Click this link to set the new password::- ${url}`,
            html: `<b> Hi </b>` +
              `<br>Click the link below to set the new password -</br>` +
              `<br>` + url + `</br>` +
              `<br>If you don't want to change your password, please ignore this email.</br>
              <b> Thanks <b></br><b>Avyantra Health Technologies</b>`
          };

          transporter.sendMail(msg, function(error, info){
              if (error) {               
                  res.json(responseHelper.serveError(constant.error_msg,error))
              } 
              else {
                  res.json( responseHelper.success(constant.successfully_registered,req.body))
              }
          });
   
        }
      }).catch((err) => {
        res.json(responseHelper.serveError(constant.error_msg, err))
      });
    } else {
      res.json(responseHelper.alreadyExist('Email is not valid', {}))
    }

  });
  
  app.post('/resetPassword', (req, res) => {

    pReadingModels.user_model.findOne({
      where:{
        passcode:req.body.passcode,
        active_flag:1
      }
    })
    .then( async result=> {
      if (result) {
        result.password = req.body.password;
        result.save();
        res.json(
          responseHelper.success("Password changed successfully", result)
        );
      } else {
        res.json(responseHelper.success("Invalid passcode", result));
      }
    }).catch((err)=>{
      console.log(err);
      res.json(responseHelper.serveError("Password is not changed, Please contact custumer support",err))
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
  const whereObj = {
  }
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



