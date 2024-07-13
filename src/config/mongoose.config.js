import { connect, Types } from "mongoose";

const connectUsers = () => {
    const URI = "mongodb+srv://emagomezj:7T907th7bHs6oLhy@cluster0.xx94w6b.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

    const options = {
        useNewUrlParser: true, // Utiliza el nuevo motor de análisis de URL de MongoDB.
        useUnifiedTopology: true, // Deshabilitar los métodos obsoletos.
        dbName: "users", // Nombre de la base de datos.
    };

    connect(URI, options)
        .then(() => console.log("Conectado a MongoDB"))
        .catch((err) => console.error("Error al conectar con MongoDB", err));

};

const connectProducts = () => {
    const URI = "mongodb+srv://emagomezj:7T907th7bHs6oLhy@cluster0.xx94w6b.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

    const options = {
        useNewUrlParser: true, // Utiliza el nuevo motor de análisis de URL de MongoDB.
        useUnifiedTopology: true, // Deshabilitar los métodos obsoletos.
        dbName: "productos", // Nombre de la base de datos.
    };

    connect(URI, options)
        .then(() => console.log("Conectado a MongoDB"))
        .catch((err) => console.error("Error al conectar con MongoDB", err));
}

const connectCarts = () => {
    const URI = "mongodb+srv://emagomezj:7T907th7bHs6oLhy@cluster0.xx94w6b.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

    const options = {
        useNewUrlParser: true, // Utiliza el nuevo motor de análisis de URL de MongoDB.
        useUnifiedTopology: true, // Deshabilitar los métodos obsoletos.
        dbName: "carts", // Nombre de la base de datos.
    };

    connect(URI, options)
        .then(() => console.log("Conectado a MongoDB"))
        .catch((err) => console.error("Error al conectar con MongoDB", err));
}

const isValidID = (id) => {
    return Types.ObjectId.isValid(id);
};

export default {
    connectUsers,
    connectProducts,
    connectCarts,
    isValidID,
};


