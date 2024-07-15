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
            console.log(paramFilters.categories)
            const categoryFilter = () => {
                if(paramFilters.categories){
                        const categoryIds = paramFilters.categories.split(',').map(id => new mongoose.Types.ObjectId(id.trim()));
                        return {categories: { $in: categoryIds }}
                } else {return {}}
                }

            const filter = categoryFilter() ;

            const sort = {
                asc: { name: 1 },
                desc: { name: -1 },
            };

            const paginationOptions = {
                limit: paramFilters.limit ?? 10,
                page: paramFilters.page ?? 1,
                sort: sort[paramFilters?.sort] ?? {},
                populate: "categories",
                lean: true,
            };

            const productsFound = await this.#productModel.paginate(filter, paginationOptions);
            console.log(productsFound);
            return productsFound;
        } catch (error) {
            throw new Error(error.message);
        }
    };

    getProductById = async (id) => {
        try {
            if (!mongoDB.isValidID(id)) {
                throw new Error(ERROR_INVALID_ID);
            }

            const productFound = await this.#productModel.findById(id).populate("categories");

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
            data.categories = data.categories.split(',').map(id => new mongoose.Types.ObjectId(id.trim()))
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

    addCategoryToProduct = async(id, cid) => {
        try {
            if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(cid)) {
                throw new Error('Invalid ID');
            }
        } catch (error) {
            
        }
    }

    updateOneById = async (id, data, file) => {
        try {
            if (!mongoose.Types.ObjectId.isValid(id)) {
                throw new Error('Invalid ID');
            }

            const productFound = await ProductModel.findById(id);
            if (!productFound) {
                throw new Error('Product not found');
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
                    if (mongoose.Types.ObjectId.isValid(id.trim())) {
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