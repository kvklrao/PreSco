const table_const = require('../config/table')

module.exports =(sequelize,type)=>{
    return sequelize.define(table_const.hospital_branch ,{
        hospital_branch_id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true,
          },
          branch_name: type.STRING,
          user_id:type.INTEGER,
          hospital_id:type.INTEGER,
          contact_person:type.STRING,
          created_by:type.INTEGER,
          updated_by:type.INTEGER,
          deleted_flag:type.INTEGER,
          deleted_date:type.DATE,
          active_flag:type.INTEGER
    })
}



