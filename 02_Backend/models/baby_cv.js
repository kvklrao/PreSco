import table_const from '../config/table'
module.exports = (sequelize, type) => {
 return sequelize.define(table_const.baby_cv, {
   id: {
     type: type.INTEGER,
     primaryKey: true,
     autoIncrement: true,
   },
   heart_rate: type.STRING,
   urine_output: type.STRING,
   baby_blood_pressure_mean_arterial_bp: type.STRING,
   baby_blood_pressure_upper_limb: type.STRING,
   baby_blood_pressure_lower_limb: type.STRING,
   capillary_refill: type.STRING,
   capillary_refill_unit: type.STRING,
   low_peripheral_pulse_volume: type.STRING,
   cool_peripheries: type.STRING,
   two_d_echo_done: type.STRING,
   two_d_echo_done_if_yes: type.STRING,
   baby_on_ionotropes: type.STRING,
   central_line: type.STRING,
   //skin_pustules: type.STRING,
   infusion_of_blood_products: type.STRING,
   study_id: type.INTEGER,
   reading: type.STRING,
   central_line_value: type.STRING,

   central_line_if_applicable: type.STRING,
   central_line_insert_date: type.STRING,
   central_line_removed_date: type.STRING,


 });
};