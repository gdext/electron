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
            case "edit": state = "Editing a Level"; break;
            case "new":  state = "Creating a New Level"; break;
            case "idle": state = "Idling"; break;
        }

        let act = {
            details: state,
            startTimestamp: this.start,
            largeImageKey: 'logo',
            largeImageText: 'GDExt',
            smallImageKey: 'rpc-' + this.opts.verb,
            smallImageText: state,
        };

        if (this.opts.level) act.state = this.opts.level;

        this.rpc.setActivity(act);
    }

    let trpc = this;
    this.rpc.on('ready', () => {
        trpc.setActivity();
        setInterval(() => trpc.setActivity(), 15e3);
    });

    this.rpc.login({ clientId }).catch(console.error);
}