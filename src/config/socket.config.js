import { Server } from "socket.io";
import { ProductManager } from "../managers/productManager.js";
import { CartManager } from "../managers/cartManager.js";

const pM = new ProductManager
const cartManager = new CartManager

const config = (serverHTTP) => {
    const serverSocket = new Server(serverHTTP);

    serverSocket.on("connection", async (socket) => {
        console.log("Socket connected");
        const query = socket.handshake.query;
        try{
            if(query.type === "products"){
                const products = await pM.getProducts( query.query);
                socket.emit("products",products)
            }
            if(query.type === "carts"){
                const cart = await cartManager.getCartById(query.id);
                socket.emit("cart", cart)
            }
        }catch(error){
            console.error(`Hemos tenido un problema al buscar los productos. Error: ${error}`);
            socket.emit("getError", {message: `Hemos tenido un problema al buscar los productos. Error: ${error}` })
        }
        socket.on("authenticated", (data) => {
            socket.broadcast.emit("new-user-connected", data);
        });
        socket.on("newProduct",async (data) => {
            try {
                const query = socket.handshake.query;
                const products = await pM.getProducts(query)
                socket.emit("products_new", {products, newProduct:data.payload});
            } catch (error) {
                console.error("Error al agregar producto:", error);
                socket.emit("productsError", { message: "Error al agregar producto" });
            }
        });
        socket.on("disconnect", () => {
            console.log("Se desconecto el server");
        })
        socket.on("deleteProduct", async (id) => {
            try {
                const product = await pM.getProductById(id)
                const delProduct = product.title
                await pM.deleteOneById(id);
                const products = await pM.getProducts({});
                socket.emit("products_del", {products,delProduct});
            } catch (error) {
                console.error("Error al eliminar producto:", error);
                socket.emit("productsError", { message: "Error al eliminar producto" });
            }
        });

        socket.on("update", async (id) => {
            try {
                const products = await pM.getProducts({});
                socket.emit("products", products);
            } catch (error) {
                console.error("Error al actualizar los datos:", error);
                socket.emit("productsError", { message: "Error al eliminar producto" });
            }
        });

    });
};

export default {
    config,
};