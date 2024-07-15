import { Schema, model } from "mongoose";

const cartSchema = new Schema({
    name:{
        type: String,
        default: `cart_${Date.now}`,
        uppercase: true,
        trim: true,
        minLength: [ 3, "El nombre debe tener al menos 3 caracteres" ],
        maxLength: [ 25, "El nombre debe tener como máximo 25 caracteres" ],
    },
    products:[{
        type: Schema.Types.ObjectId,
        ref: "products"
    }],
}, {
    timestamps: true, // Añade timestamps para generar createdAt y updatedAt
    toJSON: { virtuals: true }, // Permite que los campos virtuales se incluyan en el JSON.
});

cartSchema.virtual("users", {
    ref: "users", // Nombre de la collection externa
    localField: "_id", // Nombre del campo de referencia que esta en esta collection
    foreignField: "carts", // Nombre del campo de referencia que está en la collection externa
    justOne: true,
});

const CartModel = model('carts', cartSchema)

export default CartModel;