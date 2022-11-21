import { postSignIn, postSignUp } from "../controllers/customers.controller.js";
import {Router} from "express";

const router = Router();

router.post("/sign-up", postSignUp)

router.post("/sign-in", postSignIn)

export default router;