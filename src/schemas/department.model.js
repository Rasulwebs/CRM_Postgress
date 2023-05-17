import sequelize from "../utils/sequelize.js";
import { DataTypes, literal } from "sequelize";

const DepartmentsModel = sequelize.define(
    "departments",
    {
        dep_id : {
            type : DataTypes.INTEGER,
            primaryKey : true,
            autoIncrement : true
        },
        dep_name  : {
            type : DataTypes.STRING,
            allowNull : false
        },
        create_at : {
        type : DataTypes.DATE,
        defaultValue : literal("CURRENT_TIMESTAMP")
        },
       delete_at : {
        type : DataTypes.DATE
       }
      
    },
    {
        tableName : "departments",
        timestamps : false
    }
);


export default DepartmentsModel;