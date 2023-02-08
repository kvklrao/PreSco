const pReadingModels = require('../sequelize')
const {validationResult} = require('express-validator/check')
const responseHelper = require('../helper/res')
const constant = require('../helper/constant')
const {sequelize} = require('../sequelize')
const queries = require('../helper/queries')
const mapper = require('../mapper/mapper')
const enumConst = require('../helper/enum')
const nodeMailer = require('nodemailer');
const setting = require('../config/setting')

async function aashaHospitalSignUpAdditionalInfo (params) {
   
    await sequelize.query(`
        REPLACE INTO m_users_additional_info 
        (  
            user_id,
            user_type_id,
            profession,
            institution_name,
            institution_type,
            state
        )
        VALUES (?, ?, ?, ?, ?, ?) 
        `, {
            replacements: params,
            type: sequelize.QueryTypes.INSERT
        });
}

exports.hospitalSignUp = async (req,res,next)=>{

    let user ={}, hospital={}, roles ={}, uResult, result;

    user = mapper.userMapper(user,req)
    hospital = mapper.hospitalMapper(hospital,req)
    roles= mapper.roleMapper(roles,req)

    pReadingModels.hospital_model.hasMany(pReadingModels.user_model, { foreignKey: 'user_id' });
    pReadingModels.user_model.hasMany(pReadingModels.hospital_model, { foreignKey: 'user_id', targetKey: 'user_id' });
    
    result = await pReadingModels.user_model.findAll({
                    where :{
                        $or: [{
                            '$m_hospitals.hospital_name$':req.body.hospital_name
                        },{
                            user_name: req.body.username
                        },{
                            email_address: req.body.email
                        }]
                    },
                    include: [{
                        model: pReadingModels.hospital_model,
                        required: true
                    }]
                });

    if(result.length >0){
        let hosName = result.find((data)=>{return data["m_hospitals"][0]["hospital_name"] === req.body.hospital_name}); 
        let emailAddress = result.find((data)=>{return data["email_address"] == req.body.email}); 
        let userName = result.find((data) => { return data["user_name"].toLowerCase() == req.body.username.toLowerCase() });

        if(hosName){
            res.json(responseHelper.alreadyExist('Hospital name already exist', result))
        } else if(emailAddress){
            res.json(responseHelper.alreadyExist('Email address already exist', result))
        }else if(userName){
            res.json(responseHelper.alreadyExist('Username already exist', result))
        }else {
            res.json(responseHelper.alreadyExist('Invalid entries', result))
        }  
        return;
    }
   
    result = await pReadingModels.user_model.create(user)

    if(!result.isEmpty){
        roles.user_id=result.user_id;
        roles.role_id = enumConst.roles.hospital_admin;
        hospital.user_id=result.user_id;
        
        uResult = await pReadingModels.hospital_model.create(hospital)

        if(!uResult.isEmpty){
            uResult = pReadingModels.user_role_model.create(roles);
            if(uResult != null){

                let transporter = nodeMailer.createTransport({
                    host: setting.EMAIL_SERVER,
                    port: 465,
                    secure: true,
                    auth: {
                        user: setting.EMAIL_USER, 
                        pass: setting.EMAIL_PASSWORD
                    }
                });

                let mailOptions = {
                    from: setting.EMAIL_SERVER,
                    to: req.body.email, 
                    subject: 'Registration Confirmation.', 
                    html: `<br><b> Hi ,</b></br>`+
                    `<br><br>You’ve successfully completed registration for PreSco - A Neonatal Sepsis Prediction Platform. Please login into your account using your Username and Password.`+`<br>`+
                   `<br><b>Thanks<b></br>`+
                    `<br><b>Avyantra Health Technologies</b>`
                }
                    
                transporter.sendMail(mailOptions, function(error, info){
                    if (error) {               
                        res.json(responseHelper.serveError(constant.error_msg,error))
                    } 
                    else {
                        res.json( responseHelper.success(constant.successfully_registered,req.body))
                    }
                }); 
            }
        }
    }
}

exports.aashaHospitalSignUp=async(req,res,next)=>{
   
    var user = {
        user_name:req.body.username,
        user_type_id:req.body.hospitalType,
        parent_user_id:null,
        created_by:null,
        deleted_flag:0,
        active_flag:1,
        password:req.body.password,
        email_address:req.body.email,
        contact_number:req.body.mobile
    }

    var hospital={
        hospital_name:'',
        user_id:null,
        deleted_flag:0,
        active_flag :1
    }

    if(req.body.hospitalType == 7 ){
        hospital.hospital_name = 'ASHA'
        msg.text = 'ASHA USER SIGNED UP :: ' + msg.text
        msg.html = 'ASHA USER SIGNED UP :: ' + msg.html
    }else{
        hospital.hospital_name = 'PHC'
        msg.text = 'PHC USER SIGNED UP :: ' + msg.text
        msg.html = 'PHC USER SIGNED UP :: ' + msg.html
    }

   var eResult = await pReadingModels.user_model.findAll({
        where:{
              email_address:req.body.email
        }
    })

    if(eResult.length >0){
        res.json(responseHelper.alreadyExist('Email address already exist', eResult))
    }
    
   var uResult = await pReadingModels.user_model.findAll({
        where:{
            user_name:req.body.username
        }
    })

    if(uResult.length >0){
        res.json(responseHelper.alreadyExist('Username already exist', uResult))
    }

    try{
        var result = await pReadingModels.user_model.create(user)
        hospital.user_id = result.user_id
        var hresult = await pReadingModels.hospital_model.create(hospital)

        let transporter = nodeMailer.createTransport({
            host: setting.EMAIL_SERVER,
            port: 465,
            secure: true,
            auth: {
                user: setting.EMAIL_USER, 
                pass: setting.EMAIL_PASSWORD
            }
        });

        let mailOptions = {
            from: setting.EMAIL_SERVER,
            to: req.body.email, 
            subject: 'Registration Confirmation.', 
            html: `<br><b> Hi ,</b></br>`+
            `<br><br>You’ve successfully completed registration for PreSco - A Neonatal Sepsis Prediction Platform. Please login into your account using your Username and Password.`+`<br>`+
           `<br><b>Thanks<b></br>`+
            `<br><b>Avyantra Health Technologies</b>`
        }
            
        transporter.sendMail(mailOptions, function(error, info){
            if (error) {               
                res.json(responseHelper.serveError(constant.error_msg,error))
            } 
            else {
                res.json( responseHelper.success(constant.successfully_registered,req.body))
            }
        });       
 
    }
    catch (e) {
        res.json(responseHelper.serveError(constant.error_msg, e))
    }
}

exports.addRole= (req,res,next)=>{

    var roles ={}
    roles= mapper.hospitalRoleMapper(roles,req)

    pReadingModels.role_model.create(roles).then(result=>{
        if(!result.isEmpty){
            res.json( responseHelper.success(constant.role_add_successfully,result))
        }
    }).catch(err=>{
         res.json(responseHelper.serveError(constant.error_msg,err))
    })

}

exports.getHospitalProfile = (req, res, next)=>{

    sequelize.query('SELECT m_hospitals.hospital_id,m_hospitals.user_id,m_hospitals.hospital_name, '+
   ' m_users.address,m_users.city, m_users.contact_number,m_users.email_address, m_users.pincode, m_users.state, m_users.user_name, m_users.password '+
   ' FROM m_hospitals '+
   ' JOIN m_users ON m_hospitals.user_id = m_users.user_id '+
   ' WHERE m_hospitals.hospital_id = :hospital_id ',
    { replacements: { 
        hospital_id:req.params.hospitalId,
    }, type: sequelize.QueryTypes.SELECT }
    ).then(result => {
        res.json( responseHelper.success(constant.success,result))
    })
    .catch(err => {
        res.json(responseHelper.serveError(constant.error_msg,err))
     })
}

exports.updateHospitalProfile = (req, res, next) => {

    pReadingModels.hospital_model.hasMany(pReadingModels.user_model, { foreignKey: 'user_id' });
    pReadingModels.user_model.hasMany(pReadingModels.hospital_model, { foreignKey: 'user_id', targetKey: 'user_id' });
    pReadingModels.user_model.findAll({
        where: {
            $not: { user_id: req.body.user_id },
            $or: [{
                '$m_hospitals.hospital_name$': req.body.hospital_name
            }, {
                user_name: req.body.user_name
            }, {
                email_address: req.body.email_address
            }]
        },
        include: [{
            model: pReadingModels.hospital_model,
            required: true
        }]
    }).then((mResult) => {
        if (mResult.length > 0) {
            let hosName = mResult.find((data) => { return data["m_hospitals"][0]["hospital_name"] === req.body.hospital_name });
            let emailAddress = mResult.find((data) => { return data["email_address"] == req.body.email_address });
            let userName = mResult.find((data) => { return data["user_name"].toLowerCase() == req.body.user_name.toLowerCase() });

            if (hosName) {
                res.json(responseHelper.alreadyExist('Hospital name already exist', mResult))
            } else if (emailAddress) {
                res.json(responseHelper.alreadyExist('Email address already exist', mResult))
            } else if(userName){
                res.json(responseHelper.alreadyExist('Username already exist', mResult))
            } else {
                res.json(responseHelper.alreadyExist('Invalid entries', mResult))
            } 
        } else {
            pReadingModels.user_model.findOne({
                where: {
                    user_id: req.body.user_id
                }
            })
                .then(async result => {

                    console.log();

                    if (result == null) {
                        res.json(responseHelper.notFound(constant.no_record_found, result))
                    }
                    
                    try{
                        result.address = req.body.address
                        result.city = req.body.city
                        result.contact_number = req.body.contact_number
                        result.email_address = req.body.email_address
                        result.pincode = req.body.pincode
                        result.state = req.body.state
                        result.user_name = req.body.user_name
                        result.password = req.body.password

                        return result.save()
                    }
                    catch(ex){
                        //console.log(ex);
                        throw ex;
                    }
                })
                .then(result => {

                    var hospitalResult = pReadingModels.hospital_model.findOne({
                        where: {
                            hospital_id: req.params.hospitalId
                        }
                    })

                    return hospitalResult
                })
                .then(result => {

                    result.hospital_name = req.body.hospital_name
                    return result.save()
                })
                .then(result => {

                    res.json(responseHelper.success(constant.hospital_profile_updated_successfully, result))

                })
                .catch(err => {
                    res.json(responseHelper.serveError(constant.error_msg, err))
                })
        }
    });
}

exports.getRegisteredRefferal=(req,res,next)=>{
var start = (req.params.start-1)*req.params.end
var referralIds =[]
let searchText = '%'+req.query.searchText+'%'
let rquery = null 

if(req.query.searchText == "null"){
// rquery ='SELECT m_referral_doctors.referral_id, m_referral_doctors.first_name,m_referral_doctors.last_name, '+
// ' m_users.address,m_users.city,m_users.contact_number,m_users.email_address,m_users.state,m_users.user_name,m_users.password, m_referral_doctors.referral_source '+
// ' FROM m_referral_doctors '+
// ' JOIN m_users ON m_users.user_id = m_referral_doctors.user_id ' +
// ' WHERE m_referral_doctors.referral_source =2 ' +
// ' LIMIT ' + req.params.end +' OFFSET ' +start
rquery = `SELECT m_referral_doctors.referral_id, m_referral_doctors.first_name,m_referral_doctors.last_name,
    m_users.address,m_users.city,m_users.contact_number,
    m_users.email_address,m_users.state,m_users.user_name,m_users.password, 
    m_referral_doctors.referral_source, m_referral_doctors.hospital_branch_speciality_id, m_specialities.speciality FROM m_referral_doctors 
    JOIN m_users ON m_users.user_id = m_referral_doctors.user_id 
    JOIN m_specialities ON m_referral_doctors.hospital_branch_speciality_id = m_specialities.speciality_id
    WHERE m_referral_doctors.referral_source =2 
    LIMIT ` + req.params.end +` OFFSET ` +start;
}else{
 rquery = `SELECT m_referral_doctors.referral_id, m_referral_doctors.first_name,m_referral_doctors.last_name,
    m_users.address,m_users.city,m_users.contact_number,
    m_users.email_address,m_users.state,m_users.user_name,m_users.password, 
    m_referral_doctors.referral_source, m_referral_doctors.hospital_branch_speciality_id, m_specialities.speciality FROM m_referral_doctors 
    JOIN m_users ON m_users.user_id = m_referral_doctors.user_id 
    JOIN m_specialities ON m_referral_doctors.hospital_branch_speciality_id = m_specialities.speciality_id
    WHERE m_referral_doctors.referral_source =2
    AND ( m_referral_doctors.first_name LIKE('`+ searchText +`')
    OR  m_referral_doctors.last_name LIKE('` + searchText +`')
    OR  m_users.contact_number LIKE('` +searchText +`') )` 
}
   sequelize.query(rquery,
     { type: sequelize.QueryTypes.SELECT }
      )
      .then(result=>{
        if(result.length > 0){
            result.forEach((data,index)=>{
                referralIds.push(data.referral_id)
        })
        sequelize.query('SELECT m_status.status_name AS hospital_initiation_status ,ms.status_name AS  refferal_initiation_status,map_referral_hospitals.referral_action_status,map_referral_hospitals.hospital_id ,map_referral_hospitals.referral_hospital_id,map_referral_hospitals.referral_id , map_referral_hospitals.hospital_action_status  FROM map_referral_hospitals '+
        ' JOIN m_status ON m_status.status_id = map_referral_hospitals.hospital_action_status '+
        ' JOIN m_status ms ON  ms.status_id = map_referral_hospitals.referral_action_status '+
        ' WHERE map_referral_hospitals.referral_id  IN ('+referralIds+') AND map_referral_hospitals.hospital_id =:hospital_id ',
        { replacements: { 
            hospital_id:req.params.hospitalId
         },type: sequelize.QueryTypes.SELECT })
         .then(referralHospitalResult =>{
       for(var i =0 ; i<result.length;i++){
           result[i].hospital_initiation_status='Request Initiation'
           result[i].hospital_initiation_status_id =1
           result[i].referral_hospital_id=null
           result[i].referral_initiation_status='Request Initiation'
           result[i].refferal_initiation_status_id =1
      }
            if(referralHospitalResult.length > 0){
                for(var i =0;i<result.length;i++){
                for(var j=0;j<referralHospitalResult.length;j++){
                 if(result[i].referral_id==referralHospitalResult[j].referral_id){
                    result[i].hospital_initiation_status=referralHospitalResult[j].hospital_initiation_status
                    result[i].hospital_initiation_status_id =referralHospitalResult[j].hospital_action_status
                    result[i].referral_hospital_id=referralHospitalResult[j].referral_hospital_id
                    result[i].referral_initiation_status=referralHospitalResult[j].refferal_initiation_status
                    result[i].refferal_initiation_status_id =referralHospitalResult[j].referral_action_status
                 } 
               }
            }
         }
         return result
    })
    .then(result => {
        res.json( responseHelper.success(constant.success,result))
     }).catch(err => {
        res.json(responseHelper.serveError(constant.error_msg,err))
    })
  }else{
    res.json( responseHelper.success(constant.success,result))
  }
 })
}

exports.getRefferalCount =async(req,res,next) =>{

    let searchText = '%' + req.query.searchText + '%'
    let rquery = null

    if (req.query.searchText == "null") {
        rquery = `SELECT m_referral_doctors.referral_id, m_referral_doctors.first_name,m_referral_doctors.last_name,
            m_users.address,m_users.city,m_users.contact_number,
            m_users.email_address,m_users.state,m_users.user_name,m_users.password, 
            m_referral_doctors.referral_source, m_referral_doctors.hospital_branch_speciality_id, 
            m_specialities.speciality, count(*) as total
            FROM m_referral_doctors 
            JOIN m_users ON m_users.user_id = m_referral_doctors.user_id 
            JOIN m_specialities ON m_referral_doctors.hospital_branch_speciality_id = m_specialities.speciality_id
            WHERE m_referral_doctors.referral_source =2 `
    } else {
        rquery = `SELECT m_referral_doctors.referral_id, m_referral_doctors.first_name,m_referral_doctors.last_name,
            m_users.address,m_users.city,m_users.contact_number,
            m_users.email_address,m_users.state,m_users.user_name,m_users.password, 
            m_referral_doctors.referral_source, m_referral_doctors.hospital_branch_speciality_id, 
            m_specialities.speciality, count(*) as total
            FROM m_referral_doctors 
            JOIN m_users ON m_users.user_id = m_referral_doctors.user_id 
            JOIN m_specialities ON m_referral_doctors.hospital_branch_speciality_id = m_specialities.speciality_id
            WHERE m_referral_doctors.referral_source =2 
            AND ( m_referral_doctors.first_name LIKE(:searchText)
            OR  m_referral_doctors.last_name LIKE(:searchText)
            OR  m_users.contact_number LIKE(:searchText))`
    }
    
    var response = await sequelize.query(rquery,
        {
            replacements: {
                searchText: searchText
            }, type: sequelize.QueryTypes.SELECT
        }
    );
    var total = response[0]["total"];
    res.json( responseHelper.success(constant.success,{refferal_count:total}))

    // pReadingModels.referral_hospitals_model
    // .findAndCountAll({
    //    where: {
    //     hospital_id:req.params.hospitalId,
    //     created_by:5
    //    }   
    //  })
    // .then(result => {
    //   res.json( responseHelper.success(constant.success,{refferal_count:result.count}))
    // })
    // .catch(err => {
    //     res.json(responseHelper.serveError(constant.error_msg,err))
    //  })
}

exports.sendMsgfrmHospToStaff =async(req,res,next)=>{
     var message={
        message:req.body.message,
        is_read:0,
        createdBy:req.params.hospitalId,
        deleted_flag:0,
        active_flag:1,
        sender:req.params.hUserId,
        receiver:req.params.sUserId
     }
        pReadingModels.message_model.create(message)
        .then(result=>{
            res.json( responseHelper.successWithMsg(result))
        }).catch(err=>{
            res.json(responseHelper.serveError(constant.error_msg,err))
          })
}

exports.getStaffAdmin = async (req,res,next)=>{

    var sUser = await sequelize.query(`SELECT user_id FROM m_staffs WHERE staff_id=:staff_id`,
    { 
    replacements: { 
        staff_id:req.params.staffId
    }, 
    type: sequelize.QueryTypes.SELECT }
    )

    var result = await sequelize.query(`SELECT DISTINCT map_staff_hospitals.hospital_id  AS id, m_hospitals.hospital_name AS name, m_users.contact_number,m_users.user_id
    FROM map_staff_hospitals
    JOIN m_staffs ON m_staffs.staff_id = map_staff_hospitals.staff_id
    JOIN m_hospitals ON m_hospitals.hospital_id = map_staff_hospitals.hospital_id
    JOIN m_users ON m_users.user_id = m_hospitals.user_id 
    WHERE m_staffs.staff_id =:staff_id  AND m_hospitals.active_flag = 1 `,
         { replacements: { 
            staff_id:req.params.staffId,
         }, type: sequelize.QueryTypes.SELECT }
         )

         if(result.length>0){
            for(let data of result){
                data.user ='Hospital'
                if(result.length > 0){
               var  mResult = await pReadingModels.message_model.findAll({
                where:{
                    sender:data.user_id ,
                    receiver:sUser[0].user_id
                 },
                 order:[
                    ['message_log_id', 'DESC']
                   ],
                   limit: 1
                 })

                 if(mResult.length>0){
                    data.is_read =mResult[0].is_read
                    data.createdAt = mResult[0].createdAt
                    }else{
                       data.is_read =null
                       data.createdAt =null
                    }
          
              }
        }

     var bResult = await sequelize.query(`SELECT DISTINCT map_staff_hospitals.hospital_branch_id AS id ,m_hospitals_branches.branch_name  AS name , m_users.user_id , m_users.contact_number 
      FROM map_staff_hospitals 
      JOIN m_staffs ON m_staffs.staff_id = map_staff_hospitals.staff_id
      JOIN m_hospitals_branches ON  m_hospitals_branches.hospital_branch_id = map_staff_hospitals.hospital_branch_id
      JOIN m_users ON m_users.user_id = m_hospitals_branches.user_id 
      WHERE m_staffs.staff_id =:staff_id AND m_hospitals_branches.active_flag =1`,
        { replacements: { 
            staff_id:req.params.staffId,
        }, type: sequelize.QueryTypes.SELECT })

        if(bResult.length>0){
            for(let data of bResult){
                  data.user = 'Hospital Branch'
                  var  bmResult = await pReadingModels.message_model.findAll({
                     where:{
                         sender:data.user_id,
                         receiver:sUser[0].user_id
                      },
                      order:[
                         ['message_log_id', 'DESC']
                        ],
                        limit: 1
                    })
                    if(bmResult.length > 0){
                      data.is_read =bmResult[0].is_read
                      data.createdAt = bmResult[0].createdAt
                    }else{
                      data.is_read =null
                      data.createdAt =null
                    }
                    if(result.length>0){
                      result.push(data)
                    }
              }
              if(result.length>0){
                var sortedArray  = result.sort(function(a, b){
                    return b.createdAt-a.createdAt 
                   });
                res.json( responseHelper.success(constant.success,sortedArray))
              }else{
                var sortedArray  = bResult.sort(function(a, b){
                    return b.createdAt-a.createdAt 
                   });
                  res.json( responseHelper.success(constant.success,bResult))
              }
          }else{
            var sortedArray  = result.sort(function(a, b){
                return b.createdAt-a.createdAt 
               });
              res.json( responseHelper.success(constant.success,result))
          }
          }
    }
    
exports.getMessage =(req,res,next)=>{
    sequelize.query(`SELECT  message_log_id , sender , receiver , message , is_read , createdAt , active_flag FROM t_message_logs
    WHERE sender IN(` + req.params.senderId + `,`+ req.params.receiverId + `) AND receiver IN(` + req.params.senderId +`,` + req.params.receiverId + `)`,
     { type: sequelize.QueryTypes.SELECT }
     ).then(result => {
       result.forEach((data,index)=>{
        if(data.sender == req.params.senderId){
             data.isSender = true
        }else{
            data.isSender = false;
        }
       })
        return result
     }).then(result=>{
        res.json( responseHelper.success(constant.success,result))
     })
     .catch(err => {
        res.json(responseHelper.serveError(constant.error_msg,err))
     })
}

exports.getReferralAdmin =async(req,res,next)=>{

    var rUser = await sequelize.query(`SELECT user_id FROM m_referral_doctors WHERE referral_id =:referral_id`,
    { 
    replacements: { 
        referral_id:req.params.referralId,
     }, 
    type: sequelize.QueryTypes.SELECT }
    )

    var result = await sequelize.query(`SELECT DISTINCT map_referral_hospitals.hospital_id AS id , m_hospitals.hospital_name AS name, m_users.contact_number,m_users.user_id
   FROM map_referral_hospitals
   JOIN  m_hospitals ON m_hospitals.hospital_id = map_referral_hospitals.hospital_id
   JOIN  m_users ON m_users.user_id = m_hospitals.user_id
   JOIN  m_referral_doctors ON m_referral_doctors.referral_id = map_referral_hospitals.referral_id
   WHERE  map_referral_hospitals.referral_id =:referral_id AND m_referral_doctors.referral_source= 2 AND map_referral_hospitals.active_flag=1
   AND m_hospitals.active_flag=1`,
      { replacements: { 
         referral_id:req.params.referralId,
      }, type: sequelize.QueryTypes.SELECT }
      )
 
      if(result.length>0){
         for(let data of result){
             data.user ='Hospital'
            var  mResult = await pReadingModels.message_model.findAll({
                 where:{
                    sender:data.user_id,
                    receiver:rUser[0].user_id 
                 },
                 order:[
                    ['message_log_id', 'DESC']
                   ],
                   limit: 1
              })
              if(mResult.length>0){
              data.is_read =mResult[0].is_read
              data.createdAt = mResult[0].createdAt
              }else{
                 data.is_read =null
                 data.createdAt =null
              }
         }
     }
     var bResult = await sequelize.query(`SELECT DISTINCT map_referral_hospitals.hospital_branch_id AS id , m_hospitals_branches.branch_name AS name , m_users.user_id , m_users.contact_number
     FROM map_referral_hospitals
     JOIN  m_hospitals_branches ON m_hospitals_branches.hospital_branch_id = map_referral_hospitals.hospital_branch_id
     JOIN m_users ON  m_users.user_id = m_hospitals_branches.user_id
     JOIN m_referral_doctors ON m_referral_doctors.referral_id = map_referral_hospitals.referral_id
     WHERE map_referral_hospitals.referral_id =:referral_id AND m_referral_doctors.referral_source =2 AND map_referral_hospitals.active_flag =1 AND m_hospitals_branches.active_flag=1 `,
      { replacements: { 
         referral_id:req.params.referralId,
      }, type: sequelize.QueryTypes.SELECT }
      )
 
     if(bResult.length>0){
               for(let data of bResult){
                     data.user = 'Hospital Branch'
                     var  bmResult = await pReadingModels.message_model.findAll({
                        where:{
                            sender:data.user_id,
                            receiver:rUser[0].user_id
                         },
                         order:[
                            ['message_log_id', 'DESC']
                           ],
                           limit: 1
                       })
                       if(bmResult.length > 0){
                         data.is_read =bmResult[0].is_read
                         data.createdAt = bmResult[0].createdAt
                       }else{
                         data.is_read =null
                         data.createdAt =null
                       }
                       if(result.length>0){
                         result.push(data)
                       }
                 }
                 if(result.length>0){

                    var sortedArray  = result.sort(function(a, b){
                        return b.createdAt-a.createdAt 
                       });

                     res.json( responseHelper.success(constant.success,sortedArray))
                 }else{

                    var sortedArray  = bResult.sort(function(a, b){
                        return b.createdAt-a.createdAt 
                       });

                     res.json( responseHelper.success(constant.success,bResult))
                 }
             }else{
                var sortedArray  = result.sort(function(a, b){
                    return b.createdAt-a.createdAt 
                   });

                 res.json( responseHelper.success(constant.success,sortedArray))
             }
 }
  
exports.updateIsReadFlag =(req,res,next)=>{
    pReadingModels.message_model.findAll({
        where:{
            sender:req.params.sUserId ,
            receiver:req.params.rUserId
        }
    })
    .then(result=>{
        result.forEach((data,index)=>{
            data.is_read = 1
            data.save()
        })
      return result
     })
     .then(result=>{
        res.json( responseHelper.success(constant.success,result))
     })
     .catch(err => {
        res.json(responseHelper.serveError(constant.error_msg,err))
     })
}

exports.getRegisterRefferalCount =(req,res,next)=>{
    sequelize.query(`SELECT COUNT(*) as registered_refferal_count FROM m_referral_doctors 
    JOIN m_users ON m_users.user_id = m_referral_doctors.user_id `,
     { type: sequelize.QueryTypes.SELECT }
     ).then(result=>{
        res.json( responseHelper.success(constant.success,result))
     })
     .catch(err => {
        res.json(responseHelper.serveError(constant.error_msg,err))
     })
}

exports.getDashBoardDetail =async(req,res,next)=>{
     var messages =[]
     var query =''
    
     var hbquery =`SELECT COUNT(DISTINCT m_staffs.staff_id) AS total_staff , 
     m_hospitals_branches.branch_name,m_hospitals.hospital_name
     FROM map_staff_hospitals
     JOIN m_hospitals_branches 
     ON m_hospitals_branches.hospital_branch_id = map_staff_hospitals.hospital_branch_id
     JOIN m_hospitals 
     ON m_hospitals.hospital_id = m_hospitals_branches.hospital_id
     JOIN m_staffs 
     ON m_staffs.staff_id = map_staff_hospitals.staff_id
     WHERE map_staff_hospitals.hospital_branch_id =`+ req.query.hospitalBranchId

    // var rquery =`SELECT COUNT(*) AS referral_doctor_count FROM m_referral_doctors `

     var rquery = `SELECT COUNT(*)  AS referral_doctor_count FROM map_referral_hospitals
     JOIN m_referral_doctors ON m_referral_doctors.referral_id = map_referral_hospitals.referral_id
     WHERE `

     var getStaffQuery =`SELECT DISTINCT map_staff_hospitals.staff_id ,
     m_staffs.first_name,m_staffs.last_name,m_roles.role, `
     if(req.query.userType === 'Hospital Branch'){
      getStaffQuery += ` m_hospitals_branches.user_id AS hospital_branch_user_id, `   
     }else{
      getStaffQuery += ` m_hospitals.user_id AS hospital_user_id, `
     }
     getStaffQuery += ` m_staffs.user_id AS staff_user_id
     FROM map_staff_hospitals
     JOIN m_staffs  ON m_staffs.staff_id = map_staff_hospitals.staff_id
     JOIN  m_hospital_branch_roles ON m_hospital_branch_roles.id= m_staffs.hospital_branch_role_id
     JOIN  m_roles ON m_roles.role_id = m_hospital_branch_roles.role_id `

     var getReferralQuery = `SELECT DISTINCT map_referral_hospitals.referral_id,
     m_referral_doctors.first_name,m_referral_doctors.last_name ,m_referral_doctors.user_id AS referral_user_id,
     m_hospitals.user_id AS hospital_user_id 
     FROM map_referral_hospitals
     JOIN m_referral_doctors ON m_referral_doctors.referral_id=map_referral_hospitals.referral_id
     JOIN  m_hospitals ON m_hospitals.hospital_id = map_referral_hospitals.hospital_id `

     var msgListQuery = `SELECT * FROM t_message_logs`
     if(req.query.userType === 'Hospital Branch'){
     query = hbquery
     rquery = rquery +" map_referral_hospitals.hospital_branch_id = "+req.query.hospitalBranchId+' AND m_referral_doctors.referral_source=1'
     getStaffQuery = getStaffQuery + ' JOIN m_hospitals_branches ON m_hospitals_branches.hospital_branch_id= map_staff_hospitals.hospital_branch_id WHERE map_staff_hospitals.hospital_branch_id= ' + req.query.hospitalBranchId
     var referralResult = await sequelize.query(rquery,{ type: sequelize.QueryTypes.SELECT } )
     var staffMessages = await sequelize.query(getStaffQuery,{ type: sequelize.QueryTypes.SELECT } )
     console.log(staffMessages);
     staffMessages.forEach((data,index)=>{
        pReadingModels.message_model.findAll({
            where:{
                sender:data. staff_user_id,
                receiver:data. hospital_branch_user_id
            },
            order:[
                ['message_log_id', 'DESC']
               ],
            limit: 1
        }).then(dResult=>{
            if(dResult.length > 0){
            data.message_log_id = dResult[0].message_log_id
            data.message = dResult[0].message
            messages.push(data)
           }
        })
     })
   }
    else{
        if(req.query.hospitalBranchId != 'null'){
        query = hbquery  
        }
        else{
        query = ` SELECT hospital_name FROM m_hospitals WHERE m_hospitals.hospital_id= `+req.params.hospitalId
        }
     rquery = rquery +' map_referral_hospitals.hospital_id='+req.params.hospitalId+' AND m_referral_doctors.referral_source=2'
     getStaffQuery = getStaffQuery + ' JOIN m_hospitals ON m_hospitals.hospital_id=map_staff_hospitals.hospital_id WHERE map_staff_hospitals.hospital_id = ' + req.params.hospitalId
     getReferralQuery = getReferralQuery + ' WHERE map_referral_hospitals.hospital_id = ' + req.params.hospitalId
     var referralResult = await sequelize.query(rquery,{ type: sequelize.QueryTypes.SELECT } )
     var staffMessages = await sequelize.query(getStaffQuery,{ type: sequelize.QueryTypes.SELECT } )  
     staffMessages.forEach((data,index)=>{         
        pReadingModels.message_model.findAll({
            where:{
                sender:data.staff_user_id,
                receiver:data.hospital_user_id
            },
            order:[
                ['message_log_id', 'DESC']
               ],
            limit: 1
        }).then(dResult=>{            
            if(dResult.length > 0){
            data.message_log_id = dResult[0].message_log_id
            data.message = dResult[0].message
            messages.push(data)
           }
        })
     })

     var referralMessages = await sequelize.query(getReferralQuery,{ type: sequelize.QueryTypes.SELECT } )
     referralMessages.forEach((data,index)=>{
        pReadingModels.message_model.findAll({
            where:{
                sender:data.referral_user_id ,
                receiver:data.hospital_user_id
            },
            order:[
                ['message_log_id', 'DESC']
               ],
            limit: 1
        }).then(dResult=>{
            if(dResult.length > 0){
            data.message_log_id = dResult[0].message_log_id
            data.message = dResult[0].message
            messages.push(data)
           }
        })
     })
   }
   console.log(messages);
   
    sequelize.query(query,
        { type: sequelize.QueryTypes.SELECT }
     ).then(result=>{
         var m_record_count_query = `SELECT COUNT(DISTINCT patient_basic_infos.id) AS medical_record_count
         FROM map_staff_hospitals
         JOIN  patient_basic_infos 
         ON patient_basic_infos.hospital_branch_id =map_staff_hospitals.hospital_branch_id
         where map_staff_hospitals.hospital_branch_id=`+ req.query.hospitalBranchId

         sequelize.query(m_record_count_query,
            { type: sequelize.QueryTypes.SELECT }
         ).then((resData) => {
             if (req.query.hospitalBranchId == 'null') {
                 result[0].total_staff = 0
                 result[0].medical_record_count = 0
                 result[0].branch_name = null
             }
             if (result.length > 0 ) {
                 result[0].referral_doctor_count = referralResult[0].referral_doctor_count
                 result[0].medical_record_count = resData[0].medical_record_count
                 if (messages.length > 0) {
                     var sortedArray = messages.sort(function (a, b) {
                         return b.message_log_id - a.message_log_id
                     }).slice(0, 5);
                     result[0].messages = sortedArray
                     setTimeout(function () {
                         res.json(responseHelper.success(constant.success, result))
                     }, 200)
                 } else {
                     result[0].messages = []
                     res.json(responseHelper.success(constant.success, result))
                 }
             }
         })

     })
     .catch(err => {
        res.json(responseHelper.serveError(constant.error_msg,err))
     })
}


exports.getAllReferralDoctors =async(req,res,next)=>{
    var query = ` SELECT DISTINCT m_referral_doctors.referral_id,map_staff_hospitals.hospital_id,map_staff_hospitals.staff_id,
    m_referral_doctors.first_name,m_referral_doctors.last_name,m_referral_doctors.referral_source
    FROM map_staff_hospitals
    JOIN map_referral_hospitals ON map_referral_hospitals.hospital_id= map_staff_hospitals.hospital_id
    JOIN  m_referral_doctors ON m_referral_doctors.referral_id =map_referral_hospitals.referral_id 
    WHERE map_staff_hospitals.staff_id =:staffId
    AND map_referral_hospitals.hospital_action_status =4 AND map_referral_hospitals.referral_action_status =4 AND m_referral_doctors.referral_source=2
    UNION
    SELECT DISTINCT m_referral_doctors.referral_id,map_staff_hospitals.hospital_id,map_staff_hospitals.staff_id,
    m_referral_doctors.first_name,m_referral_doctors.last_name,m_referral_doctors.referral_source
    FROM map_staff_hospitals
    JOIN map_referral_hospitals ON map_referral_hospitals.hospital_id= map_staff_hospitals.hospital_id
    JOIN map_referral_hospitals mrh ON mrh.hospital_branch_id =map_staff_hospitals.hospital_branch_id
    JOIN  m_referral_doctors ON m_referral_doctors.referral_id =map_referral_hospitals.referral_id  
    WHERE map_staff_hospitals.staff_id =:staffId
    AND map_referral_hospitals.hospital_action_status =4 AND map_referral_hospitals.referral_action_status =4 AND m_referral_doctors.referral_source=1`

    var result = await sequelize.query(query,
        {
        replacements: {
            staffId: req.params.staffId
        }, type: sequelize.QueryTypes.SELECT
        })

    res.json(responseHelper.success(constant.success, result))
}

exports.getStateList =(req,res,next)=>{
    pReadingModels.state_model.findAll({
        where:{
            active_flag:1
        }
    })
    .then(result=>{
        res.json( responseHelper.success(constant.success,result))
     })
     .catch(err => {
        res.json(responseHelper.serveError(constant.error_msg,err))
     })
}
