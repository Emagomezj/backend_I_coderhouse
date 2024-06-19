import { Server } from "socket.io";
import { ProductManager } from "../controllers/productManager.js";

const pM = new ProductManager

const config = (serverHTTP) => {
    const serverSocket = new Server(serverHTTP);

    serverSocket.on("connection", async (socket) => {
        console.log("Socket connected");
        try{
            const products = await pM.getProducts();
            socket.emit("products",products)
        }catch(error){
            console.error(`Hemos tenido un problema al buscar los productos. Error: ${error}`);
            socket.emit("getError", {message: `Hemos tenido un problema al buscar los productos. Error: ${error}` })
        }
        socket.on("authenticated", (data) => {
            socket.broadcast.emit("new-user-connected", data);
        });
        socket.on("newProduct", async (product) => {
            try {
                await pM.addProduct({ ...product });
                socket.emit("products", await pM.getProducts());
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
                await pM.deleteProduct(id);
                const products = await pM.getProducts();
                socket.emit("products", products);
            } catch (error) {
                console.error("Error al eliminar producto:", error);
                socket.emit("productsError", { message: "Error al eliminar producto" });
            }
        });

    });
};

export default {
    config,
};