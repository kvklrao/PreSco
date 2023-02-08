import table_const from '../config/table'
module.exports = (sequelize, type) => {
  return sequelize.define(table_const.baby_git, {
    id: {
      type: type.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    study_id: type.INTEGER,
    abdominal_dystension: type.STRING,
    frequency_of_stools: type.STRING,
    diarrhea: type.STRING,
    vomiting: type.STRING,
    feeding_intolerance: type.STRING,
    baby_movement: type.STRING,
    patient_id: type.STRING,
    reading: type.STRING,
   // baby_movement:type.STRING
  });
};
