// initialize modules
const {src, dest, watch, series} = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const babel = require('gulp-babel');
const terser = require('gulp-terser');
const browsersync = require('browser-sync').create();

// Use dart-sass for @use & @forward
// sass.compiler = require('dart-sass');

// Sass task
function scssTask() {
  return src('./sass/style.scss', {sourcemap: true})
    .pipe(sass())
    .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe(dest('dist/css', {sourcemap: '.'}));
}

// Javascript task
function jsTask() {
  return src('js/app.js', {sourcemaps: true})
    .pipe(babel({presets: ['@babel/preset-env'] }))
    .pipe(terser())
    .pipe(dest('dist/javascript', {sourcemap: '.'}));
}

// Browsersync 
function browserSyncServe(cb) {
  browsersync.init({
    server: {
      baseDir: '.',
    },
    notify: {
      styles: {
        top: 'auto',
        bottom: 0,
      },
    },
  });
  cb();
}
function browserSyncReload(cb) {
  browsersync.reload();
  cb();
}

// Watch task
function watchTask() {
  watch('*.html', browserSyncReload);
  watch(
    ['sass/*.scss', 'js/*.js'],
    series(scssTask, jsTask, browserSyncReload)
  );
}

// Default gulp task
exports.default = series(scssTask, jsTask, browserSyncServe, watchTask);

// Build gulp task
exports.build = series(scssTask, jsTask);