import { Router } from "express";
import { CartManager } from "../managers/cartManager.js";
import mongoose from "mongoose";
import { ProductManager } from "../managers/productManager.js";

const appCartRouter = Router();
const cM = new CartManager;
const pM = new ProductManager;

appCartRouter.get('/:id', async (req,res) => {
    try {
        const cart = await cM.getCartById(req.params.id);
        return res.status(200).render("cartAdmin",{
            cart
        })
    } catch (error) {
        res.status(500).send(error.message);
    }
})

appCartRouter.get('/:cid/add/:pid',async (req,res) => {
    try {
        const {cid,pid} = req.params;
        const cart = await cM.getCartById(cid);
        let cartProduct
        const cartProductValid = cart.products.find(product => product.product._id == pid)
        if(!cartProductValid){
            const product = await pM.getProductById(pid)
            cartProduct = {product:{
                stock: product.stock,
                title: product.title
            },quantity: "Ninguno"}
            return res.status(200).render("addProduct",{
                cart,
                cartProduct
            });
        }
        cartProduct = cartProductValid
        return res.status(200).render("addProduct",{
            cart,
            cartProduct
        })
    } catch (error) {
        res.status(500).send(error.message);
    }
})

appCartRouter.get('/:cid/dis/:pid',async (req,res) => {
    try {
        const {cid,pid} = req.params;
        const cart = await cM.getCartById(cid);
        const cartProduct = cart.products.find(product => product.product._id == pid)
        return res.status(200).render("disProduct",{
            cart,
            cartProduct
        })
    } catch (error) {
        res.status(500).send(error.message)
    }
})

appCartRouter.get('/:cid/del/:pid', async(req,res) => {
    try{
        const {cid,pid} = req.params;
        const cart = await cM.getCartById(cid);
        const cartProduct = cart.products.find(product => product.product._id == pid)
        return res.status(200).render("delProduct",{
            cart,
            cartProduct
        })
    } catch{
        res.status(300).send(error.message)
    }
})

export default appCartRouter;