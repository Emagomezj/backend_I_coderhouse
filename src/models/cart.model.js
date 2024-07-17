import { Schema, model } from "mongoose";

const cartSchema = new Schema({
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

cartSchema.pre("findByIdAndDelete", async function(next) {
    const userModel = this.model("user");

    await userModel.updateMany(
        { users: this._id },
        { $pull: { users: this._id } },
    );

    next();
});

const CartModel = model('carts', cartSchema)

export default CartModel;