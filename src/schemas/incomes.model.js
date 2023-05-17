import sequelize from "../utils/sequelize.js";
import { DataTypes, Sequelize, literal } from "sequelize";


const IncomesModel = sequelize.define(
  "incomes",
  {
    incom_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    reason: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    amount: {
      type: DataTypes.INTEGER,
    },
    inc_time: {
        type: DataTypes.DATE,
    },
  },
  {
    tableName: "incomes",
    freezeTableName : true,
    timestamps: false,
  }
);

export default IncomesModel;
