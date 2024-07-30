const path = window.location.pathname;
const pathSegments = path.split('/');
const id = pathSegments[2]

const SOCKET = io({
    query: {
    type: "carts",
    id: id
  }
})

SOCKET.on("connect", () => {
    console.log("Conectado al Server");
});

SOCKET.on("cart", async (cart)=>{
    const tbl_bdy = document.getElementById("tbl_bdy");
    const btn_flush = document.getElementById("btn_flush")
    const btn_hme = document.getElementById("btn_hme")
    tbl_bdy.innerHTML = "";
    let rows = "";
    cart.products.forEach(product => {
        rows += ` <tr>
                <td>${product.product._id}</td>
                <td id=${product.product._id}>${product.product.title}</td>
                <td id=${product.product._id}>${product.product.price}</td>
                <td id=${product.product._id}>${product.product.stock}</td>
                <td id=${product.product._id}>${product.quantity}</td>
                <td>
                    <a href="/cart/${cart._id}/add/${product.product._id}" class="btn_agr" id=${product.product._id}>
                        Agregar
                    </a>
                </td>
                <td>
                    <a href="/cart/${cart._id}/dis/${product.product._id}" class="btn_dis" id=${product.product._id}>
                        Disminuir
                    </a>
                </td>
                <td>
                    <a href="/cart/${cart._id}/del/${product.product._id}" class="btn_del" id=${product.product._id}>
                        Quitar
                    </a>
                </td>
            </tr>
        `;
    })
    tbl_bdy.innerHTML = rows;
    btn_hme.addEventListener("click", (e) => {
        window.location.pathname = '/'
    })
    btn_flush.addEventListener("click", (e) => {
        fetch(`http://localhost:8080/api/carts/flush/${id}`,{
            method: 'PUT'
        }).then(response => {
            if (response.ok) {
                location.reload()
            } else {
                throw new Error('Error en la solicitud flush');
            }
        })
        .catch((error) => {
                console.error('Error:', error);
        });
    })
})
