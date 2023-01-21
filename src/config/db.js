import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const mongoClient = new MongoClient(process.env.DATABASE_URL);
let db;
try {
    await mongoClient.connect();
    db = mongoClient.db();
    console.log("Mongo is connected");
} catch (err) {
    console.log("Mongo isn't connected");
    console.log(err.message)
}
export default db;