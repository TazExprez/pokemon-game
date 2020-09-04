const gulp = require("gulp");
const sass = require("gulp-sass");
const autoprefixer = require("gulp-autoprefixer");
const browserSync = require("browser-sync").create();
const concat = require("gulp-concat");
const terser = require("gulp-terser");

const injectCss = () =>
  gulp
    .src("./assets/sass/**/*.scss")
    .pipe(sass({ outputStyle: "compressed" }).on("error", sass.logError))
    .pipe(autoprefixer())
    .pipe(gulp.dest("./public/css"))
    .pipe(browserSync.stream());

const updateJs = () =>
  gulp
    .src("./assets/js/**/*.js")
    .pipe(concat("regularJS.js"))
    // .pipe(terser())
    .pipe(gulp.dest("./public/js"))
    .pipe(browserSync.stream());

const watch = () => {
  browserSync.init({
    server: {
      baseDir: "./public"
    }
  });

  gulp.watch("./assets/sass/**/*.scss", injectCss);
  gulp.watch("./**/*.html").on("change", browserSync.reload);
  gulp.watch("./assets/js/**/*.js", updateJs);
};

exports.default = watch;
