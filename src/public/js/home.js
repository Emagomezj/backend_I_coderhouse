const cat_options = document.getElementById("cat_options")

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

const category = urlParams.get('category');


document.querySelectorAll("#category_opt").forEach((o) => {
    o.addEventListener("click", function(event) {
        event.preventDefault()
        const id = this.getAttribute("data-value");
        const name = this.textContent
        if(id== "ninguna"){
            window.location.href = "/";
        } else {
            const currentUrl = new URL(window.location.href);
            currentUrl.searchParams.set('categories', id);
            currentUrl.searchParams.set('category_name', name.split('\n')[0].trim());
            window.location.href = currentUrl.toString();
        }
    });
})

document.querySelectorAll(".btn_agregar").forEach((b) => {
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
