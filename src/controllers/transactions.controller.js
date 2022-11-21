import { newTransactionSchema } from "../schemas/newValueSchema.js";
import { collectionCustomers, collectionSessions, collectionTransactions } from "../database/db.js";
import dayjs from "dayjs";

export async function postDeposits(req, res) {
    const newDeposit = req.body;
    console.log(newDeposit)

    //const token = getToken(req, res)

    const date = dayjs().format("DD/MM")
    console.log(date)
    try {
        const sessions = await collectionSessions.findOne({ token });
        const user = await collectionCustomers.findOne({ _id: sessions.userId });

        console.log(user);

        const { error } = newTransactionSchema.validate(newDeposit, { abortEarly: false });

        if (error) {
            const errors = error.details.map((detail) => detail.message);
            return res.status(422).send(errors);
        }
        const depositToDB = {
            token: sessions,
            userID: user,
            description: newDeposit.description,
            cost: newDeposit.cost,
            type: deposit,
            date: dayjs().format("DD/MM")
        }
        await collectionTransactions.insertOne(depositToDB);

        res.sendStatus(201);
    } catch (error) {
        console.log(error)
        return res.sendStatus(500)
    }
}
export async function postExits(req, res) {
    const newExit = req.body;
   // const token = getToken(req, res)
    console.log(newExit)

    const date = dayjs().format("DD/MM")
    console.log(date)
    try {
        const sessions = await collectionSessions.findOne({ token });
        const user = await collectionCustomers.findOne({ _id: sessions.userId });

        console.log(user);

        const { error } = newTransactionSchema.validate(newExit, { abortEarly: false });

        if (error) {
            const errors = error.details.map((detail) => detail.message);
            return res.status(422).send(errors);
        }
        const exitToDB = {
            description: newExit.description,
            cost: newExit.cost,
            type: "Exit",
            date: dayjs().format("DD/MM")
        }
        await collectionTransactions.insertOne(exitToDB);

        res.sendStatus(201);
    } catch (error) {
        console.log(err)
        return res.sendStatus(500)
    }
}
export async function getCosts(req, res) {
   // const token = getToken(req, res);
   const { user } = req.headers;
   try {
     const transactions = await collectionTransactions.find({$or: [{ from: user }]}).toArray();
 
     if (transactions.length === 0) {
       return res.status(404).send("Não foi encontrada nenhuma entrada e saída!");
     } 
     res.send(transactions);
   } catch (err) {
     console.log(err);
     res.sendStatus(500);
   }
}