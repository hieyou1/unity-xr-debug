const electronInstaller = require('electron-winstaller');
(async () => {
    console.log("starting");
    await electronInstaller.createWindowsInstaller({
        appDirectory: "./Debug Server-win32-x64",
        authors: 'hieyou1',
        exe: 'Debug Server.exe'
    });
    console.log("done");
})();