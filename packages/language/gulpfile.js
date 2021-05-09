const gulp = require("gulp");
const pegjs = require("gulp-pegjs");
const ext_replace = require("gulp-ext-replace");
const tspegjs = require("ts-pegjs");
const ts = require("gulp-typescript");
const fs = require("fs");

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

gulp.task("watch-pegjs", gulp.parallel(["watch-pegjs-v1", "watch-pegjs-v1-beta", "watch-pegjs-v2"]) )
gulp.task("build-pegjs", gulp.parallel(["build-pegjs-v1", "build-pegjs-v1-beta", "build-pegjs-v2"]) )
gulp.task("default", gulp.series("build-pegjs"));