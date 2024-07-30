import { Schema, model } from "mongoose";
import paginate from "mongoose-paginate-v2";

const productSchema = new Schema({
    title: {
        type: String,
        required: [ true, "El nombre es obligatorio" ],
        uppercase: true,
        trim: true,
        minLength: [ 3, "La descripción debe tener al menos 3 caracteres" ],
        maxLength: [ 25, "El nombre debe tener como máximo 25 caracteres" ],
    },
    description:{
        type: String,
        required: true,
        minLength: [ 2, "La descripción debe tener al menos 20 caracteres" ],
        maxLength: [ 500, "La descripción debe tener como máximo 500 caracteres" ],
        trim: true
    },
    categories: [{
        type: Schema.Types.ObjectId,
        ref: "categories",
    }],
    stock: {
        type: Number,
        required: true,
        trim: true
    },
    price:{
        type:Number,
        required: true,
        index: {name: "idx_price" },
        trim: true
    },
    thumbnail: {
        type: String,
        required: [ true, "La imagen es obligatoria" ],
        trim: true
    },
},{toJSON: { virtuals: true }});

productSchema.virtual("carts", {
    ref: "carts", // Nombre de la collection externa
    localField: "_id", // Nombre del campo de referencia que esta en esta collection
    foreignField: "products", // Nombre del campo de referencia que está en la collection externa
    justOne: false,
});

productSchema.pre("findByIdAndDelete", async function(next) {
    const cartModel = this.model("cart");

    await cartModel.updateMany(
        { products: this._id },
        { $pull: { products: this._id } },
    );

    next();
});

productSchema.plugin(paginate);


const ProductModel = model("products", productSchema);

export default ProductModel;