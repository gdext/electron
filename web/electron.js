const { ipcRenderer, shell } = require('electron');
const gdext_native = require('./../gdext_native');
const path = require("path");

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

async function openGDLevel(level_name, level_string) {
    try {
        gdext_native.runGDLevel(
            {
                "name":   level_name,
                "string": level_string
            },
            {
                "dll_path": path.join(__dirname, "/../GDExt-attach.dll"),
                "injector": "injector.exe",
                "url_func": shell.openExternal
            }
        );
    } catch(e) {
        throw "Failed to inject the DLL to the GD client, error code: " + e.code;
    }
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

    /* THIS IS FOR TESTING */
    openGDLevel(
        "Testing level",
        "kS38,1_40_2_125_3_255_4_-1_6_1000_7_1|1_0_2_102_3_255_4_-1_6_1001_7_1|1_0_2_102_3_255_4_-1_6_1009_7_1|1_255_2_255_3_255_4_-1_6_1004_7_1|1_255_2_255_3_255_4_-1_6_1002_7_1|,kA13,0,kA15,0,kA16,0;1,1,21,1004,2,495,3,15,24,1,zorder,2;1,1,21,1004,2,495,3,75,24,1,zorder,2;1,1,21,1004,2,495,3,15,24,1,zorder,2;1,1,21,1004,2,495,3,75,24,1,zorder,2;1,1,21,1004,2,495,3,45,24,1,zorder,2;1,1,21,1004,2,525,3,75,24,1,zorder,2;1,1,21,1004,2,555,3,75,24,1,zorder,2;1,1,21,1004,2,585,3,75,24,1,zorder,2;1,1,21,1004,2,615,3,75,24,1,zorder,2;1,1,21,1004,2,645,3,75,24,1,zorder,2;1,1,21,1004,2,675,3,75,24,1,zorder,2;1,1,21,1004,2,705,3,75,24,1,zorder,2;1,1,21,1004,2,735,3,75,24,1,zorder,2;1,1,21,1004,2,765,3,75,24,1,zorder,2;1,1,21,1004,2,765,3,45,24,1,zorder,2;1,1,21,1004,2,765,3,15,24,1,zorder,2;1,1,21,1004,2,465,3,45,24,1,zorder,2;1,1,21,1004,2,435,3,45,24,1,zorder,2;1,1,21,1004,2,405,3,45,24,1,zorder,2;1,1,21,1004,2,375,3,45,24,1,zorder,2;1,1,21,1004,2,375,3,15,24,1,zorder,2;1,5,21,1004,2,405,3,15,24,-2,zorder,-7;1,5,21,1004,2,435,3,15,24,-2,zorder,-7;1,5,21,1004,2,465,3,15,24,-2,zorder,-7;1,5,21,1004,2,525,3,45,24,-2,zorder,-7;1,5,21,1004,2,525,3,15,24,-2,zorder,-7;1,5,21,1004,2,555,3,15,24,-2,zorder,-7;1,5,21,1004,2,585,3,15,24,-2,zorder,-7;1,5,21,1004,2,615,3,15,24,-2,zorder,-7;1,5,21,1004,2,645,3,15,24,-2,zorder,-7;1,5,21,1004,2,675,3,15,24,-2,zorder,-7;1,5,21,1004,2,705,3,15,24,-2,zorder,-7;1,5,21,1004,2,735,3,45,24,-2,zorder,-7;1,5,21,1004,2,705,3,45,24,-2,zorder,-7;1,5,21,1004,2,675,3,45,24,-2,zorder,-7;1,5,21,1004,2,645,3,45,24,-2,zorder,-7;1,5,21,1004,2,615,3,45,24,-2,zorder,-7;1,5,21,1004,2,585,3,45,24,-2,zorder,-7;1,5,21,1004,2,555,3,45,24,-2,zorder,-7;1,5,21,1004,2,735,3,15,24,-2,zorder,-7;1,8,21,1004,2,705,3,105,24,1,zorder,2;1,8,21,1004,2,735,3,105,24,1,zorder,2;1,36,21,1004,2,825,3,75,24,-1,zorder,12;1,36,21,1004,2,945,3,75,24,-1,zorder,12;1,36,21,1004,2,1065,3,75,24,-1,zorder,12;1,9,21,1004,2,915,3,2.5,24,1,zorder,2;1,9,21,1004,2,945,3,2.5,24,1,zorder,2;1,9,21,1004,2,975,3,2.5,24,1,zorder,2;1,9,21,1004,2,1005,3,2.5,24,1,zorder,2;1,9,21,1004,2,1035,3,2.5,24,1,zorder,2;1,9,21,1004,2,1065,3,2.5,24,1,zorder,2;1,9,21,1004,2,735,3,-27.5,24,1,zorder,2;1,9,21,1004,2,735,3,-57.5,24,1,zorder,2;1,9,21,1004,2,705,3,-57.5,24,1,zorder,2;1,9,21,1004,2,675,3,-57.5,24,1,zorder,2;1,9,21,1004,2,615,3,-57.5,24,1,zorder,2;1,9,21,1004,2,555,3,-57.5,24,1,zorder,2;1,9,21,1004,2,525,3,-57.5,24,1,zorder,2;1,9,21,1004,2,495,3,-57.5,24,1,zorder,2;1,9,21,1004,2,465,3,-57.5,24,1,zorder,2;1,9,21,1004,2,465,3,-87.5,24,1,zorder,2;1,9,21,1004,2,435,3,-87.5,24,1,zorder,2;1,9,21,1004,2,405,3,-87.5,24,1,zorder,2;1,660,21,1004,2,1125,3,135,24,1,zorder,10;"
    ).catch(console.err);
    
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