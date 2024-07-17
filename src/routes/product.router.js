import { Router } from "express";
import { ProductManager } from "../managers/productManager.js";
import {ERROR_INVALID_ID,ERROR_NOT_FOUND_ID} from "../constants/messages.constant.js"
import uploader from "../utils/uploader.js";

const productManager = new ProductManager;
export const productsRouter = Router()

const errorHandler = (res, message) => {
    if (message === ERROR_INVALID_ID) return res.status(400).json({ status: false, message: ERROR_INVALID_ID });
    if (message === ERROR_NOT_FOUND_ID) return res.status(404).json({ status: false, message: ERROR_NOT_FOUND_ID });
    return res.status(500).json({ status: false, message });
};

productsRouter.get('/', async (req,res) => {
    try{
        const productsFound = await productManager.getProducts(req.query);

        res.status(200).json({ status: true, payload: productsFound });
    } catch (error){
        errorHandler(res, error.message);
    }
});

productsRouter.get('/:pid', async (req, res) => {
    try {
        const {pid} = req.params;
        const products = await productManager.getProductById(pid)
        return res.json(products)
    } catch (error) {
        console.log(error);
        errorHandler(res, error.message);

    }
});

productsRouter.post("/", uploader.single("file"), async (req, res) => {
    try {
        const { file } = req;
        const productCreated = await productManager.addProduct(req.body, file);
        res.status(201).json({ status: true, payload: productCreated });
    } catch (error) {
        errorHandler(res, error.message);
    }
});

productsRouter.put("/:id", uploader.single("file"), async (req, res) => {
    try {
        const { file } = req;
        const productUpdated = await productManager.updateOneById(req.params.id, req.body.categories, file);
        res.status(200).json({ status: true, payload: productUpdated });
    } catch (error) {
        errorHandler(res, error.message);
    }
});

productsRouter.put("/:id/add", async (req,res) => {
    try {
        const productUpdated = await productManager.addCategoriesToProduct(req.params.id,req.body.categories);
        res.status(200).json({status: true, payload: productUpdated})
    } catch (error) {
        res.send(error.message);
    }
});

productsRouter.put("/:id/remove", async (req,res) => {
    try {
        const productUpdated = await productManager.removeCategoryFromProduct(req.params.id,req.body.categories);
        res.status(200).json({status: true, payload: productUpdated})
    } catch (error) {
        res.send(error.message)
    }
});

productsRouter.delete('/:pid', async (req, res) => {
    try {
        const productDeleted = await productManager.deleteOneById(req.params.id);
        res.status(200).json({ status: true, payload: productDeleted });
    } catch (error) {
        errorHandler(res, error.message);
    }
});
