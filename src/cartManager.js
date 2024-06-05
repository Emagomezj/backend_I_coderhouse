import {promises as fs} from fs;
import {v4 as uuidv4} from uuid;

export class CartManager {
    constructor(){
        this.path = 'cart.json';
        this.carts = [];
    }

    getCarts = async () => {
        const response = await fs.readFile(this.path, 'utf8');
        const responseJSON = JSON.parse(response);
        return responseJSON
    }

    getCartProducts = async (id) => {
        const carts = await this.getCarts();
        const cart = carts.find(c => c.id === id);
        cart ? cart.products : console.log('No se ha encontrado el carrito')
    }

    newCart = async () => {
        const cid = uuidv4()

        newCart = {id, products:[]}

        this.carts = await this.getCarts()
        this.carts.push(newCart)

        await fs.writeFile(this.path, JSON.stringify(this.carts))

        return newCart

    }

    addProductCart = async (cart_id, product_id) => {
        const carts = await this.getCarts()
        const index = carts.findIndex(cart => cart.id === cart_id)

        if(index !== -1){
            const cartProducts = await this.getCartProducts(cart_id);
            const indexProduct = cartProducts.findIndex(p => p.product_id === product_id)
            if(indexProduct !== -1){
                cartProducts[indexProduct].quantity ++
            } else {
                cartProducts.push({product_id, quantity: 1})
            }

            carts[index].products = cartProducts

            await fs.writeFile(this.path, JSON.stringify(carts))
            console.log('Producto agregado');
        } else {
            console.log('Carrito no encontrado');
        }
    }
}