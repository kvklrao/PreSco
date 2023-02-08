const table_const = require('../config/table')

module.exports =(sequelize,type)=>{
    return sequelize.define(table_const.roles,{
          role_id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true,
          },
          role:type.STRING,
          created_by:type.INTEGER,
          updated_by:type.INTEGER,
          deleted_flag:type.BOOLEAN,
          deleted_date:type.DATE,
          active_flag:type.BOOLEAN
    })
}

