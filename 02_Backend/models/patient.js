import table_const from '../config/table'
module.exports = (sequelize, type) => {
  return sequelize.define(table_const.patient, {
    id: {
      type: type.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    patient_first_name: type.STRING,
    patient_last_name: type.STRING,
    phone: type.STRING,
    state: type.STRING,
    country: type.STRING
  });
};
