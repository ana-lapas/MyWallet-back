import db from "../config/db.js";

export async function newTransaction(req, res) {
    const transaction = res.locals.transaction;

    try {
        await db.collection("transactions").insertOne(transaction);
        return res.sendStatus(201);
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
}

export async function getAllTransactions(req, res) {
    const user = res.locals.user;

    try {
        const transactions = await db.collection("transactions").find({user: user._id}).toArray();
        delete user.password;
        return res.send({transactions, user});
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
}