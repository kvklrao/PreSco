import table_const from '../config/table'
module.exports = (sequelize, type) => {
  return sequelize.define(table_const.baby_antibiotic, {
    id: {
      type: type.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    study_id: type.INTEGER,
    antibiotic_given: type.STRING,
    date_of_administration_of_antiobiotic: type.STRING,
    time_of_administration_of_antiobiotic_hours: type.STRING,
    time_of_administration_of_antiobiotic_minute: type.STRING,
    antibiotic_name: type.STRING,
    antibiotic_name_if_other: type.STRING,
    grade_of_antibiotic: type.STRING,
    date_of_blood_samples_sent_for_culture_test: type.STRING,
    time_of_blood_samples_sent_for_culture_test_hours: type.STRING,
    time_of_blood_samples_sent_for_culture_test_minute: type.STRING,
    blood_sample_taken_prior_to_antiobiotic_administration: type.STRING,
    reading: type.STRING
  });
};
