import table_const from '../config/table'
module.exports = (sequelize, type) => {
  return sequelize.define(table_const.patient_level, {
    id: {
      type: type.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    patient_id: type.STRING,
    patient_level: type.INTEGER,
    is_last: type.BOOLEAN,
    tab_name:type.STRING
  
  });
};
