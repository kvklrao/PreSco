const table_const = require('../config/table')

module.exports =(sequelize,type)=>{
    return sequelize.define(table_const.speciality,{
        speciality_id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true,
          },
          speciality:type.STRING,
          created_by:type.INTEGER,
          updated_by:type.INTEGER,
          deleted_flag:type.BOOLEAN,
          deleted_date:type.DATE,
          active_flag:type.BOOLEAN
    })
}



