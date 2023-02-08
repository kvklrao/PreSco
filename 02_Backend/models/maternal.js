import table_const from '../config/table'
module.exports = (sequelize, type) => {
  return sequelize.define(table_const.maternal, {
      id: {
        type: type.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      study_id: type.INTEGER,
      mother_age: type.STRING,
      mother_weight_unit: type.STRING,
      mother_weight: type.INTEGER,
      mother_height: type.INTEGER,
      mother_height_unit: type.STRING,
      mother_haemoglobin: type.STRING,
      mother_bmi: type.STRING,
      maternal_blood_pressure: type.STRING,
      maternal_blood_pressure_diastolic: type.STRING,
      maternal_diabetes: type.STRING,
      maternal_fever: type.STRING,
      maternal_fever_unit: type.STRING,
      maternal_fever_basic: type.STRING,
      maternal_thyroid_function: type.STRING,
      maternal_thyroid_function_basic: type.STRING,
      maternal_thyroid_function_unit_basic: type.STRING,
      maternal_thyroid_function_unit_basic_unit: type.STRING,
      more_than_3_vaginal_examinations_during_labor: type.STRING,
      rupture_of_membranes_rom_two: type.STRING,
      rupture_of_membranes_rom_one: type.STRING,
      leaking_pv: type.STRING,
      rupture_of_membranes_rom: type.STRING,
      smelly_amniotic_fluid: type.STRING,
      chorioamnionitis: type.STRING,
      gbs_infection: type.STRING,
      colonisation_or_urinary_tract_infection: type.STRING,
      torch_infections: type.STRING,
      type_of_delivery: type.STRING,
      delayed_cord_clamping: type.STRING,
      vaginal_swab_culture: type.STRING,
      vaginal_swab_culture_two: type.STRING,
      vaginal_swab_culture_three: type.STRING,
      amniotic_fluid_culture: type.STRING,
      amniotic_fluid_culture_three: type.STRING,
      amniotic_fluid_culture_two: type.STRING,
      maternal_fever_duration: type.STRING,
      pih: type.STRING,
      
    }

  );
};