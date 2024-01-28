module.exports = {
    apps: [
        {
            name: "start-page",
            script: "build/server.js",
            instances: "1",
            exec_mode: "fork",
            autorestart: true,
            time: true,
            interpreter_args: ["--require=./.pnp.cjs"],
        },
    ],
};
