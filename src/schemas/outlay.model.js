import sequelize from "../utils/sequelize.js";
import { DataTypes, Sequelize, literal } from "sequelize";


const OutlayModel = sequelize.define(
  "outlay",
  {
    outlay_id: {
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
    out_time: {
        type: DataTypes.DATE,
    },
  },
  {
    tableName: "outlay",
    timestamps: false,
  }
);

export default OutlayModel;
