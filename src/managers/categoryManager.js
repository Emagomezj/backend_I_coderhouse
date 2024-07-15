import CategoryModel from "../models/category.model.js";
import mongoDB from "../config/mongoose.config.js";
import {
    ERROR_INVALID_ID,
    ERROR_NOT_FOUND_CATEGORY
} from "../constants/messages.constant.js";

export default class CategoryManager{
    #categoryModel;

    constructor () {
        this.#categoryModel = CategoryModel;
    }

    getAllCat = async () =>{

       try {
        const categoriesFound = await this.#categoryModel.find().lean()
        return categoriesFound
       }
        catch (error) {
        throw new Error(error.message)
       }
    }

    insertOne = async (data) => {
        console.log(data)
        try {
            const catCreated = new CategoryModel(data);
            await catCreated.save()
            return catCreated
        } catch (error) {
            throw new Error(error.message);
        }
    }

    deleteOne = async (id) => {
        try {
            if(!mongoDB.isValidID(id)){
                throw new Error(ERROR_INVALID_ID)
            }

            const categoryFound = await this.#categoryModel.findById(id)

            if (!categoryFound) {
                throw new Error(ERROR_NOT_FOUND_CATEGORY);
            }

            await this.#categoryModel.findByIdAndDelete(id)

        } catch (error) {
            throw new Error(error.message)
        }
    }
}