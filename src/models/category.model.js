import { Schema, model } from "mongoose";

const categorySchema = new Schema({
    name:{
        type: String,
        require:true,
        unique: true
    }
},{toJSON: { virtuals: true }})

categorySchema.virtual("products", {
    ref: "products", // Nombre de la collection externa
    localField: "_id", // Nombre del campo de referencia que esta en esta collection
    foreignField: "categories", // Nombre del campo de referencia que está en la collection externa
    justOne: false,
});

categorySchema.pre("findByIdAndDelete", async function(next) {
    const productModel = this.model("products");

    await productModel.updateMany(
        { products: this._id },
        { $pull: { products: this._id } },
    );

    next();
});

const CategoryModel = model('categories', categorySchema)

export default CategoryModel;