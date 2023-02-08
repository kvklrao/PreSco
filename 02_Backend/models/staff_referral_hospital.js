const table_const = require('../config/table')

module.exports =(sequelize,type)=>{
    return sequelize.define(table_const.staff_referral_hospital,{
         id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true,
          },
          referral_id:type.INTEGER,
          hospital_branch_id:type.INTEGER,
          staff_id:type.INTEGER,
          deleted_flag:type.BOOLEAN,
          active_flag:type.BOOLEAN,
          file:type.STRING,
          study_id:type.INTEGER,
          reading:type.STRING
    })
}



