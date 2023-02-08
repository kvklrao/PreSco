import Sequelize from 'sequelize';
//import hospital_model from './models/hospital';
import patient from './models/patient';
import patient_level from './models/patient_level';
import basic from './models/basic';
import general from './models/general';
import maternal from './models/maternal';
import baby_appear from './models/baby_appear';
import baby_resp from './models/baby_resp';
import baby_cv from './models/baby_cv';
import baby_cns from './models/baby_cns';
import baby_final from './models/baby_final';
import baby_antibiotic from './models/baby_antibiotic';
import baby_investigation from './models/baby_investigation';
import baby_git from './models/baby_git';
import setting from './config/setting';
import hospital_model from './models/m_hospital';
import user_model from './models/user';
import user_role_model from './models/map_user_role';
import hospital_branch_model from './models/hospital_branch';
import role_model from './models/roles';
import user_type_model from './models/user_type';
import speciality_model from './models/speciality';
import staff_model from './models/staff';
import hospital_staff_model from './models/hospital_staff';
import hospital_branch_speciality_model from './models/hospital_branch_speciality';
import hospital_branch_roles_model from './models/hospital_branch_roles';
import user_module_permission_model from './models/map_user_module_permission';
import staff_permission_model from './models/map_user_permission';
import permission_model from './models/permission';
import patient_model from './models/patient_infos';
import referral_doctor_model from './models/referral_doctor';
import referral_hospitals_model from './models/referral_hospitals';
import message_model from './models/message';
import staff_referral_hospital_model from './models/staff_referral_hospital';
import referral_opinion_model from './models/referral_opinion';
import referral_files_model from './models/referral_files';
import state_model from './models/state'


// const sequelize = new Sequelize(
//   setting.dev_db, setting.dev_user, setting.dev_password, {
//     host: setting.dev_host,
//     dialect: setting.db_type,
//   });

const sequelize = new Sequelize(
  setting.local_db, setting.local_user, setting.local_password, {
    host: setting.local_host,
    port: setting.port,
    dialect: setting.db_type,
    logging:false
  });

const patient_db = patient(sequelize, Sequelize);
//const hospital_db = hospital_model(sequelize, Sequelize);
const patient_level_db = patient_level(sequelize, Sequelize);
const basic_db = basic(sequelize, Sequelize);
const general_db = general(sequelize, Sequelize);
const maternal_db = maternal(sequelize, Sequelize);
const baby_appear_db = baby_appear(sequelize, Sequelize);
const baby_resp_db = baby_resp(sequelize, Sequelize);
const baby_cv_db = baby_cv(sequelize, Sequelize);
const baby_cns_db = baby_cns(sequelize, Sequelize);
const baby_git_db = baby_git(sequelize, Sequelize);
const baby_final_db = baby_final(sequelize, Sequelize);
const baby_antibiotic_db = baby_antibiotic(sequelize, Sequelize);
const baby_investigation_db = baby_investigation(sequelize, Sequelize);
const hospital_db = hospital_model(sequelize,Sequelize);
const user_db = user_model(sequelize,Sequelize);
const user_role_db = user_role_model(sequelize,Sequelize)
const role_db = role_model(sequelize,Sequelize)
const user_module_permission_db = user_module_permission_model(sequelize,Sequelize)
const hospital_branch_db = hospital_branch_model(sequelize,Sequelize)
const user_type_db = user_type_model(sequelize,Sequelize)
const speciality_db =speciality_model(sequelize,Sequelize)
const hospital_staff_db =hospital_staff_model(sequelize,Sequelize)
const hospital_branch_speciality_db =hospital_branch_speciality_model(sequelize,Sequelize)
const hospital_branch_roles_db =hospital_branch_roles_model(sequelize,Sequelize)
const staff_db = staff_model(sequelize,Sequelize)
const staff_permission_db = staff_permission_model(sequelize,Sequelize)
const permission_db = permission_model(sequelize,Sequelize)
const patient_infos_db = patient_model(sequelize,Sequelize)
const referral_doctor_db = referral_doctor_model(sequelize,Sequelize)
const referral_hospitals_db = referral_hospitals_model(sequelize,Sequelize)
const message_db = message_model(sequelize,Sequelize)
const staff_referral_hospital_db = staff_referral_hospital_model(sequelize,Sequelize)
const referral_opinion_db =referral_opinion_model(sequelize,Sequelize)
const referral_files_db =referral_files_model(sequelize,Sequelize)
const state_db =state_model(sequelize,Sequelize)
sequelize.sync().then(() => {}).finally(() => {
  //sequelize.close();
});

module.exports = {
  sequelize: sequelize,
  hospital_model: hospital_db,
  user_model:user_db,
  patient_model: patient_db,
  patient_level_model: patient_level_db,
  basic_model: basic_db,
  general_model: general_db,
  maternal_model: maternal_db,
  baby_appear_model: baby_appear_db,
  baby_resp_model: baby_resp_db,
  baby_cv_model: baby_cv_db,
  baby_cns_model: baby_cns_db,
  baby_git_model: baby_git_db,
  baby_final_model: baby_final_db,
  baby_antibiotic_model: baby_antibiotic_db,
  baby_investigation_model: baby_investigation_db,
  user_role_model:user_role_db,
  user_module_permission_model:user_module_permission_db,
  hospital_branch_model:hospital_branch_db,
  role_model:role_db,
  user_type_model:user_type_db,
  hospital_branch_roles_model:hospital_branch_roles_db,
  hospital_branch_speciality_model:hospital_branch_speciality_db,
  speciality_model:speciality_db,
  staff_model:staff_db,
  hospital_staff_model:hospital_staff_db,
  staff_permission_model:staff_permission_db,
  permission_model:permission_db,
  patient_model:patient_infos_db,
  referral_doctor_model:referral_doctor_db,
  referral_hospitals_model:referral_hospitals_db,
  message_model:message_db,
  staff_referral_hospital_model:staff_referral_hospital_db,
  referral_opinion_model:referral_opinion_db,
  referral_files_model:referral_files_db,
  state_model:state_db
};