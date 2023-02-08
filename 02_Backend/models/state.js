const table_const = require('../config/table')

module.exports =(sequelize,type)=>{
    return sequelize.define(table_const.state,{
        state_id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true,
          },
          state_name:type.STRING,
          state_code:type.STRING,
          deleted_flag:type.BOOLEAN,
          active_flag:type.BOOLEAN
    })
}


