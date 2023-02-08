import table_const from '../config/table'
module.exports = (sequelize, type) => {
  return sequelize.define(table_const.baby_appears, {
    id: {
      type: type.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    baby_appearance: type.STRING,
    baby_skin_colour: type.STRING,
    baby_cry_sound: type.STRING,
    baby_cry_sound_status: type.STRING,
    hypotonia_muscular_response_one_min_after_birth: type.STRING,
    hypotonia_muscular_response_five_min_after_birth: type.STRING,
    excessive_sleeping: type.STRING,
    hypothermia: type.STRING,
    hypothermia_status: type.STRING,
    hypothermia_status_value: type.STRING,
    baby_feeding_status: type.STRING,
    baby_presence_of_convulsions: type.STRING,
    baby_jaundice: type.STRING,
    breast_feeding_initiation: type.STRING,
    kangaroo_mother_care: type.STRING,
    umbilical_discharge: type.STRING,
    study_id: type.STRING,
    reading: type.STRING,
    reading_date:type.STRING,
    baby_weight_at_birth:type.STRING,
    baby_weight_at_birth_unit:type.STRING,
    time_of_reading_hours:type.STRING,
    time_of_reading_minute:type.STRING,
    umbilical_redness:type.STRING,
    umbilical_enduration:type.STRING,
    skin_pustules: type.STRING

  });
};
