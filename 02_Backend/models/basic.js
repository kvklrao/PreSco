import table_const from '../config/table'
module.exports = (sequelize, type) => {
  return sequelize.define(table_const.basic, {
    id: {
      type: type.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    // study_id: {
    //   type: type.INTEGER.UNSIGNED
    // },
    hospital_id: type.INTEGER,
    hospital_type:type.STRING,
    hospital_branch_id:type.INTEGER,
    hospital_name: type.STRING,
    hospital_branch_name: type.STRING,
    baby_medical_record_number: type.STRING,
    baby_mother_medical_record_number: type.STRING,
    deleted_flag:type.BIGINT,
    active_flag:type.BIGINT,

    // baby_mother_name: type.STRING,
    // baby_name: type.STRING,
    is_update: type.BOOLEAN
  });
};