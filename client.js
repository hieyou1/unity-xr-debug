const store = {
    "sget": (key) => electronAPI.getStore(key),
    "sset": (key, val) => electronAPI.setStore(key, val)
};
const id = (eid) => document.getElementById(eid);

const startServer = async (DEBUG_KEY, ngrokAuth) => {
    id("token-prompt").parentElement.removeChild(id("token-prompt"));
    await store.sset("debug", DEBUG_KEY);
    await store.sset("ngrok", ngrokAuth);

    let hasLog = false;

    const log = (logStr) => {
        if (!hasLog) {
            hasLog = true;
            document.body.innerText = logStr;
        } else {
            document.body.innerText += `\n${logStr}`;
        }
    };

    electronAPI.onDebugLog(log);

    id("ngrok").disabled = true;
    id("ngrok").value = await electronAPI.startServer(DEBUG_KEY, ngrokAuth);
    id("ngrok-label").innerText = "Debug URL";
    id("changeout").innerHTML = `<div class="form-floating mb-3">
    <input type="text" class="form-control" id="debugkey" placeholder="Debug Key" disabled autocomplete="off"
        autocapitalize="off" debug />
    <label for="debugkey" id="debug-label">Debug Key</label>
</div>
<br />
<div>Waiting for logs...</div>`;
    id("debugkey").value = DEBUG_KEY;
};
window.onload = async () => {
    if (await store.sget("debug") && await store.sget("ngrok")) {
        startServer(await store.sget("debug"), await store.sget("ngrok"));
    } else {
        id("start-srv").onclick = async () => {
            id("start-srv").disabled = true;
            startServer(await electronAPI.randBytes(), id("ngrok").value)
        };
        id("start-srv").disabled = false;
    }
};