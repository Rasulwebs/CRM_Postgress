import sequelize from "../utils/sequelize.js";
import { DataTypes, literal } from "sequelize";

const DirectionsModel = sequelize.define(
    "directions",
    {
        dir_id : {
            type : DataTypes.INTEGER,
            primaryKey : true,
            autoIncrement : true
        },
        dir_name : {
            type : DataTypes.STRING(50),
            allowNull : false
        },
        duration : {
            type : DataTypes.INTEGER
        },
        salary : {
           type : DataTypes.INTEGER
        },
        start_date : {
            type : DataTypes.DATE,
            defaultValue : literal("CURRENT_TIMESTAMP")
        },
        end_date : {
            type : DataTypes.DATE
        }
    },
    {
        tableName : "directions",
        timestamps : false
    }
);


export default DirectionsModel;