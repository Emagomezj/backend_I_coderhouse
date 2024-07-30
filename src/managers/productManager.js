import mongoose from "mongoose";
import ProductModel from "../models/product.model.js";
import mongoDB from "../config/mongoose.config.js";
import fileSystem from "../utils/fileSystem.js";
import {
    ERROR_INVALID_ID,
    ERROR_NOT_FOUND_ID
} from "../constants/messages.constant.js";

export class ProductManager {
    #productModel

    constructor(){
        this.#productModel = ProductModel;
    }

    getProducts = async (paramFilters) => {
        try {
            const categoryFilter = () => {
                if(paramFilters.categories){
                        const categoryIds = paramFilters.categories.split(',').map(id => new mongoose.Types.ObjectId(id.trim()));
                        return {categories: { $in: categoryIds }}
                } else {return {}}
                }

            const filter = categoryFilter() ;

            const sort = {
                asc: { title: 1 },
                desc: { title: -1 },
            };

            const paginationOptions = {
                limit: paramFilters.limit ?? 10,
                page: paramFilters.page ?? 1,
                sort: sort[paramFilters?.sort] ?? {},
                populate: "categories",
                lean: true,
            };
            const productsFound = await this.#productModel.paginate(filter, paginationOptions);
            return productsFound;
        } catch (error) {
            throw new Error(error.message);
        }
    };

    getProductById = async (id) => {
        try {
            id = new mongoose.Types.ObjectId(id.trim())
            if (!mongoDB.isValidID(id)) {
                throw new Error(ERROR_INVALID_ID);
            }

            const productFound = await this.#productModel.findById(id).populate('categories').lean();

            if (!productFound) {
                throw new Error(ERROR_NOT_FOUND_ID);
            }

            return productFound;
        } catch (error) {
            throw new Error(error.message);
        }
    };

    addProduct = async (data, file) => {

        try {
            if(data.categories.length === 24){
                data.categories = new mongoose.Types.ObjectId(data.categories)
            } else {
                data.categories = data.categories.split(',').map(id => new mongoose.Types.ObjectId(id.trim()))
            }

            const productCreated = new ProductModel(data);
            productCreated.thumbnail = file?.filename ?? null;

            await productCreated.save();

            return productCreated;
        } catch (error) {
            if (file) await fileSystem.deleteImage(file.filename);

            if (error instanceof mongoose.Error.ValidationError) {
                error.message = Object.values(error.errors)[0];
            }

            throw new Error(error.message);
        }
    };

    addCategoriesToProduct = async(id, categories) => {
        id = new mongoose.Types.ObjectId(id)

        try {
            if (!mongoDB.isValidID(id)) {
                throw new Error(ERROR_INVALID_ID);
            }
            const productFound = await this.#productModel.findById(id)

            if(!productFound) {
                throw new Error(ERROR_NOT_FOUND_ID);
            }

            if(categories.length === 24){

                const category = new mongoose.Types.ObjectId(categories.trim())
                if(!mongoDB.isValidID(category)){
                    throw new Error(ERROR_INVALID_ID);
                }

                const productFound = await this.#productModel.findByIdAndUpdate(
                    id,
                    { $addToSet: { categories: category } },
                    { new: true }
                ).populate("categories");


            return productFound

            }else{

               const validCategoryIDs = categories.map(id => {
                    if (!mongoDB.isValidID(new mongoose.Types.ObjectId(id))) {
                        throw new Error(ERROR_INVALID_ID);
                    }
                    return new mongoose.Types.ObjectId(id);
                    })

                const productFound = await this.#productModel.findByIdAndUpdate(
                        id,
                        { $addToSet: { categories: { $each: validCategoryIDs } } },
                        { new: true }
                    ).populate("categories");


                return productFound
            }
        } catch (error) {

            if (file) await fileSystem.deleteImage(file.filename);

            if (error instanceof mongoose.Error.ValidationError) {
                error.message = Object.values(error.errors)[0];
            }

            throw new Error(error.message);
        }
    }

    removeCategoryFromProduct = async (id,categories) => {
        try {

            id = new mongoose.Types.ObjectId(id)
            if (!mongoDB.isValidID(id)) {
                throw new Error(ERROR_INVALID_ID);
            }

            let validCategoryIDs

            if(categories.length === 24){

                validCategoryIDs = new mongoose.Types.ObjectId(categories)

                if(!mongoDB.isValidID(validCategoryIDs)){
                    throw new Error(ERROR_INVALID_ID)
                }

                const updatedProduct = await this.#productModel.findByIdAndUpdate(
                        id,
                        { $pull: { categories: validCategoryIDs } },
                        { new: true }
                    ).populate("categories");

                if (!updatedProduct) {
                    throw new Error(ERROR_NOT_FOUND_ID);
                }

                return updatedProduct;
            } else {

                validCategoryIDs = categories.map(id => {
                    if (!mongoDB.isValidID(new mongoose.Types.ObjectId(id))) {
                        throw new Error(ERROR_INVALID_ID);
                    }
                    return new mongoose.Types.ObjectId(id);
                    })

                const updatedProduct = await this.#productModel.findByIdAndUpdate(
                        id,
                        { $pull: { categories: { $in: validCategoryIDs } } },
                        { new: true }
                    ).populate("categories");

                if (!updatedProduct) {
                        throw new Error(ERROR_NOT_FOUND_ID);
                    }

                return updatedProduct;
            }

        } catch (error) {

            if (file) await fileSystem.deleteImage(file.filename);

            if (error instanceof mongoose.Error.ValidationError) {
                error.message = Object.values(error.errors)[0];
            }

            throw new Error(error.message);
        }
    }

    updateOneById = async (id, data, file) => {
        try {
            if (!mongoDB.isValidID(id)) {
                throw new Error(ERROR_INVALID_ID);
            }

            const productFound = await ProductModel.findById(id);
            if (!productFound) {
                throw new Error(ERROR_NOT_FOUND_ID);
            }

            const currentThumbnail = productFound.thumbnail;
            const newThumbnail = file?.filename;

            if (data.name) {
                productFound.name = data.name;
            }
            if (data.surname) {
                productFound.surname = data.surname;
            }
            if (data.email) {
                productFound.email = data.email;
            }
            if (data.categories) {
                productFound.categories = data.categories.split(',').map(id => {
                    if (mongoDB.isValidID(id.trim())) {
                        return new mongoose.Types.ObjectId(id.trim());
                    } else {
                        throw new Error(ERROR_INVALID_ID);
                    }
                });
            }
            productFound.thumbnail = newThumbnail ?? currentThumbnail;

            await productFound.save();

            if (file && newThumbnail != currentThumbnail) {
                await fileSystem.deleteImage(currentThumbnail);
            }

            return productFound;
        } catch (error) {
            if (file) await fileSystem.deleteImage(file.filename);

            if (error instanceof mongoose.Error.ValidationError) {
                error.message = Object.values(error.errors)[0];
            }

            throw new Error(error.message);
        }
    };

    deleteOneById = async (id) => {
        try {
            if (!mongoDB.isValidID(id)) {
                throw new Error(ERROR_INVALID_ID);
            }

            const productFound = await this.#productModel.findById(id);

            if (!productFound) {
                throw new Error(ERROR_NOT_FOUND_ID);
            }

            await this.#productModel.findByIdAndDelete(id);
            await fileSystem.deleteImage(productFound.thumbnail);

            return productFound;
        } catch (error) {
            throw new Error(error.message);
        }
    };
};



// Buscar carts => categories y user => product para chequear integridad

//const { categories } = req.query;