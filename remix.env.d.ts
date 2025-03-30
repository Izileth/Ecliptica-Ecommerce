/** @type {import('@remix-run/dev').AppConfig} */
module.exports = {
    ignoredRouteFiles: ["**/*"],
    server: {
        port: 3000,
    },
    vite: {
        optimizeDeps: {
        include: ["react-router-dom"],
        },
    },
};
