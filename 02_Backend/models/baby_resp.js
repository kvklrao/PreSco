import table_const from '../config/table'
module.exports = (sequelize, type) => {
  return sequelize.define(table_const.baby_resp, {
    id: {
      type: type.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    groaning: type.STRING,
    grunting: type.STRING,
    stridor: type.STRING,
    retraction: type.STRING,
    fast_breathing: type.STRING,
    oxygen_saturation: type.STRING,
    breathing_rate: type.STRING,
    baby_chest_indrawing: type.STRING,
    x_ray_status_done: type.STRING,
    x_ray_result: type.STRING,
    x_ray_status: type.STRING,
    x_ray_diagnosis_any_other: type.STRING,
    apnea_status: type.STRING,
    apnea_diagnosis: type.STRING,
    baby_respiratory_support: type.JSON,
    baby_respiratory_support_if_yes: type.STRING,
   // baby_respiratory_support_if_other: type.STRING,
    study_id: type.STRING,
    reading: type.STRING
  });
};
