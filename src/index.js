import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import userRouter from "./routes/user.route.js";
import transactionRouter from "./routes/transaction.route.js";

const app = express();
dotenv.config();
app.use(cors());
app.use(express.json());
app.use(userRouter);
app.use(transactionRouter);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port}`))