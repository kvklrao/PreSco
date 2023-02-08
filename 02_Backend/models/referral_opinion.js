const table_const = require('../config/table')

module.exports =(sequelize,type)=>{
    return sequelize.define(table_const.refferal_opinion,{
         id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true,
          },
          staff_referral_hospital_id:type.INTEGER,
          deleted_flag:type.BOOLEAN,
          active_flag:type.BOOLEAN,
          opinion:type.STRING,
          prescription:type.STRING
    })
}

