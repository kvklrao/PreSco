const express = require('express')
const hospitalStaffController = require('../controllers/hospitalStaffController')
const hsrouter = express.Router()

hsrouter.get('/roles/:hospitalId', hospitalStaffController.getHospitalStaffRoles)

hsrouter.get('/specialities/:hospitalId', hospitalStaffController.getHospitalStaffSpecialities)

hsrouter.get('/branches/:hospitalId', hospitalStaffController.getHospitalBranchesByHospitalId)

//hsrouter.post('/addStaff/:hospitalId/:hospitalBranchId',hospitalStaffController.addStaff)

hsrouter.get('/getStaff/:hospitalId/:hospitalBranchId/:start/:end/:hospitalStaffFlag',hospitalStaffController.getStaffs)

// hsrouter.get('/getStaff/:hospitalId/:hospitalBranchId/:start/:end',hospitalStaffController.getStaffs)

hsrouter.get('/staffProfile/:staffId',hospitalStaffController.getStaffProfile)

//hsrouter.put('/updateStaffProfile/:staffId',hospitalStaffController.updateStaffProfile)
//hsrouter.get('/getStaffCount/:hospitalId/:hospitalBranchId',hospitalStaffController.getStaffCount)

hsrouter.get('/getStaffCount/:hospitalId/:hospitalBranchId/:hospitalStaffFlag',hospitalStaffController.getStaffCount)

//hsrouter.put('/updateStaff/:hospitalId/:hospitalBranchId/:staffId',hospitalStaffController.updateStaff)

hsrouter.put('/update/staffPermission/:hospitalId/:hospitalBranchId',hospitalStaffController.updateStaffPermission)

hsrouter.post('/addReferralDoctor/:hospitalId/:hospitalBranchId',hospitalStaffController.addReferralDoctor)

//hsrouter.post('/registerReferralDoctor',hospitalStaffController.registerReferralDoctor)

hsrouter.get('/ReferralDoctor/:hospitalId/:hospitalBranchId/:start/:end',hospitalStaffController.getReferralDoctor)

hsrouter.get('/ReferralDoctorCount/:hospitalId/:hospitalBranchId',hospitalStaffController.getReferralDoctorCount)

hsrouter.get('/getReferralProfile/:referralId',hospitalStaffController.getReferralProfile)

hsrouter.put('/updateReferralProfile/:referralId',hospitalStaffController.updateReferralProfile)

hsrouter.get('/getReferralHospital/:referralId/:start/:end',hospitalStaffController.getReferralHospital)

hsrouter.get('/getReferralHospitalCount',hospitalStaffController.getReferralHospitalCount)

hsrouter.put('/updateStatus/:hospitalId/:referralId',hospitalStaffController.updateRefferalInitiationStatus)

hsrouter.get('/getStaff/:userId',hospitalStaffController.getStaffForMessageCenter)

hsrouter.get('/getReferralStaff/:userId',hospitalStaffController.getRefferalStaff)

hsrouter.get('/referralStaff/:referralId',hospitalStaffController.getReferralConnectedStaff)

hsrouter.get('/staff/:staffId',hospitalStaffController.getConnectedStaff)

hsrouter.get('/staffReferral/:staffId',hospitalStaffController.getStaffReferral)

hsrouter.get('/getBranchStaff/:hospitalBranchId',hospitalStaffController.getBranchStaff)

hsrouter.get('/getRefferalSpeciality',hospitalStaffController.getRefferalSpeciality)

hsrouter.get('/getDashBoardDetail/:staffId',hospitalStaffController.getDashBoardDetail)

hsrouter.get('/getReferralDashBoardDetail/:referralId',hospitalStaffController.getReferralDashBoardDetail)

hsrouter.get('/getStaffBranches/:staffId',hospitalStaffController.getStaffBranches)

hsrouter.get('/acceptRequest/:passcode',hospitalStaffController.acceptRequest)

hsrouter.post('/staffReferral/:staffId/:hospitalBranchId',hospitalStaffController.submitForReferralOpinion)

hsrouter.get('/getReferralDetail/:referralId/:start/:end',hospitalStaffController.getReferralDetail)

hsrouter.get('/referralDetailCount/:referralId',hospitalStaffController.getReferralDetailCount)

hsrouter.post('/sendOpinion/:staffReffHospId',hospitalStaffController.sendReferralOpinion)

hsrouter.get('/getReferralOpinion/:studyId',hospitalStaffController.getReferralOpinion)

hsrouter.get('/getAashaReferralOpinion/:studyId',hospitalStaffController.getAashaReferralOpinion)

hsrouter.post('/upload',hospitalStaffController.uploadFile)

hsrouter.get('/downloadFile/:fileId',hospitalStaffController.downloadFile)

hsrouter.get('/aasha/:studyId',hospitalStaffController.getAashaReadingInfo)

hsrouter.get('/getAashaReferral',hospitalStaffController.getAashaReferralDoctor)

hsrouter.get('/aashaReferralDetail/:referralId/:start/:end',hospitalStaffController.getAshaReferralDetail)

hsrouter.get('/aashaReferralDetailCount/:referralId',hospitalStaffController.getAshaReferralDetailCount)

module.exports= hsrouter


