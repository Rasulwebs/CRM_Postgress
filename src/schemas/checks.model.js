import sequelize from "../utils/sequelize.js";
import { DataTypes , literal} from "sequelize";

const ChecksModel = sequelize.define(
    "checks",
    {
        check_id : {
            type : DataTypes.INTEGER,
            primaryKey : true,
            autoIncrement : true
        },
        not_in_class : DataTypes.ARRAY(DataTypes.INTEGER),
        add_date : {
            type : DataTypes.DATE,
            defaultValue : literal("CURRENT_TIMESTAMP")
        }
    },
    {
        tableName : "checks",
        timestamps : false
    }
);


export default ChecksModel;