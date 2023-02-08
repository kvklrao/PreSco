const table_const = require('../config/table')

module.exports =(sequelize,type)=>{
    return sequelize.define(table_const.permission,{
        permision_Id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true,
          },
          permission:type.STRING,
          created_by:type.INTEGER,
          deleted_flag:type.BOOLEAN,
          deleted_date:type.DATE,
          active_flag:type.BOOLEAN
    })
}




