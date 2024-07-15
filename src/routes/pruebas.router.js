import { Router } from "express";
import CategoryManager  from "../managers/categoryManager.js";

const categoryManager = new CategoryManager;
export const pruebasRouter = Router()

pruebasRouter.get('/', async (req,res) =>{
    try {
        const categories = await categoryManager.getAllCat()
            return res.json(categories)
    } catch (error) {
        console.log(error.message)
        return res.send(error.message)
    }
})

pruebasRouter.post('/', async (req,res) => {
    try {
        const categoryCreated = await categoryManager.insertOne(req.body);
        res.status(201).json({ status: true, payload: categoryCreated })
    } catch (error) {
        res.status(500).json({ status: false, error })
    }
})