import { Router } from "express";
import UserManager from "../managers/userManager.js";
import {
    ERROR_INVALID_ID,
    ERROR_NOT_FOUND_ID
} from "../constants/messages.constant.js";
import uploader from "../utils/uploader.js";

const userManager = new UserManager;
export const usersRouter = Router();

const errorHandler = (res, message) => {
    if (message === ERROR_INVALID_ID) return res.status(400).json({ status: false, message: ERROR_INVALID_ID });
    if (message === ERROR_NOT_FOUND_ID) return res.status(404).json({ status: false, message: ERROR_NOT_FOUND_ID });
    return res.status(500).json({ status: false, message });
};


usersRouter.get('/',async (req,res) => {
    try {
        const response = await userManager.getAll()
        res.status(200).json({status:true,payload:response})
    } catch (error) {
        errorHandler(res,error.message)
    }
});

usersRouter.get('/:id',async (req,res) => {
    try {
        const response = await userManager.getOneById(req.params.id)
        res.status(200).json({status:true,payload:response})
    } catch (error) {
        errorHandler(res,error.message)
    }
});

usersRouter.delete('/:id/deleteallcarts', async (req,res)=>{
    try {
        const response = await userManager.deleteAllCarts(req.params.id);
        res.status(200).json({status:true,payload: response});
    } catch (error) {
        errorHandler(res,error.message)
    }
})

usersRouter.post('/', uploader.single("file"), async (req,res) => {
    try {
        const { file } = req;
        const newUser = await userManager.insertOne(req.body,file);
        res.status(201).json({ status: true, payload: newUser });
    } catch (error) {
        errorHandler(res,error.message);
    }
});

usersRouter.put('/', uploader.single("file"), async (req,res) => {
    try {
        const { file } = req;
        const userUpdated = await userManager.updateOneById(req.params.id, req.body, file);
        res.status(200).json({ status: true, payload: userUpdated });
    } catch (error) {
        errorHandler(res,error.message);
    }
});

usersRouter.delete('/:id', async (req,res) => {
    try {
        const userDeleted = await userManager.deleteOneById(req.params.id);
        res.status(200).json({status:true,payload:userDeleted});
    } catch (error) {
        errorHandler(res,error.message);
    }
});

usersRouter.put('/:uid/remove/:cid', async (req,res) => {
    try {
        const userUpdated = await userManager.deleteSingleCart(req.params.uid,req.params.cid)
        res.status(200).json({status:true,payload: userUpdated});
    } catch (error) {
        errorHandler(res,error.message)
    }
})