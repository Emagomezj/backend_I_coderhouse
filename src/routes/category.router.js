import { Router } from "express";
import { ERROR_INVALID_ID, ERROR_NOT_FOUND_ID } from "../constants/messages.constant.js";
import CategoryManager  from "../managers/categoryManager.js";

const categoryManager = new CategoryManager;
export const categoryRouter = Router()

const errorHandler = (res, message) => {
    if (message === ERROR_INVALID_ID) return res.status(400).json({ status: false, message: ERROR_INVALID_ID });
    if (message === ERROR_NOT_FOUND_ID) return res.status(404).json({ status: false, message: ERROR_NOT_FOUND_ID });
    return res.status(500).json({ status: false, message });
};

categoryRouter.get('/', async (req,res) =>{
    try {
        const categories = await categoryManager.getAllCat()
            return res.json(categories)
    } catch (error) {
        errorHandler(res, error.message);
    }
})

categoryRouter.post('/', async (req,res) => {
    try {
        const categoryCreated = await categoryManager.insertOne(req.body);
        res.status(201).json({ status: true, payload: categoryCreated })
    } catch (error) {
        errorHandler(res, error.message);
    }
})

categoryRouter.delete('/:pid', async (req,res) => {
    try {
        const categoryDeleted = await categoryManager.deleteOne(req.params.pid);
        res.status(200).json({status: true, payload: categoryDeleted})
    } catch (error) {
        errorHandler(res, error.message);
    }
})