import { signIn, signUp } from "../controllers/customers.controller.js";
import {Router} from "express";
import { validateNewUser, validateLogin } from "../midlleware/validations.middleware.js";

const router = Router();

router.post("/signUp", validateNewUser, signUp)

router.post("/signIn", validateLogin, signIn)

export default router;