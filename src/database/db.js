import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const mongoClient = new MongoClient(process.env.MONGO_URI);
try {
    await mongoClient.connect()
} catch (err) {
    console.log(err.message)
}
let db;
db = mongoClient.db('databankp14')
export const collectionCustomers = db.collection("customers")
export const collectionSessions = db.collection("sessions")
export const collectionTransactions = db.collection("transactions")
