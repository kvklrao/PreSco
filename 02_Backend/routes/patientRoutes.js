const express = require('express')
const patientValidation = require('../validation/patientValidation')
const patientController = require('../controllers/patientController')

const prouter = express.Router()

prouter.put('/update/babyProfile/:studyId/:sUserId',patientController.updateBabyProfileByStudyId)

prouter.put('/update/motherProfile/:studyId/:sUserId',patientController.updateMotherProfileByStudyId)

prouter.put('/update/babyHealthParameters/:studyId/:sUserId',patientController.updatebabyHealthParameters)

prouter.post('/models/save/:sUserId',patientController.savePatientModels)

//prouter.post('/models/save/:sUserId',patientValidation.validate('savePatientModels'),patientController.savePatientModels)

prouter.get('/readingId/:study_id',patientController.getReadingIdByStudyId)

prouter.get('/search/:id/:hospitalId/:hospitalBranchId' , patientController.searchReadingIdByStudyIdAndMrn)

prouter.get('/models/:studyId',patientController.getPatientModels)

prouter.get('/baby_appears/:studyId/:hospitalId/:pageNo/:readingId', patientController.getBabyAppearsModel)

prouter.get('/baby_resp/:studyId/:hospitalId/:pageNo/:readingId',patientController.getBabyRespModel)

prouter.get('/baby_cv/:studyId/:hospitalId/:pageNo/:readingId',patientController.getBabyCVModel)

prouter.get('/baby_cns/:studyId/:hospitalId/:pageNo/:readingId',patientController.getBabyCNSModel)

prouter.get('/baby_git/:studyId/:hospitalId/:pageNo/:readingId',patientController.getBabyGITModel)

prouter.get('/baby_investigation/:studyId/:hospitalId/:pageNo/:readingId',patientController.getBabyInvestigationModel)

prouter.get('/baby_antibiotic/:studyId/:hospitalId/:pageNo/:readingId',patientController.getBabyAntibioticModel)

prouter.get('/baby_final/:studyId/:hospitalId/:pageNo/:readingId',patientController.getBabyFinalModel)

prouter.put('/update/baby_appears/:study_id/:reading/:sUserId',patientValidation.validate('updateBabyAppearsModel') ,patientController.updateBabyAppearsModel)

prouter.put('/update/baby_resp/:study_id/:reading/:sUserId', patientValidation.validate('updateBabyRespModel'),patientController.updateBabyRespModel)

prouter.put('/update/baby_cv/:study_id/:reading/:sUserId',patientValidation.validate('updateBabyCVModel'), patientController.updateBabyCVModel)

prouter.put('/update/baby_cns/:study_id/:reading/:sUserId',patientValidation.validate('updateBabyCNSModel'),patientController.updateBabyCNSModel)

prouter.put('/update/baby_git/:study_id/:reading/:sUserId',patientValidation.validate('updateBabyGITModel'),patientController.updateBabyGITModel)

prouter.put('/update/baby_investigation/:study_id/:reading/:sUserId',patientValidation.validate('updateBabyInvestigationModel') ,patientController.updateBabyInvestigationModel)

prouter.put('/update/baby_antibiotic/:study_id/:reading/:sUserId',patientValidation.validate('updateBabyAntibioticModel'), patientController.updateBabyAntibioticModel)

prouter.put('/update/baby_final/:study_id/:reading/:sUserId',patientValidation.validate('updateBabyFinalModel'),patientController.updateBabyFinalModel)

prouter.get('/generateReport',patientController.generateReport)

prouter.post('/medicalRecord/:hospitalId/:hospitalBranchId',patientController.saveBabyMedicalRecord)

prouter.get('/medicalRecord/:hospitalId/:hospitalBranchId/:staffId/:start/:end/:isStaff',patientController.getBabyMedicalRecord)

prouter.put('/medicalRecord/:studyId/:patientId/:hospitalId/:hospitalBranchId/:userID',patientController.updateBabyMedicalRecord)

prouter.get('/medicalRecordCount/:hospitalId/:hospitalBranchId/:staffId/:isStaff',patientController.babyMedicalRecordCount)

prouter.get('/downloadReport/:studyId',patientController.scoreGeneratedReport)

prouter.get('/getScore/:bmrn/:reading',patientController.getGeneratedScrore)

prouter.post('/create',patientController.createPatient)

prouter.get('/aashaBaby/:hospitalId/:start/:end',patientController.getAashaBaby)

prouter.get('/aashaBabyCount/:hospitalId',patientController.getAashaBabyCount)

//reports
prouter.post('/addReport/:study_id',patientController.addReport);
prouter.get('/getReports/:study_id',patientController.getReports);
prouter.delete('/deleteReport/:report_name',patientController.deleteReport);

//referral doctors list 
prouter.get('/referralDoctorsList',patientController.referralDoctorsList);

module.exports= prouter
