const native = require('./../gdext.node');

const fs     = require('fs');
const { execFile } = require('child_process');

module.exports.runGDLevel = function(level_info, inj_info) {
    return new Promise((resolve, reject) => {
        const name_b64 = Buffer.from(level_info.name).toString("base64");
        const inj = {
            "gd_title": "Geometry Dash",
            "dll_path": inj_info.dll_path
        };

        let official_song, ng_song;

        if (level_info.official_song) {
            official_song = level_info.song;
            ng_song       = 0;
        } else {
            ng_song       = level_info.song;
            official_song = 0;
        }

        try {
            fs.writeFileSync(`${process.env.APPDATA}\\gdext\\level.dat`, `${name_b64}§${level_info.string}§${official_song}§${ng_song}`);
            fs.writeFileSync(`${process.env.APPDATA}\\gdext\\injector.json`, JSON.stringify(inj));
        } catch (e) {
            reject();
        }

        execFile(inj_info.injector, [], err => {
            if (err)
                reject(err);
            else
                resolve();
        });

        inj_info.url_func("steam://rungameid/322170");
    });
}

module.exports.init = () => {};
module.exports.isGDOpen = native.isGDOpen;