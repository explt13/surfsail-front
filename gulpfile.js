import gulp from 'gulp';

// path import
import { path } from './gulp/config/path.js';
// plugins import
import { plugins } from './gulp/config/plugins.js';

console.log(process.argv)
global.app = {
    isBuild: process.argv.includes('--build'),
    isBuildTest: process.argv.includes('--build-test'),
    isDev: !process.argv.includes('--build') && !process.argv.includes('--build-test'),
    path: path,
    gulp: gulp,
    plugins: plugins,
};

//import tasks
import { files } from './gulp/tasks/files.js';
import { html } from './gulp/tasks/html.js';
import { reset } from './gulp/tasks/reset.js';
import { server } from './gulp/tasks/server.js';
import { scss } from './gulp/tasks/scss.js';
import { js } from './gulp/tasks/js.js';
import { images } from './gulp/tasks/images.js';
import { videos } from './gulp/tasks/videos.js';
import { otfToTtf, ttfToWoff, fontsStyle } from './gulp/tasks/fonts.js';
import { svgSprites } from './gulp/tasks/svgSprites.js';
import { zip } from './gulp/tasks/zip.js';
import { ftp } from './gulp/tasks/ftp.js';

function watcher(){
    gulp.watch(path.watch.files, files);
    gulp.watch(path.watch.html, html);
    gulp.watch(path.watch.scss, scss);
    gulp.watch(path.watch.js, js);
    gulp.watch(path.watch.images, images);
    gulp.watch(path.watch.videos, videos);
}
export { svgSprites }

const fonts = gulp.series(otfToTtf, ttfToWoff, fontsStyle)
const mainTasks = gulp.series(fonts, gulp.parallel(files, html, scss, js, images, videos));

const dev = gulp.series(reset, mainTasks, gulp.parallel(watcher, server));
const buildTEST = gulp.series(reset, mainTasks, gulp.parallel(watcher, server));
const build = gulp.series(reset, mainTasks);
const deployZIP = gulp.series(reset, mainTasks, zip);
const deployFTP = gulp.series(reset, mainTasks, ftp);

export { dev }
export { buildTEST }
export { build }
export { deployZIP }
export { deployFTP }


gulp.task('default', dev);