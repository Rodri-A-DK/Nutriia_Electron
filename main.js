// src/main/main.js
const { app, BrowserWindow } = require("electron");
const path = require("path");
require('dotenv').config();

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
    //configuraciones extras de la ventanita de electron
  });
win.menuBarVisible=false //para ocultar la barrita fea
  win.loadURL("https://rodri-a-dk.github.io/Nutriia_Electron/"); // Aquí correrá Next.js
}

app.on("ready", createWindow);
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
