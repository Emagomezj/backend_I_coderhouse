import { Router } from "express";
import { ProductManager } from "../managers/productManager.js";
import CategoryManager from "../managers/categoryManager.js";
import { CartManager } from "../managers/cartManager.js";

export const homeRouter = Router();
const pM = new ProductManager;
const cM = new CategoryManager;
const cartManager = new CartManager;

homeRouter.get("/", async (req, res) => {
    try {
        const categories = await cM.getAllCat()
        const products = await pM.getProducts(req.query);
        const carts = await cartManager.getCarts()
        products.docs.forEach(product => {
            let categories = '';
            product.categories.forEach(c => {
                if (categories !== '') {
                    categories += `, ${c.name}:${c._id}`;
                } else {
                    categories = `${c.name}:${c._id}`;
                }
            });
            product.categoriesString = categories;
        });
        const params = new URLSearchParams(req.query);
        const paramsObject = Object.fromEntries(params.entries());
        let url
        paramsObject.categories ? url = `/?categories=${paramsObject.categories}&category_name=${paramsObject.category_name}`: url =`/?`;

        const catArray =[{id:"ninguna", name:"Ninguna"}]
        categories.map( category => catArray.push({id: category._id.toString(), name: category.name}))
        const cartArray = []
        carts.forEach(c => cartArray.push({id: `${c._id}`}))
        return res.status(200).render("home", {
            title: "Products",
            products: products,
            catArray,
            carts: cartArray,
            url
        });
    } catch (error) {
        res.status(500).send(error.message);
    }
});

homeRouter.get("/realtimeproducts", async (req, res) => {
    try {
        const carts = await cartManager.getCarts()
        const products = await pM.getProducts(req.query);
        const cartArray = []
        carts.forEach(c => cartArray.push({id: `${c._id}`}))
        return res.status(200).render("realTimeProducts", {
            title: "products",
            products: products,
            carts: cartArray
        });
    } catch (error) {
        res.status(500).send(error.message);
    }
});