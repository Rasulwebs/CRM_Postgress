import CenterModel from "../schemas/center.model.js";
import DepartmentsModel from "../schemas/department.model.js";
import DirectionsModel from '../schemas/directions.model.js'
import PositionModel from '../schemas/positions.model.js'
import GroupsModel from '../schemas/groups.model.js'
import UsersModel from '../schemas/user.model.js'
import ChecksModel from '../schemas/checks.model.js'
import IncomesModel from '../schemas/incomes.model.js'
import OutlayModel from '../schemas/outlay.model.js'

 
CenterModel.hasMany(DepartmentsModel, {foreignKey :  "center_ref_id", onDelete : "CASCADE"});
DepartmentsModel.hasMany( DirectionsModel, {foreignKey : "dep_ref_id", onDelete : "CASCADE"})
DepartmentsModel.hasMany(PositionModel, {foreignKey : "dep_ref_id", onDelete: "CASCADE"});
DirectionsModel.hasMany(GroupsModel, {foreignKey : "dir_ref_id", onDelete : "CASCADE"});
GroupsModel.hasMany(UsersModel, {foreignKey : "group_ref_id" });
PositionModel.hasMany(UsersModel, {foreignKey : "pos_ref_id", onUpdate : "CASCADE"},)
GroupsModel.hasMany(ChecksModel, {foreignKey : "gr_ref_id", onDelete : "CASCADE"});
UsersModel.hasMany(ChecksModel, {foreignKey : "user_ref_id", onDelete : "CASCADE"});
UsersModel.hasMany(IncomesModel, {foreignKey : "user_ref_id", onUpdate : "CASCADE"} )
 


export default {CenterModel, DepartmentsModel, DirectionsModel, PositionModel, UsersModel,IncomesModel, ChecksModel, GroupsModel, OutlayModel}