import { Router } from "express";
import { CartManager } from "../managers/cartManager.js";

const cartManager = new CartManager;
export const cartsRouter = Router();

//Nuevo carrito

cartsRouter.post('/', async (req,res) => {
    try {
        const response = await cartManager.newCart()
        res.json(response)
    } catch (error) {
        res.send(`Error al crear carrito: ${error}`)
    }
})

cartsRouter.get('/:cid', async (req,res) => {
    const {cid} = req.params;
    try {
        const response = await cartManager.getCartProducts(cid)
        res.json(response)
    } catch (error) {
        res.send(`Error al buscar carrito: ${error}`)
    }
})

cartsRouter.post('/:cid/products/:pid', async (req, res) => {
    const {cid,pid} = req.params;
    try {
        await cartManager.addProductCart(cid, pid);
        res.send('Producto agregado');
    } catch (error) {
        res.send(`Error al agregar producto: ${error}`)
    }
})
