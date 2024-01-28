module.exports = {
    apps: [
        {
            name: "start-page",
            script: "build/server.js",
            instances: "max",
            exec_mode: "cluster",
            autorestart: true,
            time: true,
            interpreter_args: ["--require=./.pnp.cjs"],
        },
    ],
};
