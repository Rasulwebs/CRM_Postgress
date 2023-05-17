import { Router } from "express";
import adminRouter from "./admin/routes/router.js";
import userRouter from "./user/routes/router.js";


const indexRouter = Router();

indexRouter.use(adminRouter);
indexRouter.use(userRouter);



export default indexRouter;


