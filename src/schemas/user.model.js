import sequelize from "../utils/sequelize.js";
import { DataTypes , literal} from "sequelize";

const UsersModel = sequelize.define(
    "users",
    {
        user_id : {
            type : DataTypes.INTEGER,
            primaryKey : true,
            autoIncrement : true
        },
        first_name : {
            type : DataTypes.STRING(50),
            allowNull : false
        },
        last_name : {
            type : DataTypes.STRING(50),
            allowNull : false
        },
        gender : {
            type : DataTypes.INTEGER,
            allowNull : false
        },
        contact : {
           type : DataTypes.STRING,
          unique :{
            args : true,
            msg : "This contact already exists"
          },
           validate : {
            is : {
                args : /^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/,
                msg : "Contactda xatolik"
            }
           }
        },
        email : {
            type : DataTypes.STRING,
            unique :{
                args : true,
                msg : "This email already exists"
            },
            validate :{
                isEmail : {msg: "It must be a valid Email address"}
            }
        },
        come_date : {
            type : DataTypes.DATE,
            defaultValue : literal("CURRENT_TIMESTAMP")
        },
        left_date : {
            type : DataTypes.DATE
        },
       
        },
    {
        tableName : "users",
        timestamps : false
    }
);


export default UsersModel;