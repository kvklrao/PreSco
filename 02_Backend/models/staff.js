const table_const = require('../config/table')

module.exports =(sequelize,type)=>{
    return sequelize.define(table_const.staff,{
        staff_id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true,
          },
          user_id:type.INTEGER,
          hospital_branch_speciality_id:type.INTEGER,
          hospital_branch_role_id:type.INTEGER,
          reporting_user_id:type.INTEGER,
          first_name:type.STRING,
          last_name:type.STRING,
          created_by:type.INTEGER,
          updated_by:type.INTEGER,
          deleted_flag:type.BOOLEAN,
          deleted_date:type.DATE,
          active_flag:type.BOOLEAN
    })
}

