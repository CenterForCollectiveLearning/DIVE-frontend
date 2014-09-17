var browserify, clean, coffee, concat, gulp, log, react, server,haml;

var gulp = require('gulp'),
    sass = require('gulp-sass'),
    browserSync = require('browser-sync'),
    autoprefixer = require('gulp-autoprefixer'),
    rename = require('gulp-rename'),
    minifycss = require('gulp-minify-css'),
    concat = require('gulp-concat'),
    coffee = require('gulp-coffee'),
    log  = require('gulp-util').log,
    source = require('vinyl-source-stream');

gulp.task('browser-sync', function() {
  browserSync({
    server: {
      baseDir: './'
    }
  });
});

gulp.task('coffee', function() {
  return gulp.src('./static/coffee/**/*.coffee')
    .pipe(coffee({bare: true}))
    .on('error', log)
    .pipe(gulp.dest('./static/scripts'))
    .pipe(browserSync.reload({stream: true}));
});

gulp.task('scss', function() {
  return gulp.src('./static/styles/scss/*.scss')
    .pipe(sass({sourcemap: true}))
    .pipe(autoprefixer('last 2 version'))
    .pipe(gulp.dest('./static/styles/css/'))
    .pipe(rename({suffix: '.min'}))
    .pipe(minifycss())
    .pipe(gulp.dest('./static/styles/css/'))
    .pipe(browserSync.reload({stream: true}));
});

gulp.task('watch:coffee', function() {
  return gulp.watch('./static/coffee/**/*.coffee', ['coffee', browserSync.reload]);
});

// Watch for SCSS source changes
gulp.task('watch:scss', function() {
  return gulp.watch('./static/styles/scss/*.scss', ['scss', browserSync.reload]);
});

gulp.task('default', ['coffee', 'scss', 'watch:coffee', 'watch:scss', 'browser-sync']);