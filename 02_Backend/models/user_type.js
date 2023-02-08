const table_const = require('../config/table')

module.exports =(sequelize,type)=>{
    return sequelize.define(table_const.user_type ,{
        user_type_id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true,
          },
          user_type: type.STRING
    })
}

