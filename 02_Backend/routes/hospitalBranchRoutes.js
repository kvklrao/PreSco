const express = require('express')
const hospitalBranchController = require('../controllers/hospitalBranchController')
const hbrouter = express.Router()

hbrouter.post('/register/:hospitalId', hospitalBranchController.registerHospitalBranch)

hbrouter.get('/branches/:hospitalId', hospitalBranchController.getHospitalBranches)

hbrouter.post('/role/:hospitalId/:hospitalBranchId',hospitalBranchController.addRole)

hbrouter.delete('/role/:hospitalBranchRoleId',hospitalBranchController.removeRole)

hbrouter.get('/role/:hospitalId/:hospitalBranchId',hospitalBranchController.getHopitalBranchRoles)

hbrouter.get('/hospitalBranchProfile/:hospitalBranchId',hospitalBranchController.getHopitalBranchProfile)

hbrouter.put('/updateHospitalBranchProfile/:hospitalBranchId',hospitalBranchController.updateHopitalBranchProfile)

hbrouter.put('/role/:hospitalId/:hospitalBranchId/:hospitalBranchRoleId',hospitalBranchController.updateHospitalBrancheRoles)

hbrouter.post('/speciality/:hospitalId/:hospitalBranchId',hospitalBranchController.addSpeciality)

hbrouter.get('/speciality/:hospitalId/:hospitalBranchId',hospitalBranchController.getHopitalBranchspecialities)

hbrouter.delete('/speciality/:hospitalBranchSpecialityId',hospitalBranchController.removeSpeciality)

hbrouter.put('/speciality/:hospitalId/:hospitalBranchId/:hospitalBranchSpecialityId',hospitalBranchController.updateHospitalBrancheSpecialities)

hbrouter.put('/:hospitalBranchId',hospitalBranchController.updateHospitalBranch)

module.exports=hbrouter

