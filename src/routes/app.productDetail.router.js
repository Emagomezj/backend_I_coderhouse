import { Router } from "express";
import { ProductManager } from "../managers/productManager.js";

export const appProductRouter = Router();
const pM = new ProductManager


appProductRouter.get("/:id", async (req,res) => {
    try {
        const product = await pM.getProductById(req.params.id)
        return res.status(200).render("productDetail",{
            title: product._id,
            product: product
        })
    } catch (error) {
        res.status(500).send(error.message);
    }
})