const table_const = require('../config/table')

module.exports =(sequelize,type)=>{
    return sequelize.define(table_const.hospital_staff,{
        staff_hospital_id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true,
          },
          hospital_id:type.INTEGER,
          hospital_branch_id:type.INTEGER,
          staff_id:type.INTEGER,
          created_by:type.INTEGER,
          updated_by:type.INTEGER,
          deleted_flag:type.BOOLEAN,
          deleted_date:type.DATE,
          active_flag:type.BOOLEAN,
          permission_id:type.INTEGER
    })
}


