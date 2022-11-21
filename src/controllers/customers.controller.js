import {newUserValidationSchema} from "../schemas/newUserSchema.js";
import {collectionCustomers, collectionSessions} from "../database/db.js";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";

export async function postSignUp (req, res){
    const newUser = req.body;
    console.log(newUser)

    try {
        const existingUser = await collectionCustomers.findOne({ email: newUser.email });
        if (existingUser) {
            return res.sendStatus(409)
        }
        const { error } = newUserValidationSchema.validate(newUser, { abortEarly: false })
        if (error) {
            const errors = error.details.map((detail) => detail.message);
            res.status(400).send(errors);
        }

        const hashPassword = bcrypt.hashSync(newUser.password, 10);
        console.log("Ver o q está sendo criado")
        const test2 = { ...newUser, password: hashPassword }
        console.log(test2)
        await collectionCustomers.insertOne({ ...newUser, password: hashPassword })
        res.sendStatus(201)
    } catch (err) {
        res.sendStatus(500)
    }
}
export async function postSignIn (req, res){
    const {email, password} = req.body
    console.log(req.body)
    const token = uuidv4();
    console.log(token)
    try {
        const checkUser = await collectionCustomers.findOne({ email });
        console.log(checkUser)
        if (!checkUser) {
            return res.sendStatus(401);
        }
                
        const checkPassword = bcrypt.compareSync(password, checkUser.password)
        if (!checkPassword) {
            return res.sendStatus(401)
        }
        const teste = { token, userID: ObjectId(checkUser._id), email, name: checkUser.name }
        console.log(teste)
        await collectionSessions.insertOne({ token, userID: checkUser._iD, email, name: checkUser.name })
    } catch (err) {
        res.sendStatus(500)
    }
    
    res.send({ token })
}