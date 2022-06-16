const DEV = false;
const { app, BrowserWindow, ipcMain } = require("electron");
const Express = require("express");
const cors = require("cors");
const { urlencoded: urlBody } = require("body-parser");
const ngrok = require("ngrok");
const { randomBytes } = require("crypto");
const Store = require("electron-store");
const store = new Store();
app.whenReady().then(() => {
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: require("path").resolve(DEV ? "./preload.js" : "./resources/app/preload.js")
        }
    });
    mainWindow.loadFile('index.html');
    ipcMain.handle("randBytes", (e) => {
        return randomBytes(32).toString("base64");
    });
    ipcMain.handle("startServer", async (e, DEBUG_KEY, ngrokAuth) => {
        const app = Express();

        app.use(cors());
        app.use(urlBody({ extended: true }));

        app.post("/debug", (req, res) => {
            if (DEBUG_KEY != req.body.dbgkey) return res.status(204).send();
            mainWindow.webContents.send("log", `[${Date.now()}] ${req.body.log}`);
            res.status(204).send();
        });

        let port = await new Promise((resolve) => {
            let listen = app.listen(0, () => {
                resolve(listen.address().port);
            });
        });

        let url = new URL(await ngrok.connect({
            "authtoken": ngrokAuth,
            "region": "us",
            "addr": parseInt(port)
        }));
        url.pathname = "debug";
        return url.href;
    });
    ipcMain.handle("getStore", (e, key) => {
        return store.get(key) ?? null;
    });
    ipcMain.handle("setStore", (e, key, val) => {
        store.set(key, val);
    });
});
app.on('window-all-closed', () => {
    app.quit();
});