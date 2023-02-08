const constData = require('../helper/constant')
const server = require('../server')
const D3Node = require('d3-node')
var xl = require('excel4node');

exports.getStaffPermission =(permissionId,result,permissionResult) =>{
console.log ('permissionResult :' ,permissionResult) 

    switch(permissionId){
        case 1 :result.dataEntry_review_permission=permissionResult.active_flag
                return result
        break
        case 2 :result.scoreGenerate=permissionResult.active_flag
                return result
        break
    }
}


exports.getStaffPermissionId =(permission) =>{

    console.log("permission :",permission )

    switch(permission){
        case dataEntry_review_permission :
                return 1
        break
        case scoreGenerate :
                return 2
        break
    }
}

exports.getRefferalInitiationStatusId =(status) =>{

    switch(status){
        case 'Request Initiation' :
                return 1
        break
        case 'Pending Initiation' :
                return 2
        break
        case 'Accept Initiation' :
                return 3
        break
        case 'Active' :
            return 4
        break
    }
}

exports.getRequesterType =(type) =>{

    switch(type){
        case 'Referral Doctor' :
                return 5
        break
        case 'Hospital' :
                return 2
        break
    }
}

exports.generatePasscode =()=>{
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < 8; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
 }

exports.portDecider = ()=>{
    var be_port = server.port
    var fe_port;
    switch (be_port) {
        case 8080:
            fe_port = ":"+4200
            break;
        case 8081:
            fe_port = ''
            break;
        case 8082:
            fe_port = ":"+4300
            break;
    }
    return fe_port;
}

/**@Color_decider_according_to_score_range */
exports.colRanger = (score) => {
    if (score <= 50) {
        if (score > 30) {
            if (score > 30 && score <= 40)
                return '#aeaeae';
            else
                return '#9d9d9d';
        } else {
            if (score > 0 && score <= 10)
                return '#ededed';
            if (score > 10 && score <= 20)
                return '#dadada';
            else
                return '#c3c3c3';
        }
    } else {
        if (score > 80) {
            if (score > 80 && score <= 90)
                return '#b96565';
            else
                return '#ff5050';
        } else {
            if (score > 50 && score <= 60)
                return '#877878';
            if (score > 60 && score <= 70)
                return '#705f5f';
            else
                return '#8a5757';
        }
    }
}

/**@SVG_Creater */
exports.getSvg = (circCol, tWidth, score, fontSize) => {
    const d3n = new D3Node()
    var fontCol = (score <= 30) ? '#000000' : '#ffffff';
    var g = d3n.createSVG(tWidth, tWidth).append('g')
    g.append('rect').attr('width', tWidth).attr('height', 500).attr('fill', '#ffffff');
    g.append('circle').attr('r', tWidth / 2 - 50).attr('cx', tWidth / 2).attr('cy', tWidth / 2).attr('fill', circCol)
        .attr('stroke', '#cfcfcf').attr('stroke-width', '5');
    g.append('text').text(score + '%').attr('x', tWidth / 2).attr('y', tWidth / 2)
        .attr('fill', fontCol).attr('text-anchor', 'middle').attr('font-size', fontSize);
    return d3n.svgString()
}

/**@Excel_Creater */
exports.getExcel = (colShift, rowShift, buffer, score, result, mResult) => {
    /**@change_sequences_only_in_headers */
    var headers = [
        { header: 'Study Id', key: 'study_id' },
        { header: 'Hospital Name', key: 'hospital_name' },
        { header: 'Hospital Branch Name', key: 'hospital_branch_name' },
        { header: 'Baby Medical Record Number', key: 'baby_medical_record_number' },
        { header: 'Baby Mother Medical Record Number', key: 'baby_mother_medical_record_number' },
        { header: 'Type of Record', key: 'record_type' },
        { header: 'Baby Admission Type', key: 'baby_admission_type' },
        { header: 'Baby Birth Date', key: 'baby_birth_date' },
        { header: 'Baby Birth Time Hours', key: 'baby_birth_time_hours' },
        { header: 'Baby Birth Time Minute', key: 'baby_birth_time_minit' },
        { header: 'Baby Place Of Birth Pin Code', key: 'baby_place_of_birth_pin_code' },
        { header: 'Baby Place of Birth Name', key: 'baby_place_of_birth_name' },
        { header: 'Baby Age at Admission', key: 'baby_age_of_admission' },
        { header: 'Baby Gender', key: 'baby_gender' },
        { header: 'Place of Delievery ', key: 'place_of_delivery' },
        { header: 'Baby Apgar Score One Min', key: 'baby_apgar_score_one_min' },
        { header: 'Baby Apgar Score Five Min', key: 'baby_apgar_score_five_min' },
        { header: 'Baby Apgar Score Ten Min', key: 'baby_apgar_score_ten_min' },
        { header: 'Baby Preterm', key: 'baby_preterm' },
        { header: 'Diagnosis (EOS/LOS/NA)', key: 'baby_condition_yes_eos_los' },
        { header: 'Diagnosis (RDS)', key: 'baby_condition_rds_yes_no' },
        { header: 'Diagnosis (Jaundice)', key: 'baby_condition_jaundice_suspect' },
        { header: 'Diagnosis (TTNB)', key: 'baby_condition_ttnb_suspect' },
        { header: 'Diagnosis (LGA)', key: 'baby_condition_lga_suspect' },
        { header: 'Diagnosis (AGA)', key: 'baby_condition_aga_suspect' },
        { header: 'Diagnosis (SGA)', key: 'baby_condition_sga_suspect' },
        { header: 'Diagnosis (Shock)', key: 'baby_shock_aga_suspect' },
        { header: 'Diagnosis (Dextrocardia)', key: 'baby_condition_dextrocordia_suspect' },
        { header: 'Diagnosis (Anemia)', key: 'baby_condition_anemia_suspect' },
        { header: 'Diagnosis (LBW)', key: 'baby_condition_lbw_suspect' },
        { header: 'Birth Facility', key: 'birth_facility' },
        { header: 'Baby Gestational Age', key: 'baby_gestational_age' },
        { header: 'Baby Gestational Age Unit', key: 'baby_gestational_age_unit' },
        { header: 'Baby Weight At Birth', key: 'baby_weight_at_birth' },
        { header: 'Baby Weight At Birth Unit', key: 'baby_weight_at_birth_unit' },
        { header: 'Baby Condition Suspect', key: 'baby_condition_suspect' },
        { header: 'Baby Day Of Event', key: 'baby_day_of_event' },
        { header: 'Baby Weight At Admission', key: 'baby_weight_at_admission' },
        { header: 'Baby Weight At Admission Unit', key: 'baby_weight_at_admission_unit' },
        { header: 'Baby Condition Other If Suspect', key: 'baby_condition_other_if_suspect' },
        { header: 'Baby Diagnosis Perinatal', key: 'prelim_diagnosis_perinatal' },
        { header: 'Prelim Diagnosis Hypoglycemia', key: 'prelim_diagnosis_hypoglycemia' },
        { header: 'Prelim Diagnosis Hypocalcemia ', key: 'prelim_diagnosis_hypocalcemia' },
        { header: 'Prelim Diagnosis Feeding Intolerence', key: 'prelim_diagnosis_feeding_intolerence' },
        { header: 'Prelim Diagnosis Gastroenteritis', key: 'prelim_diagnosis_gastroenteritis' },
        { header: 'Baby Date Of Admission', key: 'baby_date_of_admission' },
        { header: 'Mother Age', key: 'mother_age' },
        { header: 'Mother Weight', key: 'mother_weight' },
        { header: 'Mother Weight Unit', key: 'mother_weight_unit' },
        { header: 'Mother Height', key: 'mother_height' },
        { header: 'Mother Height Unit', key: 'mother_height_unit' },
        { header: 'Mother Haemoglobin', key: 'mother_haemoglobin' },
        { header: 'Mother Bmi', key: 'mother_bmi' },
        { header: 'Maternal Blood Pressure', key: 'maternal_blood_pressure' },
        { header: 'Maternal Blood Pressure Diastolic', key: 'maternal_blood_pressure_diastolic' },
        { header: 'Maternal Diabetes', key: 'maternal_diabetes' },
        { header: 'Maternal Fever', key: 'maternal_fever' },
        { header: 'Maternal Fever Unit', key: 'maternal_fever_unit' },
        { header: 'Maternal Fever Basic', key: 'maternal_fever_basic' },
        { header: 'Maternal Thyroid Function', key: 'maternal_thyroid_function' },
        { header: 'Maternal Thyroid Function Basic', key: 'maternal_thyroid_function_basic' },
        { header: 'Maternal Thyroid Function Unit Basic', key: 'maternal_thyroid_function_unit_basic' },
        { header: 'Maternal Thyroid Function Unit Basic Unit', key: 'maternal_thyroid_function_unit_basic_unit' },
        { header: 'More Than Vaginal Examinations During Labor', key: 'more_than_3_vaginal_examinations_during_labor' },
        { header: 'Rupture Of Membranes Rom', key: 'rupture_of_membranes_rom' },
        { header: 'Rupture Of Membranes Rom One', key: 'rupture_of_membranes_rom_one' },
        { header: 'Rupture Of Membranes Rom Two', key: 'rupture_of_membranes_rom_two' },
        { header: 'Leaking pv', key: 'leaking_pv' },
        { header: 'Smelly Amniotic Fluid', key: 'smelly_amniotic_fluid' },
        { header: 'Chorioamnionitis', key: 'chorioamnionitis' },
        { header: 'Gbs Infection', key: 'gbs_infection' },
        { header: 'Colonisation Or Urinary Tract Infection', key: 'colonisation_or_urinary_tract_infection' },
        { header: 'Torch Infections', key: 'torch_infections' },
        { header: 'Type Of Delivery', key: 'type_of_delivery' },
        { header: 'Delayed Cord Clamping', key: 'delayed_cord_clamping' },
        { header: 'Vaginal Swab Culture Two', key: 'vaginal_swab_culture_two' },
        { header: 'Vaginal Swab Culture Three', key: 'vaginal_swab_culture_three' },
        { header: 'Amniotic Fluid Culture', key: 'amniotic_fluid_culture' },
        { header: 'Amniotic Fluid Culture Two', key: 'amniotic_fluid_culture_two' },
        { header: 'Amniotic Fluid Culture Three', key: 'amniotic_fluid_culture_three' },
        { header: 'Vaginal Swab Culture', key: 'vaginal_swab_culture' },
        { header: 'Baby Appearance', key: 'baby_appearance' },
        { header: 'Baby Skin Colour', key: 'baby_skin_colour' },
        { header: 'Baby Cry Sound', key: 'baby_cry_sound' },
        { header: 'Baby Cry Sound Status', key: 'baby_cry_sound_status' },
        { header: 'Hypotonia Muscular Response One Min After Birth', key: 'hypotonia_muscular_response_one_min_after_birth' },
        { header: 'Hypotonia Muscular Response Five Min After Birth', key: 'hypotonia_muscular_response_five_min_after_birth' },
        { header: 'Excessive Sleeping', key: 'excessive_sleeping' },
        { header: 'Hypothermia', key: 'hypothermia' },
        { header: 'Hypothermia Status Value', key: 'hypothermia_status_value' },
        { header: 'Baby Feeding Status', key: 'baby_feeding_status' },
        { header: 'Baby Jaundice', key: 'baby_jaundice' },
        { header: 'Breast Feeding Initiation', key: 'breast_feeding_initiation' },
        { header: 'Kangaroo Mother Care', key: 'kangaroo_mother_care' },
        { header: 'Umbilical Discharge', key: 'umbilical_discharge' },
        { header: 'Hypothermia Status', key: 'hypothermia_status' },
        { header: 'Groaning', key: 'groaning' },
        { header: 'Grunting', key: 'grunting' },
        { header: 'Stridor', key: 'stridor' },
        { header: 'Retraction', key: 'retraction' },
        { header: 'Fast Breathing', key: 'fast_breathing' },
        { header: 'Oxygen Saturation', key: 'oxygen_saturation' },
        { header: 'Breathing Rate', key: 'breathing_rate' },
        { header: 'Baby Chest Indrawing', key: 'baby_chest_indrawing' },
        { header: 'Xray Status Done', key: 'x_ray_status_done' },
        { header: 'Xray Result', key: 'x_ray_result' },
        { header: 'Xray Diagnosis Any Other', key: 'x_ray_diagnosis_any_other' },
        { header: 'Apnea Status', key: 'apnea_status' },
        { header: 'Apnea Diagnosis', key: 'apnea_diagnosis' },
        { header: 'Baby Respiratory Support', key: 'baby_respiratory_support' },
        { header: 'Baby Respiratory Support If Yes', key: 'baby_respiratory_support_if_yes' },
        { header: 'Heart Rate', key: 'heart_rate' },
        { header: 'Urine Output', key: 'urine_output' },
        { header: 'Baby Blood Pressure Mean Arterial Bp', key: 'baby_blood_pressure_mean_arterial_bp' },
        { header: 'Baby Blood Pressure Upper Limb', key: 'baby_blood_pressure_upper_limb' },
        { header: 'Baby Blood Pressure Lower Limb', key: 'baby_blood_pressure_lower_limb' },
        { header: 'Capillary Refill Unit', key: 'capillary_refill_unit' },
        { header: 'Low Peripheral Pulse Volume', key: 'low_peripheral_pulse_volume' },
        { header: 'Cool Peripheries', key: 'cool_peripheries' },
        { header: 'Two Echo Done', key: 'two_d_echo_done' },
        { header: 'Two Echo Done If Yes', key: 'two_d_echo_done_if_yes' },
        { header: 'Baby On Ionotropes', key: 'baby_on_ionotropes' },
        { header: 'Central Line', key: 'central_line' },
        { header: 'Skin Pustules', key: 'skin_pustules' },
        { header: 'Infusion Of Blood Products', key: 'infusion_of_blood_products' },
        { header: 'Features Of Encephalopathy', key: 'features_of_encephalopathy' },
        { header: 'Seizures', key: 'seizures' },
        { header: 'Abnormal Movements Like Tonic Posturing', key: 'abnormal_movements_like_tonic_posturing' },
        { header: 'Af Bulge', key: 'af_bulge' },
        { header: 'Abdominal Dystension', key: 'abdominal_dystension' },
        { header: 'Frequency Of Stools', key: 'frequency_of_stools' },
        { header: 'Diarrhea', key: 'diarrhea' },
        { header: 'Vomiting', key: 'vomiting' },
        { header: 'Feeding Intolerance', key: 'feeding_intolerance' },
        { header: 'Baby Movement', key: 'baby_movement' },
        { header: 'Baby Thyroid Status', key: 'baby_thyroid_status' },
        { header: 'Baby Thyroid Result', key: 'baby_thyroid_result' },
        { header: 'Baby Blood Glucose', key: 'baby_blood_glucose' },
        { header: 'Baby Haemoglobin Levels', key: 'baby_haemoglobin_levels' },
        { header: 'Baby Reactive Protien Levels', key: 'baby_c_reactive_protien_levels' },
        { header: 'Micro Esr', key: 'micro_esr' },
        { header: 'Baby Procalcitonin Levels', key: 'baby_procalcitonin_levels' },
        { header: 'Total Leucocute Count', key: 'total_leucocute_count' },
        { header: 'Total Leucocute Count Unit', key: 'total_leucocute_count_unit' },
        { header: 'Absolute Neutrophil Count', key: 'absolute_neutrophil_count' },
        { header: 'Absolute Neutrophil Count Unit', key: 'absolute_neutrophil_count_unit' },
        { header: 'Immature To Mature Neutrophil Ratios', key: 'immature_to_mature_neutrophil_ratios' },
        { header: 'Thrombocytopeni', key: 'thrombocytopenia' },
        { header: 'Thrombocytopenia_unit', key: 'thrombocytopenia_unit' },
        { header: 'Urine Rest For Pus Cells', key: 'urine_rest_for_pus_cells' },
        { header: 'Urine Culture Test', key: 'urine_culture_test' },
        { header: 'Blood Culture Report', key: 'blood_culture_report' },
        { header: 'Gram Positive Bacteria', key: 'gram_positive_bacteria' },
        { header: 'Gram Negative Bacteria', key: 'gram_negative_bacteria' },
        { header: 'Gram Positive Bacteria If Other', key: 'gram_positive_bacteria_if_other' },
        { header: 'Gram Negative Bacteria If Other', key: 'gram_negative_bacteria_if_other' },
        { header: 'Fungi', key: 'fungi' },
        { header: 'Other Organism', key: 'other_organism' },
        { header: 'Sodium', key: 'sodium' },
        { header: 'Potassium', key: 'potassium' },
        { header: 'Chlorine', key: 'chlorine' },
        { header: 'Calcium', key: 'calcium' },
        { header: 'Phosphate', key: 'phosphate' },
        { header: 'Magnesium', key: 'magnesium' },
        { header: 'Urea', key: 'urea' },
        { header: 'Creatinine', key: 'creatinine' },
        { header: 'Lactate Levels', key: 'lactate_levels' },
        { header: 'Bilirubin Levels', key: 'bilirubin_levels' },
        { header: 'Cord Ph', key: 'cord_ph' },
        { header: 'Arrhythmia', key: 'arrhythmia' },
        { header: 'Csf Culture', key: 'csf_culture' },
        { header: 'Csf Culture Tsb Value', key: 'csf_culture_tsb_value' },
        { header: 'Antibiotic Status Value', key: 'antibiotic_status_value' },
        { header: 'Antibiotic Given', key: 'antibiotic_given' },
        { header: 'Date Of Administration Of Antiobiotic', key: 'date_of_administration_of_antiobiotic' },
        { header: 'Time Of Administration Of Antiobiotic Hours', key: 'time_of_administration_of_antiobiotic_hours' },
        { header: 'Time Of Administration Of Antiobiotic Minute', key: 'time_of_administration_of_antiobiotic_minute' },
        { header: 'Antibiotic Name', key: 'antibiotic_name' },
        { header: 'Antibiotic Name If Other', key: 'antibiotic_name_if_other' },
        { header: 'Grade Of Antibiotic', key: 'grade_of_antibiotic' },
        { header: 'Date Of Blood Samples Sent For Culture Test', key: 'date_of_blood_samples_sent_for_culture_test' },
        { header: 'Time Of Blood Samples Sent For Culture Test Hours', key: 'time_of_blood_samples_sent_for_culture_test_hours' },
        { header: 'Time Of Blood Samples Sent For Culture Test Minute', key: 'time_of_blood_samples_sent_for_culture_test_minute' },
        { header: 'Blood Sample Taken Prior To Antiobiotic Administration', key: 'blood_sample_taken_prior_to_antiobiotic_administration' },
        { header: 'Days Of Stay In Hospital', key: 'days_of_stay_in_hospital' },
        { header: 'Final Diagnosis Sepsis', key: 'final_diagnosis_sepsis' },
        { header: 'Final Diagnosis Rds', key: 'final_diagnosis_rds' },
        { header: 'Final Diagnosis Ttnb', key: 'final_diagnosis_ttnb' },
        { header: 'Final Diagnosis Jaundice', key: 'final_diagnosis_jaundice' },
        { header: 'Final Diagnosis Lbw', key: 'final_diagnosis_lbw' },
        { header: 'Final Diagnosis Lga', key: 'final_diagnosis_lga' },
        { header: 'Final Diagnosis Aga', key: 'final_diagnosis_aga' },
        { header: 'Final Diagnosis Sga', key: 'final_diagnosis_sga' },
        { header: 'Final Diagnosis Anemia', key: 'final_diagnosis_anemia' },
        { header: 'Final Diagnosis Dextochordia', key: 'final_diagnosis_dextochordia' },
        { header: 'Final Diagnosis Hypoglycemia', key: 'final_diagnosis_hypoglycemia' },
        { header: 'Final Diagnosis Hypocalcemia', key: 'final_diagnosis_hypocalcemia' },
        { header: 'Final Diagnosis Gastroenteritis', key: 'final_diagnosis_gastroenteritis' },
        { header: 'Final Diagnosis Perinatal Respiratory Depression', key: 'final_diagnosis_perinatal_respiratory_depression' },
        { header: 'Final Diagnosis Shock', key: 'final_diagnosis_shock' },
        { header: 'Final Diagnosis Feeding Intolerence', key: 'final_diagnosis_feeding_intolerence' },
        { header: 'Baby Discharge Date', key: 'baby_discharge_date' },
        { header: 'Antibiotic Status Resisitant', key: 'antibiotic_status_resisitant' },
        { header: 'Antibiotic Status Intermediate', key: 'antibiotic_status_intermediate' },
        { header: 'Final Diagnosis Eos Los', key: 'final_diagnosis_eos_los' },
        { header: 'Final Diagnosis Other', key: 'final_diagnosis_other' },
        { header: 'Reading', key: 'reading' },
        { header: 'Reading Date', key: 'reading_date' },
        { header: 'Reading Time', key: 'reading_time' },
        { header: 'Date of entry', key: 'createdAt' },
        { header: 'Score', key: 'score' },
        { header: 'Accuracy', key: 'accuracy' },
        { header: 'Sensitivity', key: 'sensitivity' },
        { header: 'Specificity', key: 'specificity' },
    ]
    var wb = new xl.Workbook();
    var ws = wb.addWorksheet('Readings');
    var ws2 = wb.addWorksheet('Score Chart');
    var lastReading;
    var sensitivity = mResult[0].Score * 100;
    var specificity = mResult[1].Score * 100;
    var accuracy = mResult[2].Score * 100;

    ws2.addImage({
        image: buffer,
        type: 'picture',
        position: {
            type: 'oneCellAnchor',
            from: {
                col: colShift,
                colOff: 0,
                row: rowShift,
                rowOff: 0,
            },
        },
    });

    var headingStyle = wb.createStyle({
        font: {
            bold: true,
            size: 12,
        }
    });
    ws.column(1).setWidth(52);
    var index = 0;
    while (index < headers.length) {
        ws.cell(index + 2, 1).string(headers[index].header).style(headingStyle)
        index += 1
    }

    for (var i = 0; i < result.length; i++) {
        result[i].score = score + '%';
        result[i].sensitivity = sensitivity + '%';
        result[i].specificity = specificity + '%';
        result[i].accuracy = accuracy + '%';
        if (i == result.length - 1) {
            lastReading = result[i].reading
        }
        if (result[i].time_of_reading_hours === 'NA') {
            result[i].time_of_reading_hours = '00'
        }
        if (result[i].time_of_reading_minute === 'NA') {
            result[i].time_of_reading_minute = '00'
        }
        result[i].reading_time = result[i].time_of_reading_hours + ":" + result[i].time_of_reading_minute
        ws.cell(1, i + 2).string(result[i].reading).style(headingStyle)
        ws.column(i + 2).setWidth(32);
        for (var j = 0; j < headers.length; j++) {
            var mKey = headers[j].key
            var data = result[i][mKey]
            if (mKey === 'createdAt') {
                var date = new Date(data)
                data = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
            }
            if (!data) {
                data = '-'
            }
            if (data) {
                if (data.toString().indexOf('itemName') != -1) {
                    data = JSON.parse(data)[0].itemName
                }
                ws.cell(j + 2, i + 2).string(data.toString())
            }
        }
    }

    var headStyleChart = wb.createStyle({
        font: {
            color: '#52a5ff',
            bold: true,
            size: 12,
        }
    });

    var h4StyleChart = wb.createStyle({
        fill: {
            type: 'pattern',
            patternType: 'solid',
            bgColor: '#52a5ff',
            fgColor: '#52a5ff',
        },
        font: {
            color: '#ffffff',
            size: 12,
        }
    });

    var sensitivityStyle = wb.createStyle({
        fill: {
            type: 'pattern',
            patternType: 'solid',
            bgColor: '#ff7474',
            fgColor: '#ff7474',
        }
    });

    var specificityStyle = wb.createStyle({
        fill: {
            type: 'pattern',
            patternType: 'solid',
            bgColor: '#3cde56',
            fgColor: '#3cde56',
        }
    });

    var accuracyStyle = wb.createStyle({
        fill: {
            type: 'pattern',
            patternType: 'solid',
            bgColor: '#ffbd0d',
            fgColor: '#ffbd0d',
        }
    });

    ws2.column(colShift - 2).setWidth(20);
    ws2.column(colShift - 1).setWidth(15);
    ws2.cell(rowShift + 1, colShift - 2).string('Score Information').style(headStyleChart)
    ws2.cell(rowShift + 3, colShift - 2).string('Score range').style(h4StyleChart)
    ws2.cell(rowShift + 4, colShift - 2).string('0-50')
    ws2.cell(rowShift + 5, colShift - 2).string('51-90')
    ws2.cell(rowShift + 6, colShift - 2).string('>90')
    ws2.cell(rowShift + 3, colShift - 1).string('Risk type').style(h4StyleChart)
    ws2.cell(rowShift + 4, colShift - 1).string('Low Risk')
    ws2.cell(rowShift + 5, colShift - 1).string('Medium Risk')
    ws2.cell(rowShift + 6, colShift - 1).string('High Risk')

    ws2.cell(rowShift + 8, colShift - 2).string('Reading ' + lastReading + ' analysis').style(headStyleChart)
    ws2.cell(rowShift + 10, colShift - 2).string('Sensitivity')
    ws2.cell(rowShift + 11, colShift - 2).string('Specificity')
    ws2.cell(rowShift + 12, colShift - 2).string('Accuracy')
    ws2.cell(rowShift + 10, colShift - 1).string(sensitivity + '%').style(sensitivityStyle)
    ws2.cell(rowShift + 11, colShift - 1).string(specificity + '%').style(specificityStyle)
    ws2.cell(rowShift + 12, colShift - 1).string(accuracy + '%').style(accuracyStyle)
    return wb
}
