const { ipcRenderer } = require('electron');
const gdext_native = require('./../gdext');

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

ipcRenderer.on('close', () => {
    console.log(window.gdext.isActuallyClosing);
    setTimeout(() => {
        console.log(window.gdext.isActuallyClosing);
    }, 100);
    if(window.gdext.isActuallyClosing) window.close();
    let event = new CustomEvent('action', { detail: 'exit' });
    dispatchEvent(event);
});

window.addEventListener('load', () => {
    ipcRenderer.invoke('checkUpdates');
    console.log('checking for updates...');

    let ret = gdext_native.init();
    if (ret != null)
        console.log(`Could not init GDExt-native: ${ret}`);

    //rich presence
    function generateRPC() {
        let obj = {
            verb: 'edit',
            level: 'GDExt Level'
        }
        if(parseInt(localStorage.getItem('lvlnumber')) < 0) obj.verb = 'new';
        return obj;
    }
    if(!window.gdext) window.gdext = {};
    window.gdext.isGdRunning = false;
    setInterval(() => {
        ipcRenderer.invoke('updateRPC', generateRPC());

        let r = gdext_native.isGDOpen();
        if(r != window.gdext.isGdRunning) {
            let event = new CustomEvent('gdRunningStateChange', { detail: r });
            dispatchEvent(event);
        }
        window.gdext.isGdRunning = r;
    }, 5000);
});