import { getCosts, postDeposits, postExits } from "../controllers/transactions.controller.js";
import {Router} from "express";
import {validateToken} from "../midlleware/validate.token.middleware.js";
const router = Router();
router.use(validateToken)
router.post("/deposit", postDeposits)

router.post("/exits", postExits)

router.get("/home", getCosts)

export default router;