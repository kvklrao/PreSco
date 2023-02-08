const pReadingModels = require('../sequelize')
const {validationResult} = require('express-validator/check')
const responseHelper = require('../helper/res')
const constant = require('../helper/constant')
const {sequelize} = require('../sequelize')
const queries = require('../helper/queries')
const mapper = require('../mapper/mapper')
const enumConst = require('../helper/enum')
const nodeMailer = require('nodemailer');

exports.registerHospitalBranch = async(req, res, next) => {
    var branchUser = {}
    var branch = {}
    var roles = {}
    var hospital = await sequelize.query('SELECT m_users.email_address,m_users.password  FROM m_hospitals  JOIN m_users ON m_users.user_id = m_hospitals.user_id  WHERE m_hospitals.hospital_id =:hospital_id',
    { replacements: { 
        hospital_id:req.params.hospitalId,
    }, type: sequelize.QueryTypes.SELECT }
    )
    branchUser = mapper.hospBranchUserMapper(branchUser, req)
    pReadingModels.hospital_branch_model.hasMany(pReadingModels.user_model, { foreignKey: 'user_id' });
    pReadingModels.user_model.belongsTo(pReadingModels.hospital_branch_model, { foreignKey: 'user_id', targetKey: 'user_id'})
    pReadingModels.user_model.findAll({
        where: {
            $or: [{ 
                '$m_hospitals_branch.branch_name$': req.body.name,
                '$m_hospitals_branch.hospital_id$': req.params.hospitalId
            }, {
                contact_number: req.body.contact_number
            }, {
                user_name: req.body.user_name
            }, {
                email_address: req.body.email
            }]
        },
        include: [{
            model: pReadingModels.hospital_branch_model,
            required: true
        }
        ]
    }).then(result => {
        if (result.length > 0) {
            let contactNumber = result.find((data) => {
                if (data["contact_number"]) {
                    return data["contact_number"].toString() == req.body.contact_number.toString()
                }
            });
            let emailAddress = result.find((data) => { return data["email_address"] == req.body.email });
            let branchName = result.find((data) => { return data["m_hospitals_branch"]["branch_name"] === req.body.name });
            let userName = result.find((data) => { return data["user_name"].toLowerCase() == req.body.user_name.toLowerCase() });

            if(branchName){
                res.json(responseHelper.alreadyExist('Branch name already exist', result))
            } else if (contactNumber) {
                res.json(responseHelper.alreadyExist('Contact number already exist', result))
            } else if (emailAddress) {
                res.json(responseHelper.alreadyExist('Email address already exist', result))
            } else if(userName){
                res.json(responseHelper.alreadyExist('Username already exist', result))
            } else {
                res.json(responseHelper.alreadyExist('Invalid entries', result))
            }  
        } else {
            pReadingModels.user_model.create(branchUser)
                .then(result => {
                    if (!result.isEmpty) {
                        roles = mapper.branchRoleMapper(roles, result)
                        pReadingModels.user_role_model.create(roles).then(result => {
                            if (!result.isEmpty) {
                                console.log("hospital role data inserted", result)
                            }
                        }).catch(err => {
                            res.json(responseHelper.serveError(constant.error_msg, err))
                        })
                        branch = mapper.hospBranchMapper(branch, result, req)
                        pReadingModels.hospital_branch_model.create(branch)
                            .then(result => {

                                if (result != null) {

                                    pReadingModels.speciality_model.findAll({
                                        where: {
                                            created_by: 1
                                        }
                                    }).then(sresult => {
                                        sresult.forEach((data, index) => {
                                            pReadingModels.hospital_branch_speciality_model.create(
                                                {
                                                    speciality_id: data.speciality_id,
                                                    hospital_id: req.params.hospitalId,
                                                    hospital_branch_id: result.hospital_branch_id,
                                                    deleted_flag: 0,
                                                    active_flag: 1
                                                }
                                            ).then(sresult => {
                                                console.log('Ceated speciality for hospital branch', sresult.speciality_id);

                                            })

                                        })
                            
                                        res.json(responseHelper.success(constant.hospital_branch_creation, result))
                                    })
                                }

                            }).catch(err => {
                                res.json(responseHelper.serveError(constant.error_msg, err))
                            })
                    }
                })
        }
        return result
        // pReadingModels.hospital_branch_model.findAll({
        //     where: {
        //         branch_name: req.body.name,
        //         hospital_id: req.params.hospitalId
        //     }
        // }).then((bResult) => {
        //     console.log(bResult);
        // });

    }).catch(err => {
        console.log(err);

        res.json(responseHelper.serveError(constant.error_msg, err))
    })
}

exports.getHospitalBranches=(req,res,next)=>{
let searchText = '%'+req.query.searchText+'%'
let query = null
if(req.query.searchText == "null"){
 query = `SELECT * FROM  m_hospitals_branches , m_users WHERE m_hospitals_branches.user_id=m_users.user_id AND m_hospitals_branches.hospital_id=:hospitalId`
}
else{
 query = `SELECT * FROM  m_hospitals_branches,m_users WHERE m_hospitals_branches.user_id=m_users.user_id AND m_hospitals_branches.hospital_id=:hospitalId
  AND ( m_hospitals_branches.branch_name LIKE(:searchText)
  OR m_hospitals_branches.contact_person LIKE(:searchText)
  OR m_users.contact_number LIKE(:searchText) 
  OR m_users.user_name LIKE(:searchText))`
}
    sequelize.query(query,
    { replacements: { 
        hospitalId:req.params.hospitalId,
        searchText:searchText
    }, type: sequelize.QueryTypes.SELECT }
    ).then(result => {
      res.json( responseHelper.success(constant.success,result))
    })
    .catch(err => {
        res.json(responseHelper.serveError(constant.error_msg,err))
     })
}

exports.addRole= (req,res,next)=>{
    var roles ={}
    var hospitalBranchRole={}
    roles= mapper.hospitalBranchRoleMapper(roles,req)

    pReadingModels.role_model.findAll({
        where:{
        role:req.body.role
        }
    }).then(result => {
    if(result.length >0){
        pReadingModels.hospital_branch_roles_model.findAll({
            where:{
                role_id:result[0].role_id,
                hospital_branch_id:req.params.hospitalBranchId
            }
        }).then(hbresult=>{
          if(hbresult.length > 0){
            res.json( responseHelper.alreadyExist('Role already exist'))
          }else{
            hospitalBranchRole.role_id=result[0].role_id
            hospitalBranchRole.hospital_id=req.params.hospitalId
            hospitalBranchRole.hospital_branch_id=req.params.hospitalBranchId
            hospitalBranchRole.deleted_flag=0
            hospitalBranchRole.active_flag=1
            pReadingModels.hospital_branch_roles_model.create(hospitalBranchRole)
            .then(result=>{
            res.json( responseHelper.success(constant.role_add_successfully,result))
            })
          }
        })
     } 
    else {
            pReadingModels.role_model.create(roles).then(result=>{
                if(!result.isEmpty){
                    hospitalBranchRole.role_id=result.role_id
                    hospitalBranchRole.hospital_id=req.params.hospitalId
                    hospitalBranchRole.hospital_branch_id=req.params.hospitalBranchId
                    hospitalBranchRole.deleted_flag=0
                    hospitalBranchRole.active_flag=1
                    pReadingModels.hospital_branch_roles_model.create(hospitalBranchRole)
                    .then(result=>{
                        res.json( responseHelper.success(constant.role_add_successfully,result))
                    })
                }
            })
        }
    })
    .catch(err=>{
         res.json(responseHelper.serveError(constant.error_msg,err))
    })
}

exports.removeRole=(req,res,next)=>{
    pReadingModels.hospital_branch_roles_model.findByPk(req.params.hospitalBranchRoleId)
    .then(result=>{
        return result.destroy()
    })
    .then(result=>{
        res.json( responseHelper.success(constant.deletion_successfull,result))
    })
    .catch(err=>{
        res.json(responseHelper.serveError(constant.error_msg,err))
    })
}

exports.getHopitalBranchRoles=(req,res,next)=>{
    sequelize.query('SELECT m_roles.role ,m_roles.role_id,m_hospital_branch_roles.id AS hospital_branch_role_id ,m_hospital_branch_roles.hospital_branch_id,m_hospital_branch_roles.hospital_id FROM  m_roles  JOIN  m_hospital_branch_roles ON m_roles.role_id = m_hospital_branch_roles.role_id WHERE   m_hospital_branch_roles.hospital_branch_id =:hospital_branch_id AND m_hospital_branch_roles.hospital_id=:hospital_id AND m_hospital_branch_roles.deleted_flag=0 ORDER BY m_hospital_branch_roles.createdAt DESC',
    { replacements: { 
        hospital_id:req.params.hospitalId,
        hospital_branch_id:req.params.hospitalBranchId
    }, type: sequelize.QueryTypes.SELECT }
    ).then(result => {
        res.json( responseHelper.success(constant.success,result))
    })
    .catch(err => {
        res.json(responseHelper.serveError(constant.error_msg,err))
     })
}

exports.updateHospitalBrancheRoles =(req,res,next)=>{
    var roles={}
    var hospitalBranchRole={}

    pReadingModels.hospital_branch_roles_model
    .findByPk(req.params.hospitalBranchRoleId)
    .then(result=>{
        result.deleted_flag=1
        result.save()
    })

    roles.created_by=enumConst.userType.hospital_branch,
    roles.updated_by=enumConst.userType.hospital_branch,
    roles.deleted_flag= 0,
    roles.active_flag= 1,
    roles.role=req.body.role

    pReadingModels.role_model.create(roles)
    .then(result=>{

        if(!result.isEmpty){
            hospitalBranchRole.role_id=result.role_id
            hospitalBranchRole.hospital_id=req.params.hospitalId
            hospitalBranchRole.hospital_branch_id=req.params.hospitalBranchId
            hospitalBranchRole.deleted_flag=0
            hospitalBranchRole.active_flag=1

            pReadingModels.hospital_branch_roles_model.create(hospitalBranchRole)
            .then(result=>{
                res.json( responseHelper.success(constant.role_add_successfully,result))
            })
        }
    })
    .catch(err=>{
        res.json(responseHelper.serveError(constant.error_msg,err))
    })
}

exports.addSpeciality=(req,res,next)=>{
    var speciality ={}
    var hospitalBranchSpeciality={}
    speciality= mapper.hospitalBranchSpecialityMapper(speciality,req)
    pReadingModels.speciality_model.findAll({
        where:{
          speciality:req.body.speciality
        }
    })
    .then(result=>{
        debugger;
    if(result.length >0){
       if( result[0].created_by == 1){
        res.json( responseHelper.alreadyExist('Speciality already exist'))
       }
        pReadingModels.hospital_branch_speciality_model.findAll({
            where:{
                speciality_id:result[0].speciality_id,
                hospital_branch_id:req.params.hospitalBranchId
            }
        }).then(hbresult=>{
          if(hbresult.length > 0){
            res.json( responseHelper.alreadyExist('Speciality already exist'))
          }else{
        hospitalBranchSpeciality.speciality_id=result[0].speciality_id
        hospitalBranchSpeciality.hospital_id=req.params.hospitalId
        hospitalBranchSpeciality.hospital_branch_id=req.params.hospitalBranchId
        hospitalBranchSpeciality.deleted_flag=0
        hospitalBranchSpeciality.active_flag=1
        pReadingModels.hospital_branch_speciality_model.create(hospitalBranchSpeciality)
        .then(result=>{
           res.json( responseHelper.success(constant.speciality_add_successfully,result))
        })
     }
   })
 }else{
        pReadingModels.speciality_model.create(speciality).then(result=>{
            if(!result.isEmpty){
        hospitalBranchSpeciality.speciality_id=result.speciality_id
        hospitalBranchSpeciality.hospital_id=req.params.hospitalId
        hospitalBranchSpeciality.hospital_branch_id=req.params.hospitalBranchId
        hospitalBranchSpeciality.deleted_flag=0
        hospitalBranchSpeciality.active_flag=1
        pReadingModels.hospital_branch_speciality_model.create(hospitalBranchSpeciality)
        .then(result=>{
             res.json( responseHelper.success(constant.speciality_add_successfully,result))
              })
            }
        })
    }
})
.catch(err=>{
         res.json(responseHelper.serveError(constant.error_msg,err))
    })
}

exports.getHopitalBranchspecialities =async (req,res,next)=>{
    sequelize.query('   SELECT m_specialities.speciality, m_specialities.speciality_id ,m_hospital_branch_specialities.id AS hospital_branch_speciality_id ,m_hospital_branch_specialities.hospital_id , m_hospital_branch_specialities.hospital_branch_id FROM m_specialities JOIN m_hospital_branch_specialities ON m_specialities.speciality_id =m_hospital_branch_specialities.speciality_id WHERE m_hospital_branch_specialities.hospital_id=:hospital_id AND m_hospital_branch_specialities.hospital_branch_id=:hospital_branch_id AND m_hospital_branch_specialities.deleted_flag=0 ORDER BY m_hospital_branch_specialities.createdAt DESC',
    { replacements: { 
        hospital_id:req.params.hospitalId,
        hospital_branch_id:req.params.hospitalBranchId
    }, type: sequelize.QueryTypes.SELECT }
    )
    .then(result => {
     res.json( responseHelper.success(constant.success,result))
    })
    .catch(err => {
        res.json(responseHelper.serveError(constant.error_msg,err))
     })
}

exports.removeSpeciality=(req,res,next)=>{
    pReadingModels.hospital_branch_speciality_model.findByPk(req.params.hospitalBranchSpecialityId)
    .then(result=>{
        return result.destroy()
    })
    .then(result=>{
        res.json( responseHelper.success(constant.deletion_successfull,result))
    })
    .catch(err=>{
        res.json(responseHelper.serveError(constant.error_msg,err))
    })
}

exports.updateHospitalBrancheSpecialities =(req,res,next)=>{
    var speciality={}
    var hospitalBranchSpeciality={}

    pReadingModels.hospital_branch_speciality_model
    .findByPk(req.params.hospitalBranchSpecialityId)
    .then(result=>{
        result.deleted_flag=1
        result.save()
    })

    speciality.created_by=enumConst.userType.hospital_branch,
    speciality.updated_by=enumConst.userType.hospital_branch,
    speciality.deleted_flag= 0,
    speciality.active_flag= 1,
    speciality.speciality=req.body.speciality

    pReadingModels.speciality_model.create(speciality)
    .then(result=>{

        if(!result.isEmpty){
            hospitalBranchSpeciality.speciality_id=result.speciality_id
            hospitalBranchSpeciality.hospital_id=req.params.hospitalId
            hospitalBranchSpeciality.hospital_branch_id=req.params.hospitalBranchId
            hospitalBranchSpeciality.deleted_flag=0
            hospitalBranchSpeciality.active_flag=1

            pReadingModels.hospital_branch_speciality_model.create(hospitalBranchSpeciality)
            .then(result=>{
                res.json( responseHelper.success(constant.speciality_updated_successfully,result))
            })
        }
    })
    .catch(err=>{
        res.json(responseHelper.serveError(constant.error_msg,err))
    })
}

exports.getHopitalBranchProfile=(req,res,next)=>{
    sequelize.query('SELECT m_hospitals_branches.branch_name,m_hospitals_branches.hospital_branch_id,m_hospitals_branches.contact_person , '+
     ' m_users.user_name,m_users.contact_number,m_users.contact_number,m_users.email_address,m_users.state,m_users.city,m_users.address,m_users.pincode,m_users.password,m_hospitals.hospital_name'+
     ' FROM m_hospitals_branches '+
     ' JOIN  m_users ON m_users.user_id = m_hospitals_branches.user_id '+
     ' JOIN m_hospitals ON m_hospitals.hospital_id =  m_hospitals_branches.hospital_id '+
     ' WHERE m_hospitals_branches.hospital_branch_id =:hospital_branch_id', 
     { replacements: { 
        hospital_branch_id:req.params.hospitalBranchId,
     }, type: sequelize.QueryTypes.SELECT }
     ).then(result => {
         res.json( responseHelper.success(constant.success,result))
     })
     .catch(err => {
         res.json(responseHelper.serveError(constant.error_msg,err))
    })
}

exports.updateHopitalBranchProfile=(req,res,next)=>{
    pReadingModels.hospital_branch_model.findByPk(req.params.hospitalBranchId)
    .then(result=>{
      result.branch_name= req.body.branchName
      return result.save()
    })
    .then(result =>{
     var userResult = pReadingModels.user_model.findByPk(result.user_id)
     return userResult
    })
    .then(userResult=>{
        pReadingModels.user_model.findAll({
            where:{
                $not:{ user_id:userResult.user_id },
                $or: [{
                    email_address: req.body.emailAddress
                },{
                    contact_number: req.body.contactNumber
                },{
                    user_name: req.body.userName
                }]
            }
        }).then((resData)=>{
            if (resData.length > 0) {
                let contactNumber = resData.find((data) => {
                    if (data["contact_number"]) {
                        return data["contact_number"].toString() == req.body.contactNumber.toString()
                    }
                });
                let emailAddress = resData.find((data) => { return data["email_address"] == req.body.emailAddress });
                let userName = resData.find((data) => { return data["user_name"].toLowerCase() == req.body.userName.toLowerCase() });
                // console.log(userName);
                
                if (userName) {
                    res.json(responseHelper.alreadyExist('Username already exist', resData))
                } else if (emailAddress) {
                    res.json(responseHelper.alreadyExist('Email address already exist', resData))
                } else if (contactNumber){
                    res.json(responseHelper.alreadyExist('Contact number already exist', resData))
                } else {
                    res.json(responseHelper.alreadyExist('Invalid entries', resData))
                }
            }else{
                userResult.user_name=req.body.userName
                userResult.contact_number=req.body.contactNumber
                userResult.email_address=req.body.emailAddress
                userResult.state=req.body.state
                userResult.city=req.body.city
                userResult.address=req.body.address
                userResult.pincode=req.body.pincode
                userResult.password=req.body.password
                userResult.save()
                res.json( responseHelper.success(constant.success))
            }
        });
        
    })
     .catch(err => {
        res.json(responseHelper.serveError(constant.error_msg,err))
     })
}

exports.updateHospitalBranch = async(req,res,next)=>{
   var branch = {}
  
  var user = await pReadingModels.hospital_branch_model.findAll({
       where:{
        hospital_branch_id:req.params.hospitalBranchId
       }
   })

   var eResult = await sequelize.query(`SELECT * FROM m_users
   WHERE email_address =:email_address
   AND user_id NOT IN (:userId) `, 
   { replacements: { 
    email_address: req.body.email,
    userId :user[0].user_id
   }, type: sequelize.QueryTypes.SELECT }
   )

   if(eResult.length > 0){
        res.json(responseHelper.alreadyExist('Email address already exist!'))
       }

  var uResult = await sequelize.query(`SELECT * FROM m_users
    WHERE user_name =:user_name
    AND user_id NOT IN (:userId) `, 
       { replacements: { 
        user_name: req.body.user_name,
        userId :user[0].user_id
       }, type: sequelize.QueryTypes.SELECT }
       )

   if(uResult.length > 0){
    res.json(responseHelper.alreadyExist('Username already exist!'))
   }

   var bnResult = await sequelize.query(`SELECT * FROM m_hospitals_branches
    WHERE branch_name =:branch_name
    AND user_id NOT IN (:userId) `, 
       { replacements: { 
        branch_name: req.body.name,
        userId :user[0].user_id
       }, type: sequelize.QueryTypes.SELECT }
       )

   if(bnResult.length > 0){
    res.json(responseHelper.alreadyExist('Branch already exist!'))
   }

    sequelize.query(`SELECT m_hospitals_branches.branch_name ,m_users.contact_number,
    m_users.email_address,m_users.city,m_users.address,m_users.password,m_users.pincode,m_users.state,
    m_users.user_name,m_hospitals_branches.contact_person
    FROM m_hospitals_branches
    JOIN m_users ON m_users.user_id = m_hospitals_branches.user_id
    WHERE m_hospitals_branches.hospital_branch_id =:hospital_branch_id `, 
    { replacements: { 
       hospital_branch_id:req.params.hospitalBranchId,
    }, type: sequelize.QueryTypes.SELECT }
    )
    .then(result => {
        branch = result[0]
        branch.branch_name =req.body.name
        branch.contact_number=req.body.contact_number
        branch.email_address=req.body.email
        branch.city=req.body.city
        branch.user_name=req.body.user_name
        branch.contact_person=req.body.contact_person
        branch.address=req.body.address
        branch.password=req.body.password
        branch.pincode=req.body.pin_code
        branch.state=req.body.state
        return branch
    })
    .then(branch=>{
        sequelize.query(`UPDATE m_hospitals_branches mhb
        JOIN m_users mu ON mu.user_id = mhb.user_id
        SET   mhb.branch_name =:branch_name, mu.contact_number=:contact_number,mu.email_address=:email_address,mu.city=:city,mu.user_name=:user_name,mhb.contact_person=:contact_person,
        mu.address=:address ,mu.state=:state ,mu.pincode=:pincode,mu.password=:password
        WHERE mhb.hospital_branch_id =:hospital_branch_id`, 
        { replacements: { 
            branch_name:branch.branch_name,
            contact_number:branch.contact_number,
            email_address:branch.email_address,
            city:branch.city,
            user_name:branch.user_name,
            contact_person:branch.contact_person,
            address:branch.address,
            state:branch.state,
            pincode:branch.pincode,
            password:branch.password,
            hospital_branch_id:req.params.hospitalBranchId
        }, type: sequelize.QueryTypes.SELECT }
        )
        res.json(responseHelper.success("Branch detail updated successfully!", branch))
    })
    .catch(err => {
        res.json(responseHelper.serveError(constant.error_msg,err))
    })
}