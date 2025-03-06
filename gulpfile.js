import gulp from 'gulp';

// path import
import { path } from './gulp/config/path.js';
// plugins import
import { plugins } from './gulp/config/plugins.js';

global.app = {
    isBuild: process.argv.includes('--build'),
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


const fonts = gulp.series(otfToTtf, ttfToWoff, fontsStyle)
const mainTasks = gulp.series(fonts, gulp.parallel(files, html, scss, js, images, videos));
const mainTasksNoImgs = gulp.series(fonts, gulp.parallel(files, html, scss, js, videos));

const dev = gulp.series(reset, mainTasks, gulp.parallel(watcher, server));
const test = gulp.series(reset, mainTasks, gulp.parallel(watcher, server));
const build = gulp.series(reset, mainTasks);
const buildNoImgs = gulp.series(reset, mainTasksNoImgs);
const deployZIP = gulp.series(reset, mainTasks, zip);
const deployFTP = gulp.series(reset, mainTasks, ftp);

const minifyScss = gulp.series(reset, scss);
const minifyJs = gulp.series(reset, js);
const minifyImgs = gulp.series(reset, images);

export { dev }
export { test }
export { build }
export { buildNoImgs }
export { deployZIP }
export { deployFTP }
export { minifyScss }
export { minifyJs }
export { minifyImgs }

gulp.task('default', dev);