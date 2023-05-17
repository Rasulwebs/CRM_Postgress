import sequelize from "../utils/sequelize.js";
import { DataTypes } from "sequelize";

const CenterModel = sequelize.define(
    "centers",
    {
        cen_id : {
            type : DataTypes.INTEGER,
            primaryKey : true,
            autoIncrement : true
        },
        name : {
            type : DataTypes.STRING(50),
            allowNull : false
        },
        address : {
            type : DataTypes.STRING(130),
            validate : {
                len : {
                    args : [3, 50],
                    msg : "Addressning uzunligi xato!"
                }
            }
        },
        open_date : {
            type : DataTypes.DATE
        },
        close_date : {
            type : DataTypes.DATE
        }
    },
    {
        tableName : "centers",
        timestamps : false
    }
);


export default CenterModel;