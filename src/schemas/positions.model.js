import sequelize from "../utils/sequelize.js";
import { DataTypes } from "sequelize";

const PositionModel = sequelize.define(
    "positions",
    {
        pos_id : {
            type : DataTypes.INTEGER,
            primaryKey : true,
            autoIncrement : true
        },
        pos_name : {
            type : DataTypes.STRING(50),
            allowNull : false,
            unique : true
        },
        salary : {
            type : DataTypes.INTEGER
        }
    },
    {
        tableName : "positions",
        timestamps : false
    }
);


export default PositionModel;