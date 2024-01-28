module.exports = {
    apps: [
        {
            name: "start-page",
            script: "build/server.js",
            autorestart: true,
            time: true,
            interpreter_args: ["--require=./.pnp.cjs"],
        },
    ],
};
