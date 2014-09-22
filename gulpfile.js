var browserify, clean, coffee, concat, gulp, log, react, server,haml;

var gulp = require('gulp'),
    sass = require('gulp-sass'),
    connect = require('gulp-connect'),
    browserSync = require('browser-sync'),
    autoprefixer = require('gulp-autoprefixer'),
    rename = require('gulp-rename'),
    minifycss = require('gulp-minify-css'),
    concat = require('gulp-concat'),
    coffee = require('gulp-coffee'),
    log  = require('gulp-util').log,
    source = require('vinyl-source-stream');

gulp.task('connect', function() {
  connect.server();
});

gulp.task('coffee', function() {
  return gulp.src('./static/coffee/**/*.coffee')
    .pipe(coffee({bare: true}))
    .on('error', log)
    .pipe(gulp.dest('./static/scripts'))
    .pipe(connect.reload());
});

gulp.task('scss', function() {
  return gulp.src('./static/styles/scss/*.scss')
    .pipe(sass({sourcemap: true}))
    .pipe(autoprefixer('last 2 version'))
    .pipe(gulp.dest('./static/styles/css/'))
    .pipe(rename({suffix: '.min'}))
    .pipe(minifycss())
    .pipe(gulp.dest('./static/styles/css/'))
    .pipe(connect.reload());
});

gulp.task('watch:coffee', function() {
  return gulp.watch('./static/coffee/**/*.coffee', ['coffee']);
});

// Watch for SCSS source changes
gulp.task('watch:scss', function() {
  return gulp.watch('./static/styles/scss/*.scss', ['scss']);
});

gulp.task('default', ['coffee', 'scss', 'connect', 'watch:coffee', 'watch:scss']);