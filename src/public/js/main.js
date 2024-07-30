
const params = new URLSearchParams(window.location.search);
const query = Object.fromEntries(params.entries());

const SOCKET = io({
    query: {type: "products",
        query}
});
const FORM = document.getElementById("addItem_form");
const pageControllers = document.getElementById("pageControllers")

SOCKET.on("connect", () => {
    console.log("Conectado al Server");
});



SOCKET.on("products", (products) => {
    FORM.reset();
    createControllers(products)
    const tbl_bdy = document.getElementById("tbl_bdy");
    tbl_bdy.innerHTML = "";
    let rows = "";
    products.docs.forEach(product => {
        let categories = ''
        product.categories.forEach(c => {
            if(categories !== ''){categories += `, ${c.name}:${c._id}`}else{categories = `${c.name}:${c._id}`};})
        rows += ` <tr>
                <td>${product._id}</td>
                <td id=${product._id}>${categories}</td>
                <td id=${product._id}>${product.title}</td>
                <td id=${product._id}><a href="http://localhost:8080/public/img/${product.thumbnail}" target="_blank">http://localhost:8080/public/img/${product.thumbnail[0]}</a></td>
                <td id=${product._id}>${product.price}</td>
                <td id=${product._id}>${product.stock}</td>
                <td>
                    <a href="#" class="btn_cart" id=${product._id}>
                        Agregar
                    </a>
                </td>
                <td>
                    <a href="#" class="btn_mod" id=${product._id}>
                        Modificar
                    </a>
                </td>
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
        const categories = document.getElementById("categories").value;
        const title = document.getElementById("title").value;
        const price = document.getElementById("price").value;
        const stock = document.getElementById("stock").value;
        const description = document.getElementById("description").value;

        const formData = new FormData()
        formData.append("file", fileInput.files[0]);
        formData.append("title", title);
        formData.append("description", description);
        formData.append("price", Number(price));
        formData.append("stock", Number(stock));
        formData.append("categories", categories);
        fetch('/api/products/', {
            method: 'POST',
            body: formData
        }).then(response => response.json())
        .then(data => {
            SOCKET.emit('newProduct', data);
        }).catch(error => console.error('Error al subir archivo:', error));

    })
    document.querySelectorAll(".btn_del").forEach((b) => {
        b.addEventListener("click", function() {
            const id = this.getAttribute("id");
            SOCKET.emit("deleteProduct", id);
        });})
    document.querySelectorAll(".btn_cart").forEach((b) => {
        b.addEventListener("click",function(){
            const pid = this.getAttribute("id")
            const cart = document.getElementById("cart").value
            window.location.pathname = `/cart/${cart}/add/${pid}`
        })
    })
    document.getElementById("btn_verCart").addEventListener("click", () => {
        const cart = document.getElementById("cart").value
        window.location.pathname = `/cart/${cart}`
    })
});

SOCKET.on("products_new", (data) => {
    Swal.fire({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        title: `${data.newProduct.title} se ha agregado con éxito`,
        icon: "success",
    });

    FORM.reset();
    createControllers(data.products)
    const tbl_bdy = document.getElementById("tbl_bdy");
    tbl_bdy.innerHTML = "";
    let rows = "";
    data.products.docs.forEach(product => {
        let categories = ''
        product.categories.forEach(c => {
            if(categories !== ''){categories += `, ${c.name}:${c._id}`}else{categories = `${c.name}:${c._id}`};})
        rows += ` <tr>
                <td>${product._id}</td>
                <td id=${product._id}>${categories}</td>
                <td id=${product._id}>${product.title}</td>
                <td id=${product._id}><a href="http://localhost:8080/public/img/${product.thumbnail}" target="_blank">http://localhost:8080/public/img/${product.thumbnail[0]}</a></td>
                <td id=${product._id}>${product.price}</td>
                <td id=${product._id}>${product.stock}</td>
                <td>
                    <a href="#" class="btn_cart" id=${product._id}>
                        Agregar
                    </a>
                </td>
                <td>
                    <a href="#" class="btn_mod" id=${product._id}>
                        Modificar
                    </a>
                </td>
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
        const categories = document.getElementById("categories").value;
        const title = document.getElementById("title").value;
        const price = document.getElementById("price").value;
        const stock = document.getElementById("stock").value;
        const description = document.getElementById("description").value;

        const formData = new FormData()
        formData.append("file", fileInput.files[0]);
        formData.append("title", title);
        formData.append("description", description);
        formData.append("price", Number(price));
        formData.append("stock", Number(stock));
        formData.append("categories", categories);
        fetch('/api/products/', {
            method: 'POST',
            body: formData
        }).then(response => response.json())
        .then(data => {
            SOCKET.emit('newProduct', data);
        }).catch(error => console.error('Error al subir archivo:', error));

    })
    document.querySelectorAll(".btn_del").forEach((b) => {
        b.addEventListener("click", function() {
            const id = this.getAttribute("id");
            SOCKET.emit("deleteProduct", id);
        });})
});
SOCKET.on("products_del", (data) => {
    Swal.fire({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        title: `${data.delProduct} se ha eliminado con éxito`,
        icon: "success",
    });

    FORM.reset();
    createControllers(data.products)
    const tbl_bdy = document.getElementById("tbl_bdy");
    tbl_bdy.innerHTML = "";
    let rows = "";
    data.products.docs.forEach(product => {
        let categories = ''
        product.categories.forEach(c => {
            if(categories !== ''){categories += `, ${c.name}:${c._id}`}else{categories = `${c.name}:${c._id}`};})
        rows += ` <tr>
                <td>${product._id}</td>
                <td id=${product._id}>${categories}</td>
                <td id=${product._id}>${product.title}</td>
                <td id=${product._id}><a href="http://localhost:8080/public/img/${product.thumbnail}" target="_blank">http://localhost:8080/public/img/${product.thumbnail[0]}</a></td>
                <td id=${product._id}>${product.price}</td>
                <td id=${product._id}>${product.stock}</td>
                <td>
                    <a href="#" class="btn_cart" id=${product._id}>
                        Agregar
                    </a>
                </td>
                <td>
                    <a href="#" class="btn_mod" id=${product._id}>
                        Modificar
                    </a>
                </td>
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
        const categories = document.getElementById("categories").value;
        const title = document.getElementById("title").value;
        const price = document.getElementById("price").value;
        const stock = document.getElementById("stock").value;
        const description = document.getElementById("description").value;

        const formData = new FormData()
        formData.append("file", fileInput.files[0]);
        formData.append("title", title);
        formData.append("description", description);
        formData.append("price", Number(price));
        formData.append("stock", Number(stock));
        formData.append("categories", categories);
        fetch('/api/products/', {
            method: 'POST',
            body: formData
        }).then(response => response.json())
        .then(data => {
            SOCKET.emit('newProduct', data);
        }).catch(error => console.error('Error al subir archivo:', error));

    })
    document.querySelectorAll(".btn_del").forEach((b) => {
        b.addEventListener("click", function() {
            const id = this.getAttribute("id");
            SOCKET.emit("deleteProduct", id);
        });})
});


const createControllers = (products) => {
    if(products.hasPrevPage && products.hasNextPage){
        pageControllers.innerHTML = `
        <a href="/realtimeproducts?page=${products.prevPage}"><button>Anterior</button></a>
        <a href="/realtimeproducts?page=${products.nextPage}"><button>Siguiente</button></a>
        <a href="/realtimeproducts?page=${products.page}&sort=asc"><button>⬇ </button></a>
        <a href="/realtimeproducts?page=${products.page}&sort=desc"><button>⬆ </button></a>
                <a href="/realtimeproducts?page=${products.page}"><button>⬌</button></a>

                <p>
                    Página <span id="page">${products.page}</span> de <span
                        id="total-pages">${products.totalPages}</span>
                    <br>
                    <span>${products.totalDocs}</span> Documentos
                </p>
        `
    } else if (products.hasPrevPage || products.hasNextPage) {
        const btn = products.prevPage ?? products.nextPage
        let btn_name = ''
        btn === products.prevPage ? btn_name = 'Anterior' : btn_name = 'Siguiente'
        pageControllers.innerHTML = `
        <a href="/realtimeproducts?page=${btn}"><button>${btn_name}</button></a>
        <a href="/realtimeproducts?page=${products.page}&sort=asc"><button>⬇ </button></a>
        <a href="/realtimeproducts?page=${products.page}&sort=desc"><button>⬆ </button></a>
                <a href="/realtimeproducts?page=${products.page}"><button>⬌</button></a>

                <p>
                    Página <span id="page">${products.page}</span> de <span
                        id="total-pages">${products.totalPages}</span>
                    <br>
                    <span>${products.totalDocs}</span> Documentos
                </p>
        `
    }else{
        pageControllers.innerHTML = `
        <a href="/realtimeproducts?page=${products.page}&sort=asc"><button>⬇ </button></a>
        <a href="/realtimeproducts?page=${products.page}&sort=desc"><button>⬆ </button></a>
                <a href="/realtimeproducts?page=${products.page}"><button>⬌</button></a>

                <p>
                    Página <span id="page">${products.page}</span> de <span
                        id="total-pages">${products.totalPages}</span>
                    <br>
                    <span>${products.totalDocs}</span> Documentos
                </p>
        `
    }
}
