const express = require('express')
const hospitalController = require('../controllers/hospitalController')
const hrouter = express.Router()

//hrouter.post('/signUp', hospitalController.hospitalSignUp)
//hrouter.post('/signUp/aasha', hospitalController.aashaHospitalSignUp)

hrouter.post('/role/:hospitalId',hospitalController.addRole)

hrouter.get('/hospitalProfile/:hospitalId',hospitalController.getHospitalProfile)

// hrouter.put('/updateHospitalProfile/:hospitalId',hospitalController.updateHospitalProfile)

hrouter.get('/getRegisteredRefferal/:hospitalId/:start/:end',hospitalController.getRegisteredRefferal)

hrouter.get('/getRefferalCount/:hospitalId',hospitalController.getRefferalCount)

hrouter.post('/sendMessage/:hUserId/:sUserId',hospitalController.sendMsgfrmHospToStaff)

hrouter.get('/getMessage/:senderId/:receiverId',hospitalController.getMessage)

hrouter.get('/getStaffAdmin/:staffId',hospitalController.getStaffAdmin)

hrouter.get('/getReferralAdmin/:referralId',hospitalController.getReferralAdmin)

hrouter.put('/markMessageRead/:rUserId/:sUserId',hospitalController.updateIsReadFlag)

hrouter.get('/registerRefferalCount',hospitalController.getRegisterRefferalCount)

hrouter.get('/getDashBoardDetail/:hospitalId',hospitalController.getDashBoardDetail)

hrouter.get('/getAllReferralDoctors/:staffId',hospitalController.getAllReferralDoctors)

hrouter.get('/statelist',hospitalController.getStateList)

module.exports=hrouter
