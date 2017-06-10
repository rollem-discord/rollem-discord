let gulp = require('gulp');
let watch = require('gulp-watch');
let pegjs = require('gulp-pegjs');

gulp.task('pegjs', function() {
	return gulp.src('grammar/rollem.pegjs')
		.pipe(pegjs({format: 'commonjs', trace: true}))
		.pipe(gulp.dest('dist'));
});

gulp.task('watch', function () {
	let files = ['grammar/*.pegjs', 'grammar/*.js'];
	return watch(files, { ignoreInitial: false })
		.pipe(gulp.dest('pegjs'));
});