// Discord Rich Presence

const DiscordRPC = require('discord-rpc');

module.exports = function RPC(clientId, opts) {
    DiscordRPC.register(clientId);

    this.rpc   = new DiscordRPC.Client({ transport: 'ipc' });
    this.start = new Date();

    this.opts = opts;

    this.setActivity = () => {
        if (!this.rpc) return;

        let state = "";

        switch (this.opts.verb) {
            case "edit": state = "Editing"; break;
            case "new":  state = "Creating a new level"; break;
            case "idle": state = "Idling"; break;
        }

        let act = {
            details: state + (this.opts.level ? ` '${this.opts.level}'` : ""),
            startTimestamp: this.start,
            largeImageKey: 'logo',
            largeImageText: 'GDExt',
            smallImageKey: 'rpc-' + this.opts.verb,
            smallImageText: state,
        };

        if (this.opts.objects) act.state = this.opts.objects + (this.opts.objects == 1 ? " Object" : " Objects");

        this.rpc.setActivity(act);
    }

    let trpc = this;
    this.rpc.on('ready', () => {
        trpc.setActivity();
        setInterval(() => trpc.setActivity(), 15e3);
    });

    this.rpc.login({ clientId }).catch(console.error);
}