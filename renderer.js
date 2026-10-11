const{ipcRenderer} = require("electron")

document.getElementById("button").addEventListener("click", () => {
    ipcRenderer.send("capture-screen")
})