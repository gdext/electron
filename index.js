const { app, BrowserWindow, Menu, ipcMain } = require('electron');
const { autoUpdater } = require('electron-updater');
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

    //check for updates
    autoUpdater.checkForUpdatesAndNotify();
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform != 'darwin') app.quit();
});
app.on('browser-window-focus', () => {
    winMain = BrowserWindow.getFocusedWindow();
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