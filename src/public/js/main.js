
const SOCKET = io();
const FORM = document.getElementById("addItem_form");

SOCKET.on("connect", () => {
    console.log("Conectado al Server");
});

