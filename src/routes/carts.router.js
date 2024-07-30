import { Router } from "express";
import { CartManager } from "../managers/cartManager.js";
import {
    ERROR_INVALID_ID,
    ERROR_NOT_FOUND_ID
} from "../constants/messages.constant.js";

const cartManager = new CartManager;
export const cartsRouter = Router();

const errorHandler = (res, message) => {
    if (message === ERROR_INVALID_ID) return res.status(400).json({ status: false, message: ERROR_INVALID_ID });
    if (message === ERROR_NOT_FOUND_ID) return res.status(404).json({ status: false, message: ERROR_NOT_FOUND_ID });
    return res.status(500).json({ status: false, message });
};

//Nuevo carrito
cartsRouter.get('/', async (req,res) => {
    try {
        const response = await cartManager.getCarts()
        res.status(200).json({status:true,payload:response})
    } catch (error) {
        errorHandler(res,error.message)
    }
})

cartsRouter.post('/:uid', async (req,res) => {
    try {
        const response = await cartManager.newCart(req.params.uid)
        res.status(200).json({status:true, payload:response})
    } catch (error) {
        errorHandler(res, error.message);
    }
})

cartsRouter.get('/:cid', async (req,res) => {
    const {cid} = req.params;
    try {
        const response = await cartManager.getCartById(cid)
        res.status(200).json({status:true, payload: response})
    } catch (error) {
        errorHandler(res, error.message);
    }
})

cartsRouter.put('/:cid/add/:pid', async (req, res) => {
    const {cid,pid} = req.params;
    try {
        const response = await cartManager.addProductToCart(cid, pid,req.body.quantity);
        res.status(200).json({status:true, payload: response})
    } catch (error) {
        errorHandler(res, error.message);
    }
})

cartsRouter.put('/:cid/remove/:pid', async (req,res) => {
    const {cid,pid} = req.params;
    try {
        const response = await cartManager.removeProduct(cid,pid,req.body.quantity)
        res.status(200).json({status:true, payload: response})
    } catch (error) {
        errorHandler(res, error.message);
    }
})

cartsRouter.put('/:cid/delete/:pid',async (req,res) => {
    const {cid,pid} = req.params
    try {
        const response = await cartManager.deleteProduct(cid,pid);
        res.status(200).json({status:true, payload: response});
    } catch (error) {
        errorHandler(res, error.message);
    }
})

cartsRouter.put('/:cid/updateQuantity/:pid', async (req,res) => {
    const {cid, pid} = req.params
    try {
        const response = await cartManager.updateQuantity(cid,pid,req.body.quantity)
        res.status(200).json({status:true, payload: response})
    } catch (error) {
        errorHandler(res, error.message);
    }
})

cartsRouter.put('/flush/:cid',async (req,res) => {
    try {
        const response = await cartManager.flushCart(req.params.cid);
        res.status(200).json({status:true,payload:response})
    } catch (error) {
        errorHandler(res, error.message);
    }
})

cartsRouter.delete('/:cid', async (req,res) => {
    try {
        const response = await cartManager.deleteCart(req.params.cid,req.query.user);
        res.status(200).json({status:true, payload: response})
    } catch (error) {
        errorHandler(res, error.message);
    }
})