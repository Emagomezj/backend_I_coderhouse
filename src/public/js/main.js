
const SOCKET = io();
const FORM = document.getElementById("addItem_form");

SOCKET.on("connect", () => {
    console.log("Conectado al Server");
});



SOCKET.on("products", (products) => {
    FORM.reset();
    const tbl_bdy = document.getElementById("tbl_bdy");
    tbl_bdy.innerHTML = "";
    let rows = "";
    products.docs.forEach(product => {
        rows += ` <tr>
                <td>${product._id}</td>
                <td id=${product._id}>${product.categories[0].name}</td>
                <td id=${product._id}>${product.title}</td>
                <td id=${product._id}><a href="http://localhost:8080/public/img/${product.thumbnail}" target="_blank">http://localhost:8080/public/img/${product.thumbnail[0]}</a></td>
                <td id=${product._id}>${product.price}</td>
                <td id=${product._id}>${product.stock}</td>
                <td>
                    <a href="#" class="btn_del" id=${product._id}>
                        Borrar
                    </a>
                </td>
            </tr>
        `;
    });
    tbl_bdy.innerHTML = rows;
    FORM.addEventListener("submit", function (event) {
        event.preventDefault();
        const fileInput = document.getElementById("file");
        const categories = document.getElementById("category").value;
        const title = document.getElementById("title").value;
        const price = document.getElementById("price").value;
        const stock = document.getElementById("stock").value;
        const description = document.getElementById("description").value;

        const product = {}
        product.body = {
            title: title,
            description: description,
            price: Number(price),
            stock: Number(stock),
            categories: categories,
        };
        product.file = fileInput.files[0]

        SOCKET.emit("newProduct", product);
    })
    document.querySelectorAll(".btn_del").forEach((b) => {
        b.addEventListener("click", function() {
            const id = this.getAttribute("id");
            SOCKET.emit("deleteProduct", id);
        });})
});

