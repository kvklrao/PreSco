const table_const = require('../config/table')

module.exports =(sequelize,type)=>{
    return sequelize.define(table_const.referral_doctor,{
        referral_id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true,
          },
          user_id:type.INTEGER,
          hospital_branch_speciality_id:type.INTEGER,
          first_name:type.STRING,
          last_name:type.STRING,
          updated_by:type.INTEGER,
          created_by:type.INTEGER,
          deleted_flag:type.BOOLEAN,
          deleted_date:type.DATE,
          active_flag:type.BOOLEAN,
          referral_source:type.INTEGER,
          hospital_name:type.STRING
    })
}




