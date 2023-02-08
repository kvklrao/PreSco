const table_const = require('../config/table')

module.exports =(sequelize,type)=>{
    return sequelize.define(table_const.hospital ,{
        hospital_id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true,
          },
          hospital_name: type.STRING,
          user_id:type.INTEGER,
          created_by:type.INTEGER,
          updated_by:type.INTEGER,
          deleted_flag:type.BOOLEAN,
          deleted_date:type.DATE,
          active_flag:type.BOOLEAN
    })
}



