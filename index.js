import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { MongoClient } from "mongodb";
import joi from "joi";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";

const app = express();
dotenv.config();
app.use(cors());
app.use(express.json());

const newUserSchema = joi.object({
    name: joi.string().required().min(3),
    email: joi.string().email().required().min(10),
    password: joi.string().required().min(4)
})
const newValueSchema = joi.object({
    description: joi.string().required().min(3),
    value: joi.number().required()
})
const mongoClient = new MongoClient("mongodb://localhost:27017");
try {
    await mongoClient.connect()
} catch (err) {
    console.log(err.message)
}
let db;
db = mongoClient.db('databankp14')
const collectionCustomers = db.collection("customers")
const collectionSessions = db.collection("sessions")
const collectionTransactions = db.collection("transactions")

app.post("/sign-up", async (req, res) => {
    const newUser = req.body;
    console.log(newUser)

    try {
        const existingUser = await collectionCustomers.findOne({ email: newUser.email });
        if (existingUser) {
            return res.sendStatus(409)
        }
        const { error } = newUserSchema.validate(newUser, { abortEarly: false })
        if (error) {
            const errors = error.details.map((detail) => detail.message);
            res.status(400).send(errors);
        }

        const hashPassword = bcrypt.hashSync(newUser.password, 10);

        await collectionCustomers.insertOne({ ...newUser, password: hashPassword })
        res.sendStatus(201)
    } catch (err) {
        res.sendStatus(500)
    }
})

app.post("/sign-in", async (req, res) => {
    const { email, password } = req.body
    console.log(email)
    console.log(password)
    const token = uuidv4();
    console.log(token)
    try {
        const checkUser = await collectionCustomers.findOne({ email })
        if (!checkUser) {
            return res.sendStatus(401);
        }
        const checkPassword = bcrypt.compareSync(password, checkUser.password)
        if (!checkPassword) {
            return res.sendStatus(401)
        }

    } catch (err) {
        res.sendStatus(500)
    }
    await collectionSessions.insertOne({ token, userID: checkUser._iD, email: checkUser.email, name: checkUser.name })
    res.send({ token })
})

app.post("/deposit", async (req, res) => {
    const newDeposit = req.body;
    console.log(newDeposit)
    const { authorization } = req.headers;
    const token = authorization?.replace("Bearer ", "");
    if (!token) {
        return res.sendStatus(401);
    }
    const date = dayjs().format("DD/MM")
    console.log(date)
    try {
        const sessions = await collectionSessions.findOne({ token });
        const user = await collectionCustomers.findOne({ _id: sessions.userId });

        console.log(user);

        const { error } = newValueSchema.validate(newDeposit, { abortEarly: false });

        if (error) {
            const errors = error.details.map((detail) => detail.message);
            return res.status(422).send(errors);
        }
        const depositToDB = {
            token: sessions,
            userID: user,
            description: newDeposit.description,
            value: newDeposit.value,
            type: deposit,
            date: dayjs().format("DD/MM")
        }
        await collectionTransactions.insertOne(depositToDB);

        res.sendStatus(201);
    } catch (error) {
        console.log(err)
        return res.sendStatus(500)
    }
})

app.post("/exits", async (req, res) => {
    const newExit = req.body;
    const { authorization } = req.headers;
    console.log(newExit)
    const token = authorization?.replace("Bearer ", "");
    if (!token) {
        return res.sendStatus(401);
    }
    const date = dayjs().format("DD/MM")
    console.log(date)
    try {
        const sessions = await collectionSessions.findOne({ token });
        const user = await collectionCustomers.findOne({ _id: sessions.userId });

        console.log(user);

        const { error } = newValueSchema.validate(newExit, { abortEarly: false });

        if (error) {
            const errors = error.details.map((detail) => detail.message);
            return res.status(422).send(errors);
        }
        const exitToDB = {
            description: newExit.description,
            value: newExit.value,
            type: "Exit",
            date: dayjs().format("DD/MM")
        }
        await collectionTransactions.insertOne(exitToDB);

        res.sendStatus(201);
    } catch (error) {
        console.log(err)
        return res.sendStatus(500)
    }
})
app.get("/home", async (req, res) => {
    const { authorization } = req.headers;

  const token = authorization?.replace("Bearer ", "");
  if (!token) {
    return res.sendStatus(401);
  }

  try {
    const transactions = await collectionTransactions.find().toArray();
    res.send(transactions);
  } catch (err) {
    res.sendStatus(500);
  }
})
app.listen("5000", () => console.log("Server running on port 5000"))