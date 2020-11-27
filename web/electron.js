const { ipcRenderer } = require('electron')

window.addEventListener('electronApi', e => {
    if(e.detail == 'openDevTools') ipcRenderer.invoke('openDevTools');
    else if(e.detail == 'toggleFullscreen') ipcRenderer.invoke('toggleFullscreen');
    else if(e.detail == 'reload') window.location.reload();
    else if(e.detail == 'quit') window.close();
});

ipcRenderer.on('updates', () => {
    console.log('updates found! downloading...');
    alert('Updates are availible! Downloading now...');
});

ipcRenderer.on('updates_done', () => {
    console.log('updates done!');
    let upd = confirm('Updates downloaded. Do you want to restart now?');
    if(upd) {
        ipcRenderer.invoke('restartApp');
    }
});

window.addEventListener('load', () => {
    ipcRenderer.invoke('checkUpdates');
    console.log('checking for updates...');
});