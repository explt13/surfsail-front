export const server = () => {
    app.plugins.browsersync.init({
        server: {
            baseDir: `${app.path.build.html}`,
            // index: 'home.html'
        },
        notify: false,
        port: 3000,
    })
}