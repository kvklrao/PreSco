const enumConst = require('../helper/enum')
module.exports= {

babyBasicProfileMapper :(result,req)=>{
     result.hospital_id= req.body.hospital_id,
     result. hospital_name= req.body.hospital_name ,
     result.hospital_branch_name= req.body.hospital_branch_name ,
     result.baby_medical_record_number= req.body.babyMedicalRecord,
     result. baby_mother_medical_record_number=req.body.babyMotherMedicalRecord,
     result.is_update=req.body.is_update
     return result
},

babyGeneralProfileMapper:(result,req)=>{
     result.record_type= req.body.record_type,
     result.baby_admission_type= req.body.baby_admission_type,
     result.baby_birth_date= req.body.baby_birth_date,
     result.study_id= req.body.study_id,
     result.baby_place_of_birth_pin_code= req.body.baby_place_of_birth_pin_code,
     result.baby_place_of_birth_name= req.body.baby_place_of_birth_name,
     result.baby_birth_time_hours= req.body.baby_birth_time_hours,
     result.baby_birth_time_minit= req.body.baby_birth_time_minit,
     result.baby_age_of_admission= req.body.baby_age_of_admission,
     result.baby_apgar_score_one_min= req.body.baby_apgar_score_one_min,
     result.baby_apgar_score_five_min= req.body.baby_apgar_score_five_min,
     result.baby_apgar_score_ten_min= req.body.baby_apgar_score_ten_min,
     result.baby_preterm= req.body.baby_preterm,
     result.baby_condition_yes_eos_los= req.body.baby_condition_yes_eos_los,
     result.baby_condition_rds_yes_no=req.body.baby_condition_rds_yes_no,
     result.baby_gender= req.body.baby_gender,
     result.baby_condition_jaundice_suspect= req.body.baby_condition_jaundice_suspect,
     result.baby_condition_ttnb_suspect= req.body.baby_condition_ttnb_suspect,
     result.baby_condition_lga_suspect= req.body.baby_condition_lga_suspect,
     result.baby_condition_aga_suspect= req.body.baby_condition_aga_suspect,
     result.baby_condition_sga_suspect= req.body.baby_condition_sga_suspect,
     result.baby_shock_aga_suspect= req.body.baby_shock_aga_suspect,
     result.baby_condition_dextrocordia_suspect= req.body.baby_condition_dextrocordia_suspect,
     result.baby_condition_anemia_suspect= req.body.baby_condition_anemia_suspect,
     result.baby_condition_lbw_suspect= req.body.baby_condition_lbw_suspect,
     result.place_of_delivery= req.body.place_of_delivery,
     result.birth_facility= req.body.birth_facility,
     result.baby_gestational_age= req.body.baby_gestational_age,
     result.baby_gestational_age_unit= req.body.baby_gestational_age_unit,
     result.baby_weight_at_birth= req.body.baby_weight_at_birth,
     result.baby_condition_suspect=req.body.baby_condition_suspect,
     result.baby_day_of_event= req.body.baby_day_of_event,
     result.baby_weight_at_admission= req.body.baby_weight_at_admission,
     result.baby_condition_other_if_suspect= req.body.baby_condition_other_if_suspect,
     result.prelim_diagnosis_perinatal=req.body.prelim_diagnosis_perinatal,
     result.prelim_diagnosis_hypoglycemia= req.body.prelim_diagnosis_hypoglycemia,
     result.prelim_diagnosis_hypocalcemia= req.body.prelim_diagnosis_hypocalcemia,
     result.prelim_diagnosis_feeding_intolerence= req.body.prelim_diagnosis_feeding_intolerence,
     result.prelim_diagnosis_gastroenteritis= req.body.prelim_diagnosis_gastroenteritis,
     result.baby_weight_at_admission_unit= req.body.baby_weight_at_admission_unit,
     result.baby_date_of_admission= req.body.baby_date_of_admission,
     result.meningitis= req.body.meningitis,

     result.umblical_sepsis=req.body.umblical_sepsis,
     result.skin_pustules=req.body.skin_pustules,
     result.seizures=req.body.seizures,
     result.bleeding_manifestation=req.body.bleeding_manifestation,
     result.central_peripheral=req.body.central_peripheral,
     result.asphyxia=req.body.asphyxia,
     result.pneumonia=req.body.pneumonia,
     result.peritonitis=req.body.peritonitis,
     result.coagulopathy=req.body.coagulopathy,
     result.soft_tissue_abscess=req.body.soft_tissue_abscess,
     result.endocarditis=req.body.endocarditis,
     result.pulmonary_hemorrhage=req.body.pulmonary_hemorrhage,
     result.thrombocytopenia=req.body.thrombocytopenia,
     result.uti=req.body.uti,

     result.septic_arthritis=req.body.septic_arthritis,
     result.hypoxia=req.body.hypoxia,
     result.metabolic_acidosis=req.body.metabolic_acidosis,
     result.rupture_time=req.body.rupture_time,
     result.baby_lga_sga_aga_suspect=req.body.baby_lga_sga_aga_suspect


     
     return result
},

babyMaternalProfileMapper:(result,req)=>{
     result.mother_age= req.body.mother_age,
     result.mother_weight_unit=req.body.mother_weight_unit ,
     result.mother_weight= req.body.mother_weight,
     result.mother_height=req.body.mother_height,
     result.mother_height_unit=req.body.mother_height_unit ,
     result.mother_haemoglobin=req.body.mother_haemoglobin,
     result.mother_bmi=req.body.mother_bmi ,
     result.maternal_blood_pressure=req.body.maternal_blood_pressure ,
     result.maternal_blood_pressure_diastolic=req.body.maternal_blood_pressure_diastolic,
     result.maternal_diabetes=req.body.maternal_diabetes ,
     result.maternal_fever= req.body.maternal_fever,
     result.maternal_fever_unit= req.body.maternal_fever_unit,
     result.maternal_fever_basic=req.body.maternal_fever_basic ,
     result.maternal_thyroid_function=req.body.maternal_thyroid_function ,
     result.maternal_thyroid_function_basic= req.body.maternal_thyroid_function_basic,
     result.maternal_thyroid_function_unit_basic= req.body.maternal_thyroid_function_unit_basic,
     result.maternal_thyroid_function_unit_basic_unit= req.body.maternal_thyroid_function_unit_basic_unit,
     result.more_than_3_vaginal_examinations_during_labor= req.body.more_than_3_vaginal_examinations_during_labor,
     result.rupture_of_membranes_rom_two= req.body.rupture_of_membranes_rom_two,
     result.rupture_of_membranes_rom_one= req.body.rupture_of_membranes_rom_one,
     result.rupture_of_membranes_rom= req.body.rupture_of_membranes_rom,
     result.leaking_pv= req.body.leaking_pv,
     result.smelly_amniotic_fluid= req.body.smelly_amniotic_fluid,
     result.chorioamnionitis=req.body.chorioamnionitis ,
     result.gbs_infection=req.body.gbs_infection ,
     result.colonisation_or_urinary_tract_infection=req.body.colonisation_or_urinary_tract_infection ,
     result.torch_infections= req.body.torch_infections,
     result.type_of_delivery= req.body.type_of_delivery ,
     result.delayed_cord_clamping= req.body.delayed_cord_clamping,
     result.vaginal_swab_culture= req.body.vaginal_swab_culture ,
     result.vaginal_swab_culture_two= req.body.vaginal_swab_culture_two,
     result.vaginal_swab_culture_three= req.body.vaginal_swab_culture_three ,
     result.amniotic_fluid_culture= req.body.amniotic_fluid_culture,
     result.amniotic_fluid_culture_three= req.body.amniotic_fluid_culture_three,
     result.amniotic_fluid_culture_two= req.body.amniotic_fluid_culture_two,
     result.maternal_fever_duration= req.body.maternal_fever_duration,
     result.pih= req.body.pih

     return result
},

babyAppearsMapper : (result , body)=>{
     result.baby_appearance= body.baby_appearance,
     result.baby_skin_colour= body.baby_skin_colour,
     result.baby_cry_sound= body.baby_cry_sound,
     result.baby_cry_sound_status= body.baby_cry_sound_status,
     result.hypotonia_muscular_response_one_min_after_birth= body.hypotonia_muscular_response_one_min_after_birth,
     result.hypotonia_muscular_response_five_min_after_birth= body.hypotonia_muscular_response_five_min_after_birth,
     result.excessive_sleeping = body.excessive_sleeping,
     result.hypothermia= body.hypothermia,
     result.hypothermia_status = body.hypothermia_status,
     result.hypothermia_status_value = body.hypothermia_status_value,
     result.baby_feeding_status = body.baby_feeding_status,
     result.baby_presence_of_convulsions= body.baby_presence_of_convulsions,
     result.baby_jaundice = body.baby_jaundice,
     result.breast_feeding_initiation = body.breast_feeding_initiation,
     result.kangaroo_mother_care = body.kangaroo_mother_care,
     result.umbilical_discharge = body.umbilical_discharge,
     result.reading_date = body.reading_date,
     result.baby_weight_at_birth = body.baby_weight_at_birth,
     result.baby_weight_at_birth_unit = body.baby_weight_at_birth_unit,
     result.time_of_reading_minute = body.time_of_reading_minute,
     result.time_of_reading_hours = body.time_of_reading_hours,
     result.umbilical_redness = body.umbilical_redness,
     result.umbilical_enduration = body.umbilical_enduration,
     result.skin_pustules = body.skin_pustules

     return result
},

userMapper : (user , req)=>{
     user.user_name=req.body.username,
     user.user_type_id=enumConst.userType.hospital,
     user.password=req.body.password,
     user.email_address=req.body.email,
     user.parent_user_id=enumConst.parentUserType.super_admin,
     user.created_by=enumConst.userType.super_admin,
     user.deleted_flag=0,
     user.active_flag=1
     return user
},

hospitalMapper : (hospital , req)=>{
     hospital.hospital_name=req.body.hospital_name ,
     hospital.created_by= enumConst.userType.hospital,
     hospital.deleted_flag= 0,
     hospital.active_flag=1
     return hospital
},

roleMapper : (roles , req)=>{
     roles.created_by=enumConst.userType.hospital ,
     roles. deleted_flag= 0,
     roles.active_flag= 1
     return roles
},

branchRoleMapper:(roles , result)=>{
     roles.created_by=enumConst.userType.hospital_branch,
     roles. deleted_flag= 0,
     roles.active_flag= 1,
     roles.user_id=result.user_id
     roles.role_id=enumConst.roles.hospital_admin
     return roles
},
hospBranchUserMapper : (branchUser , req)=>{
     branchUser.contact_number= req.body.contact_number
     branchUser.email_address= req.body.email
     branchUser.address=req.body.address
     branchUser.city= req.body.city
     branchUser.state= req.body.state
     branchUser.pincode= req.body.pin_code
     branchUser.user_name= req.body.user_name
     branchUser.password=req.body.password
     branchUser.user_type_id=enumConst.userType.hospital_branch
     branchUser.created_by=enumConst.userType.hospital
     branchUser.deleted_flag=0
     branchUser.active_flag=1
     branchUser.parent_user_id=enumConst.userType.hospital
     return branchUser
},
hospBranchMapper : (branch,result,req)=>{
     branch.branch_name= req.body.name
     branch.hospital_id = req.params.hospitalId
     branch.user_id=result.user_id
     branch.contact_person= req.body.contact_person
     branch.created_by=enumConst.userType.hospital
     branch.deleted_flag=0
     branch.active_flag=1
     return branch
},
hospitalBranchRoleMapper:(roles , req)=>{
     roles.created_by=enumConst.userType.hospital_branch,
     roles.updated_by=enumConst.userType.hospital_branch,
     roles.hospital_id=req.params.hospitalId
     roles.hospital_branch_id=req.params.hospitalBranchId
     roles.deleted_flag= 0,
     roles.active_flag= 1,
     roles.role=req.body.role
     return roles
},
hospitalBranchSpecialityMapper:(speciality , req)=>{
     speciality.created_by=enumConst.userType.hospital_branch,
     speciality.updated_by=enumConst.userType.hospital_branch,
     speciality.deleted_flag= 0,
     speciality.active_flag= 1,
     speciality.speciality=req.body.speciality
     return speciality
},
staffUserMapper : (staffUser , req)=>{
     staffUser.user_name=req.body.username,
     staffUser.user_type_id=enumConst.userType.hospital_staff,
     staffUser.password=req.body.password,
     staffUser.email_address=req.body.email,
     staffUser.contact_number=req.body.contactNumber,
     staffUser.parent_user_id=enumConst.userType.hospital_branch,
     staffUser.created_by=enumConst.userType.hospital_branch,
     staffUser.deleted_flag=0,
     staffUser.active_flag=1
     return staffUser
},
staff : (staff ,result, req,sResult)=>{
     staff.user_id=result.user_id,
     staff.hospital_branch_speciality_id=req.body.speciality,
     staff.hospital_branch_role_id=req.body.assignRole,
     staff.reporting_user_id=req.body.reportTo,
     staff.first_name=req.body.firstName,
     staff.last_name=req.body.lastName,
     staff.created_by=enumConst.userType.hospital_branch,
     staff.deleted_flag=0,
     staff.active_flag=1
     return staff
},
staffHospitalMapper : (staff ,result, req)=>{
     staff.hospital_id=req.params.hospitalId,
     staff.hospital_branch_id=req.body.branch,
     staff.staff_id=result.staff_id,
     staff.created_by=enumConst.userType.hospital_branch,
     staff.deleted_flag=0,
     staff.active_flag=1
     return staff
},
User :(user,req)=>{
     user.address =req.body.address
     user.city=req.body.city
     user.contact_number=req.body.contactNumber
     user.email_address=req.body.email
     user.pincode=req.body.pincode
     user.state=req.body.state
     user.user_type_id=enumConst.userType.referral_doctor
     user.created_by=enumConst.userType.hospital_branch
     user.deleted_flag=0
     user.active_flag=1
     user.parent_user_id=enumConst.userType.hospital_branch
     user.password=req.body.password
     user.user_name=req.body.userName
     return user
},
referralUserRegister :(user,req)=>{
     user.address =req.body.address
     user.city=req.body.city
     user.contact_number=req.body.contactNumber
     user.email_address=req.body.email
     user.pincode=req.body.pincode
     user.state=req.body.state
     user.user_type_id=enumConst.userType.referral_doctor
     user.created_by=enumConst.userType.referral_doctor
     user.deleted_flag=0
     user.active_flag=1
     user.parent_user_id=enumConst.userType.hospital_branch
     user.password=req.body.password
     user.user_name=req.body.userName
     return user
},
UnregisteredReferral :(referral,req ,result,passcode)=>{
     referral.user_id =result.user_id
     referral.hospital_branch_speciality_id=req.body.speciality
     referral.first_name=req.body.firstName
     referral.last_name=req.body.lastName
     referral.created_by=enumConst.userType.hospital_branch
     referral.deleted_flag=0
     referral.active_flag=1
     referral.referral_source=1
     return referral
},
RegisteredReferral :(referral,req ,result)=>{
     referral.user_id =result.user_id
     referral.hospital_branch_speciality_id=req.body.speciality
     referral.first_name=req.body.firstName
     referral.last_name=req.body.lastName
     referral.created_by=enumConst.userType.hospital_branch
     referral.deleted_flag=0
     referral.active_flag=1
     referral.referral_source=2
     referral.hospital_name=req.body.hospitalName
     return referral
},
ReferralHospital :(referralHospital,req,result)=>{
     referralHospital.hospital_id =req.params.hospitalId
     referralHospital.hospital_branch_id=req.params.hospitalBranchId
     referralHospital.referral_id=result.referral_id
     referralHospital.requester_type=enumConst.userType.hospital
     referralHospital.hospital_action_status=enumConst.action_status.pending_initiation
     referralHospital.referral_action_status=enumConst.action_status.accept_initiation
     referralHospital.created_by=enumConst.userType.hospital_branch
     referralHospital.deleted_flag=0
     referralHospital.active_flag=1
     return referralHospital
},
unRegisteredReferralHospital :(referralHospital,req,result,passcode)=>{
     referralHospital.hospital_id =req.params.hospitalId
     referralHospital.hospital_branch_id=req.params.hospitalBranchId
     referralHospital.referral_id=result.referral_id
     referralHospital.requester_type=enumConst.userType.hospital
     referralHospital.hospital_action_status=enumConst.action_status.pending_initiation
     referralHospital.referral_action_status=enumConst.action_status.request_initiation
     referralHospital.created_by=enumConst.userType.hospital_branch
     referralHospital.deleted_flag=0
     referralHospital.active_flag=1
     referralHospital.passcode=passcode
    // referralHospital.referral_source =enumConst.userType.hospital
     return referralHospital
}

}
