import {promises as fs} from 'fs';
import {v4 as uuidv4} from 'uuid';
import path from 'path';
import {paths} from "../utils/path.js";

export class ProductManager {
    constructor(){
        this.path = path.join(paths.data,'products.json');
        this.products = []
    }

    getProducts = async () => {
        const response = await fs.readFile(this.path, 'utf-8')
        const responseJSON = JSON.parse(response)

        return responseJSON
    }

    addProduct = async ({title, description, price, thumbnail, code, stock, status, category}) => {
        const id = uuidv4()
        let newProduct = {id, title, description, price, thumbnail, code, stock, status, category}
        this.products = await this.getProducts()
        this.products.push(newProduct)
        await fs.writeFile(this.path, JSON.stringify(this.products))
        return newProduct
    }

    getProductById = async (id) => {
        const response = this.getProducts()
        const product = response.find(product => product.id === id)
        return product || console.log('Producto no encontrado')
    }

    updateProduct = async (id, {...data}) => {
        const response = this.getProducts()
        const index = response.findIndex(product => product.id === id)

        if(index !== -1){
            response[index] = {id, ...data}
            await fs.writeFile(this.path, JSON.stringify(response))
        } else {console.log('Producto no encontrado')}
    }

    deleteProduct = async (id) => {
        const products = await this.getProducts()
        const index = products.findIndex(product => product.id === id)

        if(index !== -1){
            products.splice(index, 1)
            await fs.writeFile(this.path, JSON.stringify(products))

        } else {console.log('Producto no encontrado')}
    }
};