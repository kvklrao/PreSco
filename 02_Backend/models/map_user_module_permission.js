const table_const = require('../config/table')

module.exports =(sequelize,type)=>{
    return sequelize.define(table_const.map_user_module_permission ,{
        user_module_permission_id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true,
          },
          user_id:type.INTEGER,
          module_id:type.INTEGER,
          permission_id:type.INTEGER,
          created_by:type.INTEGER,
          updated_by:type.INTEGER,
          deleted_flag:type.BOOLEAN,
          deleted_date:type.DATE,
          active_flag:type.BOOLEAN
    })
}

