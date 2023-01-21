import { getAllTransactions, newTransaction } from "../controllers/transactions.controller.js";
import {Router} from "express";
import {validateTokenForTransaction, validateTransaction,} from "../midlleware/validations.middleware.js";

const router = Router();

router.post("/transactions", validateTokenForTransaction, validateTransaction, newTransaction);

router.get("/transactions", validateTokenForTransaction, getAllTransactions);

export default router;