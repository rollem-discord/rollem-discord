var gulp = require('gulp');
var pegjs = require('gulp-pegjs');
var ext_replace = require('gulp-ext-replace');
var tspegjs = require('ts-pegjs');
var del = require('del');
var ts = require('gulp-typescript');
var sourcemaps = require('gulp-sourcemaps');

var tsProject = ts.createProject('tsconfig.json');

gulp.task('build-ts', function () {
    return tsProject.src()
        .pipe(sourcemaps.init())
        .pipe(tsProject()).js
        .pipe(sourcemaps.write('.', { includeContent: false, sourceRoot: '../lib'}))
        .pipe(gulp.dest('rollem-dist'));
});

gulp.task('watch-pegjs-v2', function() {
    return gulp.watch('./src/rollem-language-2/*.pegjs', gulp.series('build-pegjs-v2'));
});
var what = { "hello": "world" };
gulp.task('build-pegjs-v2', function () {
    return gulp.src('src/rollem-language-2/rollem.pegjs')
        .pipe(pegjs({
            plugins: [tspegjs],
            cache: true
          }))
        .pipe(ext_replace('.ts'))
        .pipe(gulp.dest('src/rollem-language-2/'))
});

gulp.task('copy-pegjs', function() {
    return gulp.src('./src/**/*.pegjs')
        .pipe(gulp.dest('./rollem-dist/'));
});

gulp.task('clean', function() {
    return del('./rollem-dist/**/*');
});

gulp.task('watch-ts', function() {
    return gulp.watch('./src/**/*.ts', gulp.series('build-ts'));
});

gulp.task('watch-pegjs', function() {
    return gulp.watch('./src/**/*.pegjs', gulp.series('copy-pegjs'));
});

gulp.task('build-all', gulp.parallel('build-pegjs-v2','build-ts', 'copy-pegjs'));
gulp.task('watch-all', gulp.parallel('watch-pegjs-v2','watch-ts', 'watch-pegjs'));
gulp.task('build', gulp.series('clean', 'build-all'));
gulp.task('watch', gulp.series('clean', 'build-all', 'watch-all'));

gulp.task('default', gulp.series('clean', 'build-all'));