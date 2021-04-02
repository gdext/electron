const { ipcRenderer } = require('electron');
const tasklist = require('tasklist');

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

    //is-gd-running loop
    async function checkGD() {
        for (let p of await tasklist())
            if (p.imageName == "GeometryDash.exe") return true;
        return false;
    }
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
        checkGD().then(r => {
            if (r)
                window.gdext.isGdRunning = true;
            else
                window.gdext.isGdRunning = false;
        });
    }, 5000);
});