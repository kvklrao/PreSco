const table_const = require('../config/table')

module.exports =(sequelize,type)=>{
    return sequelize.define(table_const.referral_hospitals,{
        referral_hospital_id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true,
          },
          hospital_id:type.INTEGER,
          hospital_branch_id:type.INTEGER,
          referral_id:type.INTEGER,
          requester_type:type.INTEGER,
          hospital_action_status:type.INTEGER,
          referral_action_status:type.INTEGER,
          updated_by:type.INTEGER,
          created_by:type.INTEGER,
          deleted_flag:type.BOOLEAN,
          deleted_date:type.DATE,
          active_flag:type.BOOLEAN,
          referral_source:type.INTEGER,
          passcode:type.STRING
    })
}

