import express from 'express';
import mongoDB from "./src/config/mongoose.config.js";
import { productsRouter } from './src/routes/product.router.js';
import { cartsRouter } from './src/routes/carts.router.js';
import {homeRouter} from './src/routes/views.router.js';
import { pruebasRouter } from './src/routes/pruebas.router.js';
import handlebars from "./src/config/handlebars.config.js";
import serverSocket from "./src/config/socket.config.js";
import { paths } from './src/utils/path.js';

const PORT = 8080;

const server = express();

handlebars.config(server);

server.use(express.urlencoded({ extended: true }))
server.use(express.json())

server.use("/public", express.static(paths.public));

server.use('/',homeRouter)
server.use('/api/products', productsRouter)
server.use('/api/carts', cartsRouter)
server.use('/pruebas', pruebasRouter)

server.use("*", (req, res) => {
    return res.status(404).send("<h1>Error 404: Not Found</h1>");
})

const serverHTTP = server.listen(PORT, (req,res) => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
    console.log(`URL: http://localhost:${PORT}`);
    mongoDB.connectDB()
})

serverSocket.config(serverHTTP)