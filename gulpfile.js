var gulp = require('gulp');
var del = require('del');
var ts = require('gulp-typescript');

var tsProject = ts.createProject('tsconfig.json');

gulp.task('build-ts', function () {
    return tsProject.src()
        .pipe(tsProject())
        .js.pipe(gulp.dest('rollem-dist'));
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

gulp.task('build-all', gulp.parallel('build-ts', 'copy-pegjs'));
gulp.task('build', gulp.series('clean', 'build-all'));
gulp.task('watch', gulp.series('clean', 'build-all', gulp.parallel('watch-ts', 'watch-pegjs')));

gulp.task('default', gulp.series('clean', 'build-all'));