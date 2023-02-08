query_str = """
                select
                    `a`.`id` AS `Study Id`,
                    `a`.`id` AS `study_id`,               
                    `a`.`hospital_type` AS `hospital_type`,
                    `b`.`baby_age_of_admission` AS `Baby Age at Admission`,
                    `b`.`baby_preterm` AS `Baby Preterm`,
                    `b`.`baby_gender` AS `Baby Gender`,
                    `b`.`baby_condition_jaundice_suspect` AS `Diagnosis (Jaundice)`,
                    `b`.`baby_condition_anemia_suspect` AS `Diagnosis (Anemia)`,
                    `b`.`baby_condition_lbw_suspect` AS `Diagnosis (LBW)`,
                    `b`.`place_of_delivery` AS `Place of Delievery`,
                    `b`.`birth_facility` AS `Birth Facility`,
                    `b`.`baby_gestational_age` AS `Baby Gestational Age`,
                    `b`.`baby_weight_at_birth` AS `Baby Weight At Birth`,
                    `b`.`baby_weight_at_admission` AS `Baby Weight At Admission`,
                    `b`.`baby_date_of_admission` AS `Baby Date Of Admission`,
                    `c`.`maternal_diabetes` AS `Maternal Diabetes`,
                    `c`.`rupture_of_membranes_rom_one` AS `Rupture Of Membranes Rom One`,
                    `c`.`rupture_of_membranes_rom` AS `Rupture Of Membranes Rom`,
                    `c`.`smelly_amniotic_fluid` AS `Smelly Amniotic Fluid`,
                    `c`.`type_of_delivery` AS `Type Of Delivery`,
                    `c`.`delayed_cord_clamping` AS `Delayed Cord Clamping`,
                    `d`.`baby_appearance` AS `Baby Appearance`,
                    `d`.`baby_skin_colour` AS `Baby Skin Colour`,
                    `d`.`baby_cry_sound` AS `Baby Cry Sound`,
                    `d`.`excessive_sleeping` AS `Excessive Sleeping`,
                    `d`.`hypothermia` AS `Hypothermia`,
                    `d`.`hypothermia_status_value` AS `Hypothermia Status Value`,
                    `d`.`baby_feeding_status` AS `Baby Feeding Status`,
                    `d`.`baby_jaundice` AS `Baby Jaundice`,
                    `d`.`breast_feeding_initiation` AS `Breast Feeding Initiation`,
                    `d`.`kangaroo_mother_care` AS `Kangaroo Mother Care`,
                    `e`.`groaning` AS `Groaning`,
                    `e`.`grunting` AS `Grunting`,
                    `e`.`stridor` AS `Stridor`,
                    `e`.`retraction` AS `Retraction`,
                    `e`.`fast_breathing` AS `Fast Breathing`,
                    `e`.`baby_chest_indrawing` AS `Baby Chest Indrawing`,
                    `f`.`baby_blood_pressure_mean_arterial_bp` AS `Baby Blood Pressure Mean Arterial Bp`,
                    `f`.`baby_blood_pressure_upper_limb` AS `Baby Blood Pressure Upper Limb`,
                    `f`.`baby_blood_pressure_lower_limb` AS `Baby Blood Pressure Lower Limb`,
                    `f`.`cool_peripheries` AS `Cool Peripheries`,
                    `g`.`seizures` AS `Seizures`,
                    `g`.`abnormal_movements_like_tonic_posturing` AS `Abnormal Movements Like Tonic Posturing`,
                    `g`.`af_bulge` AS `Af Bulge`,
                    `h`.`abdominal_dystension` AS `Abdominal Dystension`,
                    `h`.`frequency_of_stools` AS `Frequency Of Stools`,
                    `h`.`diarrhea` AS `Diarrhea`,
                    `h`.`vomiting` AS `Vomiting`,
                    `h`.`feeding_intolerance` AS `Feeding Intolerance`,
                    `h`.`baby_movement` AS `Baby Movement`,
                    `i`.`baby_blood_glucose` AS `Baby Blood Glucose`,
                    `i`.`blood_culture_report` AS `Blood Culture Report`
                from
                    `avyantra_dev`.`patient_basic_infos` `a`
                join `avyantra_dev`.`patient_general_infos` `b` on
                    `a`.`id` = `b`.`study_id`
                join `avyantra_dev`.`patient_maternal_infos` `c` on
                    `a`.`id` = `c`.`study_id`
                join `avyantra_dev`.`patient_baby_appears_infos` `d` on
                    `a`.`id` = `d`.`study_id`
                join `avyantra_dev`.`patient_baby_resp_infos` `e` on
                    `a`.`id` = `e`.`study_id`
                    and `d`.`reading` = `e`.`reading`
                join `avyantra_dev`.`patient_baby_cv_infos` `f` on
                    `a`.`id` = `f`.`study_id`
                    and `d`.`reading` = `f`.`reading`
                join `avyantra_dev`.`patient_baby_cns_infos` `g` on
                    `a`.`id` = `g`.`study_id`
                    and `d`.`reading` = `g`.`reading`
                join `avyantra_dev`.`patient_baby_git_infos` `h` on
                    `a`.`id` = `h`.`study_id`
                    and `d`.`reading` = `h`.`reading`
                join `avyantra_dev`.`patient_baby_investigations` `i` on
                    `a`.`id` = `i`.`study_id`
                    and `d`.`reading` = `i`.`reading`
                where
                    (`a`.`deleted_flag` = 0 or `a`.`deleted_flag` is null) 
                    and `a`.`id` not in ('727', '621', '701')
                    and `a`.`hospital_type` = 7
                    and `a`.id = {0}
                order by
                    `a`.`hospital_name`,
                    `a`.`hospital_branch_name`,
                    `a`.`baby_medical_record_number`,
                    `a`.`id` desc;
            """


full_query_str = """
            select
                `a`.`id` AS `study_id`,
                `a`.`hospital_type` AS `hospital_type`,
                `a`.`id` AS 'Study Id',
                `b`.`baby_age_of_admission` AS 'Baby Age at Admission',
                `b`.`baby_gestational_age` AS 'Baby Gestational Age',
                `b`.`baby_weight_at_admission` AS 'Baby Weight At Admission',
                `b`.`baby_weight_at_birth` AS `Baby Weight At Birth`,
                `c`.`smelly_amniotic_fluid` AS 'Smelly Amniotic Fluid',
                `d`.`baby_appearance` AS 'Baby Appearance',
                `f`.`heart_rate` AS 'Heart Rate',
                `b`.`baby_condition_yes_eos_los` AS 'Diagnosis (EOS/LOS/NA)',
                `i`.`baby_blood_glucose` AS 'Baby Blood Glucose',
                `i`.`total_leucocute_count` AS 'Total Leucocute Count',
                `i`.`thrombocytopenia` AS 'Thrombocytopeni',
                `c`.`gbs_infection` AS 'Gbs Infection',
                `i`.`sodium` AS 'Sodium',
                `i`.`potassium` AS 'Potassium',
                `i`.`chlorine` AS 'Chlorine',
                `i`.`calcium` AS 'Calcium',
                `i`.`creatinine` AS 'Creatinine',
                `i`.`absolute_neutrophil_count` AS 'Absolute Neutrophil Count',
                `e`.`breathing_rate` AS 'Breathing Rate',
                `c`.`leaking_pv` AS 'Leaking pv',
                `i`.`blood_culture_report` AS 'Blood Culture Report',
                `e`.`oxygen_saturation` AS 'Oxygen Saturation',
                `i`.`bilirubin_levels` AS 'Bilirubin Levels',
                `i`.`baby_haemoglobin_levels` AS 'Baby Haemoglobin Levels',
                `f`.`baby_blood_pressure_lower_limb` AS 'Baby Blood Pressure Lower Limb',
                `d`.`baby_feeding_status` AS 'Baby Feeding Status',
                `i`.`baby_c_reactive_protien_levels` AS 'Baby Reactive Protien Levels',
                `f`.`baby_blood_pressure_mean_arterial_bp` AS 'Baby Blood Pressure Mean Arterial Bp'
            from
                `avyantra_dev`.`patient_basic_infos` `a`
            join `avyantra_dev`.`patient_general_infos` `b` on
                `a`.`id` = `b`.`study_id`
            join `avyantra_dev`.`patient_maternal_infos` `c` on
                `a`.`id` = `c`.`study_id`
            join `avyantra_dev`.`patient_baby_appears_infos` `d` on
                `a`.`id` = `d`.`study_id`
            join `avyantra_dev`.`patient_baby_resp_infos` `e` on
                `a`.`id` = `e`.`study_id`
                and `d`.`reading` = `e`.`reading`
            join `avyantra_dev`.`patient_baby_cv_infos` `f` on
                `a`.`id` = `f`.`study_id`
                and `d`.`reading` = `f`.`reading`
            join `avyantra_dev`.`patient_baby_cns_infos` `g` on
                `a`.`id` = `g`.`study_id`
                and `d`.`reading` = `g`.`reading`
            join `avyantra_dev`.`patient_baby_git_infos` `h` on
                `a`.`id` = `h`.`study_id`
                and `d`.`reading` = `h`.`reading`
            join `avyantra_dev`.`patient_baby_investigations` `i` on
                `a`.`id` = `i`.`study_id`
                and `d`.`reading` = `i`.`reading`
            where
                (`a`.`deleted_flag` = 0 or `a`.`deleted_flag` is null) 
                and `a`.`id` not in ('727', '484', '621', '701', '1')
                and `a`.hospital_type = 7
                and `a`.id = {0}
            order by
                `a`.`hospital_name`,
                `a`.`hospital_branch_name`,
                `a`.`baby_medical_record_number`,
                `d`.`createdAt`;
            """
