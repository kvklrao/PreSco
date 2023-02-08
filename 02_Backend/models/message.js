import table_const from '../config/table'
module.exports = (sequelize, type) => {
  return sequelize.define(table_const.messages, {
    message_log_id: {
      type: type.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    sender: type.INTEGER,
    receiver: type.INTEGER ,
    message: type.STRING,
    is_read: type.INTEGER,
    createdBy:type.INTEGER,
    updatedBy:type.INTEGER,
    deleted_flag: type.INTEGER,
    deleted_date: type.STRING,
    active_flag:type.INTEGER
  });
};
