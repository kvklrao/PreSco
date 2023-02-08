const table_const = require('../config/table')

module.exports =(sequelize,type)=>{
    return sequelize.define(table_const.map_user_role ,{
        user_role_id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true,
          },
          user_id:type.INTEGER,
          hospital_branch_roles_id:type.INTEGER,
          created_by:type.INTEGER,
          updated_by:type.INTEGER,
          deleted_flag:type.BOOLEAN,
          deleted_date:type.DATE,
          active_flag:type.BOOLEAN
    })
}

