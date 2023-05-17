import { Router } from "express";
import { AdminLogin, passCode } from "../login/login.admin.js";
import { checkAdmin } from "../../../middlewares/check.admin.js";
import { AdminController } from "../controller/controllers.js";
import { getGroups, getUsers } from "../../user/controller/position.check.contr.js";

const adminRouter = Router();

// get methods
adminRouter.post("/admin/login", AdminLogin);
adminRouter.get("/pass/code", passCode);

adminRouter.get("/departments", checkAdmin, AdminController.getAllDepartment);
adminRouter.get("/department", checkAdmin, AdminController.getAllDepartment);

adminRouter.get(
  "/department/:params",
  checkAdmin,
  AdminController.getDepartmentsParams
);
adminRouter.get(
  "/departments/:params",
  checkAdmin,
  AdminController.getDepartmentsParams
);

adminRouter.get(
  "/department/directions/:id",
  checkAdmin,
  AdminController.getDirectionsByID
);

adminRouter.get(
  "/department/positions/:id",
  checkAdmin,
  AdminController.getPositionsById
);

adminRouter.get("/groups", getGroups);
adminRouter.get("/groups/:id", getGroups);

adminRouter.get("/users", getUsers);

// post methods
adminRouter.post('/department', checkAdmin, AdminController.addDepartment);
adminRouter.post('/directions', checkAdmin, AdminController.addDirections);
adminRouter.post('/positions', checkAdmin, AdminController.addPosition);
adminRouter.post('/groups', checkAdmin, AdminController.addGroup);
adminRouter.post('/users', checkAdmin, AdminController.addUser);



// put methods
adminRouter.put('/department/:id', checkAdmin, AdminController.UpdateDepartment);
adminRouter.put('/directions/:id', checkAdmin, AdminController.updateDirections);
adminRouter.put('/positions/:id', checkAdmin, AdminController.updatePositions);
adminRouter.put('/groups/:id', checkAdmin, AdminController.updateGroup);
adminRouter.put('/users/:id', checkAdmin, AdminController.updateUsers);



// delete methods
adminRouter.delete('/department/:id', checkAdmin, AdminController.deleteDepartment);
adminRouter.delete('/directions/:id', checkAdmin, AdminController.deleteDirections);
adminRouter.delete('/positions/:id', checkAdmin, AdminController.deletePositions);
adminRouter.delete('/groups/:id', checkAdmin, AdminController.deleteGroups)
adminRouter.delete('/users/:id', checkAdmin, AdminController.deleteUsers);


export default adminRouter;
