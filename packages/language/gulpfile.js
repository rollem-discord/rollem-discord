const gulp = require("gulp");
const pegjs = require("gulp-pegjs");
const ext_replace = require("gulp-ext-replace");
const tspegjs = require("ts-pegjs");
const ts = require("gulp-typescript");
const fs = require("fs");
var exec = require('gulp-exec');
const path = require('node:path');

var tsProject = ts.createProject("tsconfig.json");

gulp.task("watch-pegjs-v1", function () {
    return gulp.watch(
      [
        "./src/rollem-language-1/*.pegjs",
        "./src/rollem-language-1/rollem-header.ts",
      ],
      gulp.series("build-pegjs")
    );
});

gulp.task("watch-pegjs-v1-beta", function () {
    return gulp.watch(
      [
        "./src/rollem-language-1-beta/*.pegjs",
        "./src/rollem-language-1-beta/rollem-header.ts",
      ],
      gulp.series("build-pegjs-v1-beta")
    );
});

gulp.task("watch-pegjs-v2", function () {
  return gulp.watch(
    [
      "./src/rollem-language-2/*.pegjs",
      "./src/rollem-language-2/evaluators/**/*.ts",
      "./src/rollem-language-2/types/**/*.ts",
      "./src/rollem-language-2/rollem-header.ts",
    ],
    gulp.series("build-pegjs-v2")
  );
});

gulp.task("watch-nearley-v2", function () {
  return gulp.watch(
    [
      "./src/rollem-language-2-nearley/*.ne",
      "./src/rollem-language-2-nearley/evaluators/**/*.ts",
      "./src/rollem-language-2-nearley/tests/**/*.ts",
      "./src/rollem-language-2-nearley/types/**/*.ts",
    ],
    gulp.series("build-nearley-v2")
  );
});

gulp.task("build-pegjs-v1", function () {
  const headerLocation = "./src/rollem-language-1/rollem-header.ts";
  const header = fs.readFileSync(headerLocation, "utf8");

  return gulp
    .src("src/rollem-language-1/rollem.pegjs")
    .pipe(
      pegjs({
        plugins: [tspegjs],
        cache: true,
        tspegjs: {
          customHeader: header,
        },
      })
    )
    .pipe(ext_replace(".ts"))
    .pipe(gulp.dest("src/rollem-language-1/"));
});

gulp.task("build-pegjs-v1-beta", function () {
  const headerLocation = "./src/rollem-language-1-beta/rollem-header.ts";
  const header = fs.readFileSync(headerLocation, "utf8");

  return gulp
    .src("src/rollem-language-1-beta/rollem.pegjs")
    .pipe(
      pegjs({
        plugins: [tspegjs],
        cache: true,
        tspegjs: {
          customHeader: header,
        },
      })
    )
    .pipe(ext_replace(".ts"))
    .pipe(gulp.dest("src/rollem-language-1-beta/"));
});

gulp.task("build-pegjs-v2", function () {
  const headerLocation = "./src/rollem-language-2/rollem-header.ts";
  const header = fs.readFileSync(headerLocation, "utf8");

  return gulp
    .src("src/rollem-language-2/rollem.pegjs")
    .pipe(
      pegjs({
        plugins: [tspegjs],
        cache: true,
        tspegjs: {
          customHeader: header,
        },
      })
    )
    .pipe(ext_replace(".ts"))
    .pipe(gulp.dest("src/rollem-language-2/"));
});

function determinePaths(file) {
  var sourceRelativePath = path.relative('', file.path);
  var outputFullPathTs = file.path.replace(/\.ne$/, '.ts');
  var outputRelativePathTs = path.relative('', outputFullPathTs);
  var outputFullPathHtml = file.path.replace(/\.ne$/, '.html');
  var outputRelativePathHtml = path.relative('', outputFullPathHtml);
  return {
    in: sourceRelativePath,
    outTs: outputRelativePathTs,
    outHtml: outputRelativePathHtml,
  }
}

gulp.task("build-nearley-v2", function () {
  var options = {
    continueOnError: true, // default = false, true means don't emit error event
    pipeStdout: false, // default = false, true means stdout is written to file.contents
  };
  var optionsContinue = {
    continueOnError: true, // default = false, true means don't emit error event
    pipeStdout: false, // default = false, true means stdout is written to file.contents
  };
  var reportOptions = {
    err: true, // default = true, false means don't write err
    stderr: true, // default = true, false means don't write stderr
    stdout: true, // default = true, false means don't write stdout
  };
  return gulp
    .src("src/rollem-language-2-nearley/rollem.ne")
    .pipe(
      exec(file => {
        const paths = determinePaths(file);
        return `rm ${paths.outTs} ${paths.outHtml}`;
      }, optionsContinue))
    .pipe(
      exec(file => {
        const paths = determinePaths(file);
        var command = `yarn run nearleyc ${paths.in} -o ${paths.outTs}`;
        console.log(command);
        return command;
      },
      options)
    )
    .pipe(
      exec(file => {
        const paths = determinePaths(file);
        var command = `yarn run nearley-railroad ${paths.in} -o ${paths.outHtml}`;
        console.log(command);
        return command;
      },
      options)
    )
    .pipe(exec.reporter(reportOptions))
    .pipe(
      exec(file => {
        const paths = determinePaths(file);
        var command = `start ${paths.outHtml}`;
        console.log(command);
        return command;
      },
      options)
    );
});

gulp.task("watch-nearley", gulp.series(["watch-nearley-v2"]));
gulp.task("build-nearley", gulp.series(["build-nearley-v2"]));
gulp.task("watch-pegjs", gulp.parallel(["watch-pegjs-v1", "watch-pegjs-v1-beta", "watch-pegjs-v2"]) )
gulp.task("build-pegjs", gulp.parallel(["build-pegjs-v1", "build-pegjs-v1-beta", "build-pegjs-v2"]) )
gulp.task("default", gulp.series("build-pegjs"));