import db from "../config/db.js";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";

export async function signUp(req, res) {
    const user = res.locals.user;
    const hashPassword = bcrypt.hashSync(user.password, 10);

    try {
        const existingUser = await db.collection("customers").findOne({ email: user.email });

        if (existingUser) {
            return res.status(409).send("Email já cadastrado")
        };

        await db.collection("customers").insertOne({ ...user, password: hashPassword });
        return res.status(201).send("Customer created");

    } catch (err) {
        console.log(err);
        return res.sendStatus(500);
    }
}
export async function signIn(req, res) {
    const user = res.locals.user;
    const token = uuidv4();

    try {
        const newSession = await db.collection("sessions").insertOne({ token, userId: user._id });
        res.send({ token, userId: user._id, userName: user.name });

    } catch (err) {
        return res.sendStatus(500);
    }
}