import table_const from '../config/table'
module.exports = (sequelize, type) => {
  return sequelize.define(table_const.docters, {
    id: {
      type: type.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    first_name: type.STRING,
    last_name: type.STRING,
    email: type.STRING,
    username: {
      type: type.STRING,
      allowNull: false,
    },
    password: {
      type: type.STRING,
      allowNull: false,
    },
    hospital_name: type.STRING,
    hospital_branch_name: type.STRING,
    user_type: type.INTEGER
  });
};
