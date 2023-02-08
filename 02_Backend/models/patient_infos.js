import table_const from '../config/table'
module.exports = (sequelize, type) => {
  return sequelize.define(table_const.patient_infos, {
    patient_id: {
      type: type.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    baby_name: type.STRING,
    mother_name: type.STRING,
    father_name: type.STRING,
    state: type.STRING,
    address: type.STRING,
    city: type.STRING,
    nationality: type.STRING,
    email_id: type.STRING,
    primary_contact_no: type.STRING,
    secondary_contact_no: type.STRING,
    pincode:type.BIGINT,
    study_id:type.BIGINT,
    active_flag:type.INTEGER,
    deleted_flag:type.INTEGER,
    created_by:type.BIGINT,
    updated_by:type.FLOAT
  });
};

