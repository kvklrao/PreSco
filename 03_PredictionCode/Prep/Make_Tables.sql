drop table if exists avyantra_dev.sepsis_score_full_params;

create table avyantra_dev.sepsis_score_full_params
as 
                select
                    `a`.`id` AS `id`,
                    `a`.`hospital_name` AS `hospital_name`,
                    `a`.`baby_medical_record_number` AS `baby_medical_record_number`,
                    `d`.`reading` AS `reading`,
                    000.0000 as sepsis_score
                from
                    `avyantra_dev`.`patient_basic_infos` `a`
                join `avyantra_dev`.`patient_baby_appears_infos` `d` on
                    `a`.`id` = `d`.`study_id`
                where
                    `a`.`deleted_flag` = 0
                    and `a`.`id` not in ('727', '621', '701')
                order by
                    `a`.`hospital_name`,
                    `a`.`hospital_branch_name`,
                    `a`.`baby_medical_record_number`,
                    `d`.`createdAt`;


create unique index idx_baby_study on avyantra_dev.sepsis_score_full_params (baby_medical_record_number, id, reading);


drop table if exists avyantra_dev.sepsis_score_asha;

create table avyantra_dev.sepsis_score_asha
as 
                select
                    `a`.`id` AS `id`,
                    `a`.`hospital_name` AS `hospital_name`,
                    `a`.`baby_medical_record_number` AS `baby_medical_record_number`,
                    000.0000 as sepsis_score
                from
                    `avyantra_dev`.`patient_basic_infos` `a`
                where
                    (`a`.`deleted_flag` = 0 or `a`.`deleted_flag` is null)
                    and `a`.hospital_type = 7
                    and `a`.`id` not in ('727', '621', '701')
                order by
                    `a`.`hospital_name`,
                    `a`.`hospital_branch_name`,
                    `a`.`baby_medical_record_number`;


create unique index idx_baby_study on avyantra_dev.sepsis_score_asha (baby_medical_record_number, id);