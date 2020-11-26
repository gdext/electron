const { app, BrowserWindow, Menu } = require('electron');

function createWindow() {
    const win = new BrowserWindow({
        width: 1280,
        height: 720,
        webPreferences: {
            nodeIntegration: true
        },
        icon: './icon.png'
    });

    win.loadFile('./dist/index.html');
    win.maximize();
    win.webContents.openDevTools();
    Menu.setApplicationMenu(null);
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform != 'darwin') app.quit();
});

app.on('activate', () => {
    if(BrowserWindow.getAllWindows().length == 0) createWindow();
});