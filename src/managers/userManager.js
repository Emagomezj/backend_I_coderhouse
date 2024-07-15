import mongoose from "mongoose";
import UserModel from "../models/user.model.js";
import mongoDB from "../config/mongoose.config.js";
import fileSystem from "../utils/fileSystem.js";

import {
    ERROR_INVALID_ID,
    ERROR_NOT_FOUND_ID,
} from "../constants/messages.constant.js";

export default class UserManager {
    #userModel;

    constructor () {
        this.#userModel = UserModel;
    }

    getAll = async (paramFilters) => {
        try {
            const $and = [];

            if (paramFilters?.name) $and.push({ name:  paramFilters.name });
            if (paramFilters?.surname) $and.push({ surname:  paramFilters.surname });
            if (paramFilters?.email) $and.push({ email:  paramFilters.email });
            const filters = $and.length > 0 ? { $and } : {};

            const sort = {
                asc: { name: 1 },
                desc: { name: -1 },
            };

            const paginationOptions = {
                limit: paramFilters.limit ?? 10,
                page: paramFilters.page ?? 1,
                sort: sort[paramFilters?.sort] ?? {},
                populate: "carts",
                lean: true,
            };

            const usersFound = await this.#userModel.paginate(filters, paginationOptions);
            console.log(usersFound);
            return usersFound;
        } catch (error) {
            throw new Error(error.message);
        }
    };

    getOneById = async (id) => {
        try {
            if (!mongoDB.isValidID(id)) {
                throw new Error(ERROR_INVALID_ID);
            }

            const userFound = await this.#userModel.findById(id).populate("carts");

            if (!userFound) {
                throw new Error(ERROR_NOT_FOUND_ID);
            }

            return userFound;
        } catch (error) {
            throw new Error(error.message);
        }
    };

    insertOne = async (data, file) => {
        try {
            const userCreated = new UserModel(data);
            userCreated.thumbnail = file?.filename ?? null;

            await userCreated.save();

            return userCreated;
        } catch (error) {
            if (file) await fileSystem.deleteImage(file.filename);

            if (error instanceof mongoose.Error.ValidationError) {
                error.message = Object.values(error.errors)[0];
            }

            throw new Error(error.message);
        }
    };

    updateOneById = async (id, data, file) => {
        try {
            if (!mongoDB.isValidID(id)) {
                throw new Error(ERROR_INVALID_ID);
            }

            const userFound = await this.#userModel.findById(id);
            const currentThumbnail = userFound.thumbnail;
            const newThumbnail = file?.filename;

            if (!userFound) {
                throw new Error(ERROR_NOT_FOUND_ID);
            }

            userFound.name = data.name;
            userFound.surname = data.surname;
            userFound.email = data.email;
            userFound.thumbnail = newThumbnail ?? currentThumbnail;
            userFound.carts = data.carts;

            await userFound.save();

            if (file && newThumbnail != currentThumbnail) {
                await fileSystem.deleteImage(currentThumbnail);
            }

            return userFound;
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

            const userFound = await this.#userModel.findById(id);

            if (!userFound) {
                throw new Error(ERROR_NOT_FOUND_ID);
            }

            await this.#userModel.findByIdAndDelete(id);
            await fileSystem.deleteImage(userFound.thumbnail);

            return userFound;
        } catch (error) {
            throw new Error(error.message);
        }
    };
}