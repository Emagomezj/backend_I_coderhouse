import { Router } from "express";
import { ProductManager } from "../controllers/productManager.js";

const productManager = new ProductManager;
export const productsRouter = Router()

productsRouter.get('/', async (req,res) => {
    try{
        const {limit} = req.query;
        const products = await productManager.getProducts();

        if(limit){
            const limitedProducts = products.slice(0,limit);
            return res.json(limitedProducts);
        } else {
            return res.json(products);
        }
    } catch (error){
        console.log(error);
        res.send(`Error al obtener: ${error}`)
    }
})

productsRouter.get('/:pid', async (req, res) => {
    try {
        const {pid} = req.params;
        const products = await productManager.getProductById(pid)
        return res.json(products)
    } catch (error) {
        console.log(error);
        res.send(`Error al obtener por ID: ${error}`);

    }
})

productsRouter.post('/', async (req,res)=> {
    try {
        const {title, description, price, thumbnail, code, stock, status = true, category} = req.body;
        const response = await productManager.addProduct({title, description, price, thumbnail, code, stock, status, category})
        res.json(response)
    } catch (error) {
        console.log(error);
        res.send(`Error al agregar: ${error}`);
    }
})

productsRouter.put('/:pid', (req,res) => {
    const {pid} = req.params
    try {
        const {title, description, price, thumbnail, code, stock, status, category} = req.body;
        const response = productManager.updateProduct(pid, {title, description, price, thumbnail, code, stock, status, category}) //revisar parametro id
        res.json(response)
    } catch (error) {
        console.log(error);
        res.send(`Error al editar: ${error}`);
    }
})

productsRouter.delete('/:pid', async (req, res) => {
    const {pid} = req.params
    try {
        await productManager.deleteProduct(pid) // Revisar parametro id
        res.send('Producto Eliminado')
    } catch (error) {
        console.log(error);
        res.send(`Error al eliminar: ${error}`);
    }
})
