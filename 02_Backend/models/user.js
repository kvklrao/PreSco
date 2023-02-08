const table_const = require('../config/table')

module.exports =(sequelize,type)=>{
    return sequelize.define(table_const.user ,{
        user_id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true,
          },
          user_name: type.STRING,
          city:type.STRING,
          address:type.STRING,
          state:type.STRING,
          pincode:type.STRING,
          user_type_id:type.INTEGER,
          password:type.STRING,
          contact_number:type.BIGINT,
          email_address:type.STRING,
          parent_user_id:type.BIGINT,
          created_by:type.INTEGER,
          updated_by:type.INTEGER,
          deleted_flag:type.BOOLEAN,
          deleted_date:type.DATE,
          active_flag:type.BOOLEAN,
          passcode:type.STRING
    })
}

