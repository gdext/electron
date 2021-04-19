const { app, BrowserWindow, Menu, ipcMain } = require('electron');
const { autoUpdater } = require('electron-updater');
const RPC = new require('./rpc');
let discordRpc = new RPC('827268290417131540', {
    verb: "idle", // edit | new | idle
});
let winMain;

function createWindow() {
    const win = new BrowserWindow({
        width: 1280,
        height: 720,
        webPreferences: {
            nodeIntegration: true
        },
        icon: './icon.png'
    });

    win.loadFile('./web/index.html');
    win.maximize();
    Menu.setApplicationMenu(null);
    winMain = win;
    winMain.on('close', e => {
        closeEvent(winMain, e);
    });
}

let eventSent = false;
let t = setTimeout(() => {}, 1);
function closeEvent(winMain, e) {
    if(!eventSent) {
        winMain.webContents.send('close');
        e.preventDefault();
        eventSent = true;
        clearTimeout(t);
        t = setTimeout(() => {
            eventSent = false;
        }, 1000);
    }
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform != 'darwin') app.quit();
});
app.on('browser-window-focus', () => {
    winMain = BrowserWindow.getFocusedWindow();
    winMain.on('close', e => {
        closeEvent(winMain, e);
    });
})
app.on('activate', () => {
    if(BrowserWindow.getAllWindows().length == 0) createWindow();
});

ipcMain.handle('openDevTools', (e) => {
    winMain.webContents.toggleDevTools();
});
ipcMain.handle('toggleFullscreen', (e) => {
    winMain.setFullScreen(!winMain.fullScreen);
});
ipcMain.handle('checkUpdates', () => {
    //check for updates
    autoUpdater.checkForUpdatesAndNotify();
});
ipcMain.handle('restartApp', () => {
    autoUpdater.quitAndInstall();
});
ipcMain.handle('updateRPC', (e, obj) => {
    discordRpc.opts = obj;
});

autoUpdater.on('update-availible', () => {
    winMain.webContents.send('updates');
});

autoUpdater.on('update-downloaded', () => {
    winMain.webContents.send('updates_done');
});