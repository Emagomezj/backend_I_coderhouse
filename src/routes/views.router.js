import { Router } from "express";
import { ProductManager } from "../managers/productManager.js";

export const homeRouter = Router();
const pM = new ProductManager

homeRouter.get("/", async (req, res) => {
    try {
        const products = await pM.getProducts(req.query);
        console.log(products)
        return res.status(200).render("home", {
            title: "Products",
            products: products,
        });
    } catch (error) {
        res.status(500).send(error.message);
    }
});

homeRouter.get("/realtimeproducts", async (req, res) => {
    try {
        const products = await pM.getProducts(req.query);
        return res.status(200).render("realTimeProducts", {
            title: "products",
            products: products,
        });
    } catch (error) {
        res.status(500).send(error.message);
    }
});