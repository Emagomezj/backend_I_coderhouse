import mongoose from "mongoose";
import CartModel from "../models/cart.model.js";
import mongoDB from "../config/mongoose.config.js";
import UserModel from "../models/user.model.js"
import {
    ERROR_INVALID_ID,
    ERROR_NOT_FOUND_ID
} from "../constants/messages.constant.js";

export class CartManager {

    #cartModel
    #userModel

    constructor(){
        this.#cartModel = CartModel;
        this.#userModel = UserModel ;
    }

    getCarts = async () => {
        try {
            const carts = await this.#cartModel.find().populate('products.product').lean();
            return carts;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    newCart = async (uid) => {
        try {
            if(!mongoDB.isValidID(uid)){
                throw new Error(ERROR_INVALID_ID)
            }
            const userFound = await this.#userModel.findById(uid)
            if(!userFound){
                throw new Error(ERROR_NOT_FOUND_ID)
            };
            if(userFound.carts.length === 0){
                const newCart = new CartModel();
                newCart.save()
                await this.#userModel.findOneAndUpdate({ _id: uid }, {$push: {carts: newCart._id}},);
                return newCart;
            } else {
                return 'Ya existe un carrito para este usuario'
            }

        } catch (error) {
            if (error instanceof mongoose.Error.ValidationError) {
                error.message = Object.values(error.errors)[0];
            }

            throw new Error(error.message);
        }
    }

    getCartById = async (cid) => {
        try {
            if(!mongoDB.isValidID(cid)){
                throw new Error(ERROR_INVALID_ID)
            }
            const cart = await this.#cartModel.findById(cid).populate('products.product').lean();

            if (!cart) {
                throw new Error(ERROR_NOT_FOUND_ID);
            }

            return cart;

        } catch (error) {
            throw new Error(error.message);
        }
    }

    addProductToCart = async (cid, pid, quantity) => {
        try {
            quantity = Number(quantity)
            if(!mongoDB.isValidID(cid)){
                throw new Error(`${ERROR_INVALID_ID} - Cart ID`)
            }

            if(!mongoDB.isValidID(pid)){
                throw new Error(`${ERROR_INVALID_ID} - Product ID`)
            }

            const cart = await this.#cartModel.findById(cid);

            if(!cart){
                throw new Error(ERROR_NOT_FOUND_ID)
            }

            const obj_pid = new mongoose.Types.ObjectId(pid)

            if(cart.products){
                const productIndex = cart.products.findIndex(p => p.product.equals(pid))
                if(productIndex !== -1){
                    const fullCart = await this.#cartModel.findById(cid).populate('products.product').lean()
                    const productStock = fullCart.products[productIndex].product.stock
                    if(cart.products[productIndex].quantity + quantity > productStock){
                        cart.products[productIndex].quantity = productStock;
                    } else {cart.products[productIndex].quantity += quantity}
                } else {cart.products.push({product: obj_pid, quantity});}
            } else {
                const fullCart = await this.#cartModel.findById(cid).populate('products.product').lean()
                const productStock = fullCart.products[productIndex].product.stock
                if(quantity > productStock){
                    cart.products.push({product: pid, quantity: productStock});
                } else {
                    cart.products.push({product: pid, quantity})
                }
            }

            await cart.save();
            const updatedCart = await this.#cartModel.findById(cid).populate('products.product').lean()
            return updatedCart;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    removeProduct = async (cid,pid, quantity) => {
        try {
            cid = new mongoose.Types.ObjectId(cid.trim())
            pid = new mongoose.Types.ObjectId(pid.trim())

            if(!mongoDB.isValidID(cid)){
                throw new Error(`${ERROR_INVALID_ID} - Cart ID`)
            }

            if(!mongoDB.isValidID(pid)){
                throw new Error(`${ERROR_INVALID_ID} - Product ID`)
            }

            const cart = await this.#cartModel.findById(cid);

            if(!cart){
                throw new Error(ERROR_NOT_FOUND_ID)
            }

            const productIndex = cart.products.findIndex(p => p.product.equals(pid));
            if(productIndex !== -1){
                if(cart.products[productIndex].quantity - quantity >= 1){
                    cart.products[productIndex].quantity -= quantity
                } else {cart.products[productIndex].quantity = 1};
            } else {
                throw new Error('Producto inexistente en el carrito')
            }

            await cart.save();

            const updatedCart = await this.#cartModel.findById(cid).populate('products.product').lean()

            return updatedCart;
        } catch (error) {

            if (error instanceof mongoose.Error.ValidationError) {
                error.message = Object.values(error.errors)[0];
            }

            throw new Error(error.message);
        }
    }

    deleteProduct = async (cid,pid) => {
        try {
            cid = new mongoose.Types.ObjectId(cid.trim())
            pid = new mongoose.Types.ObjectId(pid.trim())

            if(!mongoDB.isValidID(cid)){
                throw new Error(`${ERROR_INVALID_ID} - Cart ID`)
            }

            if(!mongoDB.isValidID(pid)){
                throw new Error(`${ERROR_INVALID_ID} - Product ID`)
            }
            const cart = await this.#cartModel.findByIdAndUpdate(
                cid,
                {$pull: {products: {product: pid}}},
                {new: true}
            ).populate('products.product').lean();
            if(!cart){
                throw new Error(ERROR_NOT_FOUND_ID)
            }
            return cart
        } catch (error) {
            if (error instanceof mongoose.Error.ValidationError) {
                error.message = Object.values(error.errors)[0];
            }

            throw new Error(error.message);
        }
    }

    updateQuantity = async (cid,pid, quantity) => {
        try {
            cid = new mongoose.Types.ObjectId(cid.trim())
            pid = new mongoose.Types.ObjectId(pid.trim())

            if(!mongoDB.isValidID(cid)){
                throw new Error(`${ERROR_INVALID_ID} - Cart ID`)
            }

            if(!mongoDB.isValidID(pid)){
                throw new Error(`${ERROR_INVALID_ID} - Product ID`)
            }
            const validCart = await this.#cartModel.findById(cid)

            if(!validCart){
                throw new Error(`${ERROR_NOT_FOUND_ID} - Cart ID`)
            }

            const cart = await this.#cartModel.findOneAndUpdate(
                {_id: cid, "products.product":pid},
                {$set: {"products.$.cantidad": quantity}},
                {new:true}
            ).populate('products.product').lean();

            return cart;
        } catch (error) {
            if (error instanceof mongoose.Error.ValidationError) {
                error.message = Object.values(error.errors)[0];
            }

            throw new Error(error.message);
        }
    }

    flushCart = async(cid) => {
        try {
            if(!mongoDB.isValidID(cid)){
                throw new Error(ERROR_INVALID_ID)
            }
            const cart = await this.#cartModel.findByIdAndUpdate(cid,{products:[]})
            if(!cart){
                throw new Error(ERROR_NOT_FOUND_ID)
            }
            const updatedCart = await this.#cartModel.findById(cid)
            return updatedCart
        } catch (error) {
            if (error instanceof mongoose.Error.ValidationError) {
                error.message = Object.values(error.errors)[0];
            }

            throw new Error(error.message);
        }
    }

    deleteCart = async (cid, uid) => {
        try {
            cid = new mongoose.Types.ObjectId(cid.trim())
            uid = new mongoose.Types.ObjectId(uid.trim())

            if(!mongoDB.isValidID(cid)|| !mongoDB.isValidID(uid)){
                throw new Error(`${ERROR_INVALID_ID}`)
            }

            const validCart = await this.#cartModel.findById(cid)
            const validUser = await this.#userModel.findById(uid)

            if(!validCart || !validUser){
                throw new Error(`${ERROR_NOT_FOUND_ID}`)
            }

            await this.#userModel.findByIdAndUpdate( uid,
                { $pull: { carts: cid } })

            await this.#cartModel.findByIdAndDelete(cid);
            return 'Carrito Eliminado con exito'
        } catch (error) {
            if (error instanceof mongoose.Error.ValidationError) {
                error.message = Object.values(error.errors)[0];
            }

            throw new Error(error.message);
        }
    }
}