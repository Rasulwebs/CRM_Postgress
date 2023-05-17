import sequelize from "../utils/sequelize.js";
import { DataTypes, Sequelize, literal } from "sequelize";


const GroupsModel = sequelize.define(
  "groups",
  {
    gr_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    gr_number: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    begin_date: {
      type: DataTypes.DATE,
      defaultValue: literal("CURRENT_TIMESTAMP"),
    },
    end_date: {
      type: DataTypes.DATE,
    },
  },
  {
    tableName: "groups",
    timestamps: false,
  }
);

export default GroupsModel;
