import { Router } from "express"
import { userLogin } from "../login/login.js"
import { addCheckForOnlyTeacher, addIncomesForOnlyAccountant, addOutlayForOnlyAccountant, getGroups, getIncomesForOnlyAccountant, getOutlayForOnlyAccountant, getUsers, UptadeCheckForTeacher, UptadeIncomes, UptadeOutlay } from "../controller/position.check.contr.js"
const userRouter = Router();


// get methods
userRouter.get('/users',getUsers )
userRouter.get('/groups', getGroups)
userRouter.get('/incomes', getIncomesForOnlyAccountant)
userRouter.get('/outlay',getOutlayForOnlyAccountant )



// post methods
userRouter.post('/login', userLogin) 
userRouter.post('/incomes', addIncomesForOnlyAccountant)
userRouter.post('/outlay', addOutlayForOnlyAccountant)
userRouter.post('/check', addCheckForOnlyTeacher)


// put methods
userRouter.put('/incomes/:id', UptadeIncomes)
userRouter.put('/outlay/:id', UptadeOutlay)
userRouter.put('/check/:id', UptadeCheckForTeacher)



export default userRouter;