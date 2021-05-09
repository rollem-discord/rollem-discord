const gulp = require('gulp');
const pegjs = require('gulp-pegjs');
const ext_replace = require('gulp-ext-replace');
const tspegjs = require('ts-pegjs');
const ts = require('gulp-typescript');
const fs = require('fs');

var tsProject = ts.createProject('tsconfig.json');

gulp.task('watch-pegjs', function() {
    return gulp.watch(['./src/rollem-language-2/*.pegjs', './src/rollem-language-2/rollem-header.ts'], gulp.series('build-pegjs'));
});

gulp.task('build-pegjs', function () {
    const headerLocation = './src/rollem-language-2/rollem-header.ts';
    const header = fs.readFileSync(headerLocation, 'utf8');

    return gulp.src('src/rollem-language-2/rollem.pegjs')
        .pipe(pegjs({
            plugins: [tspegjs],
            cache: true,
            "tspegjs": {
                "customHeader": header,
            }
          }))
        .pipe(ext_replace('.ts'))
        .pipe(gulp.dest('src/rollem-language-2/'))
});

gulp.task('default', gulp.series('build-pegjs'));