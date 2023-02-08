const table_const = require('../config/table')

module.exports =(sequelize,type)=>{
    return sequelize.define(table_const.referral_files,{
         id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true,
          },
          staff_referral_hospital_id:type.INTEGER,
          filename:type.STRING,
          filepath:type.STRING,
          deleted_flag:type.BOOLEAN,
          active_flag:type.BOOLEAN
    })
}



