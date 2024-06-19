
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
    products.forEach(product => {
        rows += ` <tr>
                <td>${product.id}</td>
                <td id=${product.id}>${product.category}</td>
                <td id=${product.id}>${product.title}</td>
                <td id=${product.id}>${product.code}</td>
                <td id=${product.id}><a href="${product.thumbnail[0]}" target="_blank">${product.thumbnail[0]}</a></td>
                <td id=${product.id}>${product.price}</td>
                <td id=${product.id}>${product.stock}</td>
                <td>
                    <a href="#" class="btn_del" id=${product.id}>
                        Borrar
                    </a>
                </td>
            </tr>
        `;
    });
    tbl_bdy.innerHTML = rows;
    FORM.addEventListener("submit", function (event) {
        event.preventDefault();
        const img = document.getElementById("image_input").value;
        const category = document.getElementById("category").value;
        const title = document.getElementById("title").value;
        const price = document.getElementById("price").value;
        const stock = document.getElementById("stock").value;
        const description = document.getElementById("description").value;
        const code = document.getElementById("code").value

        const product = {
            title: title,
            description: description,
            price: Number(price),
            thumbnail: [img],
            stock: Number(stock),
            code: code,
            status: true,
            category: category
        };

        SOCKET.emit("newProduct", product);
    })
    document.querySelectorAll(".btn_del").forEach((b) => {
        b.addEventListener("click", function() {
            const id = this.getAttribute("id");
            SOCKET.emit("deleteProduct", id);
        });})
});

