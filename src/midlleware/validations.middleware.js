import db from "../config/db.js";
import { newUserValidationSchema } from "../models/newUserSchema.js";
import { newTransactionSchema } from "../models/newTransactionSchema.js";
import bcrypt from "bcrypt";
import dayjs from "dayjs";

export function validateToken(req, res, next) {
    const { authorization } = req.headers;
    const token = authorization?.replace("Bearer ", "");

    if (!token) {
        return false;
    }

    next()
}
export function validateNewUser(req, res, next) {
    const user = req.body;
    const { error } = newUserValidationSchema.validate(user, { abortEarly: false });

    if (error) {
        const errors = error.details.map(detail => detail.message);
        return res.status(400).send(errors);
    }

    res.locals.user = user;
    next();
}
export async function validateLogin(req, res, next) {
    const { email, password } = req.body;

    try {
        const user = await db.collection("customers").findOne({ email });

        if (!user) {
            return res.sendStatus(401);
        }

        const checkPassword = bcrypt.compareSync(password, user.password);

        if (!checkPassword) {
            return res.sendStatus(401);
        }

        res.locals.user = user;
    }
    catch (err) {
        console.log(err);
        return res.sendstatus(500);
    }
    next();
}
export async function validateTokenForTransaction(req, res, next) {
    const { authorization } = req.headers;
    const token = authorization?.replace('Bearer ', '');

    if (!token) return res.sendStatus(401);

    try {
        const sessions = await db.collection("sessions").findOne({ token });


        if (!sessions) {
            return res.sendStatus(401);
        }

        const user = await db.collection("customers").findOne({ _id: sessions?.userId });

        if (!user) {
            return res.sendStatus(401);
        }

        res.locals.user = user;
    } catch (err) {
        console.log(err);
        return res.sendStatus(500);
    }
    next();
}
export async function validateTransaction(req, res, next) {
    const { type, value, description } = req.body;
    const user = res.locals.user;

    try {
        const transaction = {
            type,
            date: dayjs().format("DD/MM"),
            description,
            value,
            user: user._id,
        }
        const { error } = newTransactionSchema.validate(transaction, { abortEarly: false });
        if (error) {
            const errors = error.details.map(detail => detail.message);
            return res.status(400).send(errors);
        }

        res.locals.transaction = transaction;
    } catch (err) {
        console.log(err);
        return res.sendStatus(500);
    }

    next();
}