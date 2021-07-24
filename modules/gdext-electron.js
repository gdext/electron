const { ipcRenderer, shell, webFrame } = require('electron');
const gdext_native = require('../modules/gdext-native');
const is_packaged  = require('../modules/is_packaged');
const path = require("path");

window.addEventListener('electronApi', e => {
    if(e.detail == 'openDevTools') ipcRenderer.invoke('openDevTools');
    else if(e.detail == 'toggleFullscreen') ipcRenderer.invoke('toggleFullscreen');
    else if(e.detail == 'reload') window.location.reload();
    else if(e.detail == 'quit') window.close();
    else if(typeof e.detail == 'object' && e.detail.detail == 'loadLevel') {
        console.log(e.detail);
        openGDLevel(
            e.detail.name,
            e.detail.data
        ).catch(console.err);
    } else if(typeof e.detail == 'object' && e.detail.detail == 'setZoom') {
        webFrame.setZoomFactor(e.detail.zoom || 1);
    }
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

async function openGDLevel(level_name, level_string) {
    let path_dir = is_packaged ? "/../../../" : "/../";

    try {
        gdext_native.runGDLevel(
            {
                "name":   level_name,
                "string": level_string,
                "official_song": true,
                "song": 0
            },
            {
                "dll_path": path.join(__dirname, path_dir, "GDExt_Playtest.dll"),
                "injector": path.join(__dirname, path_dir, "injector.exe"),
                "url_func": shell.openExternal
            }
        );
    } catch(e) {
        throw "Failed to inject the DLL to the GD client, error code: " + e.code;
    }
}

function pickFilesElectron(opt) {
    let path = ipcRenderer.sendSync('pickFiles', [opt]);
    return path;
}

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
            level: localStorage.getItem('lvlname') || 'GDExt Level'
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

    window.gdext.pickFilesElectron = pickFilesElectron;
});

//settings
let zoomLevels = [0.5, 0.67, 0.75, 0.8, 0.9, 1, 1.1, 1.25, 1.5, 1.75, 2];
let zoomSel = parseInt(localStorage.getItem('settings.guiZoom') || 5);
webFrame.setZoomFactor(zoomLevels[zoomSel] || 1);