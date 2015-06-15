var gulp = require('gulp');
var gutil = require('gulp-util');
var jshint = require('gulp-jshint');
var sass = require('gulp-sass');
var rename = require('gulp-rename');
var modRewrite = require('connect-modrewrite');
var source = require('vinyl-source-stream');
var watchify = require('watchify');
var browserify = require('gulp-browserify');
var autoprefixer = require('gulp-autoprefixer');
var rimraf = require('gulp-rimraf');
var runSequence = require('run-sequence');

var isProd = gutil.env.type === 'prod';

sources = {
  sass: 'app/styles/*',
  html: 'app/**/*.html',
  js: 'app/**/*.js',
  assets: 'app/assets/**/*',
  lib: 'app/scripts/lib/*.js'
};

destinations = {
  css: 'dist/',
  html: 'dist/',
  js: 'dist/',
  assets: 'dist/assets',
  lib: 'dist/scripts/lib/'
};

// Modules for webserver and livereload
var express = require('express'),
    refresh = require('gulp-livereload'),
    livereload = require('connect-livereload'),
    livereloadport = 35729,
    serverport = 7000;

var server = express();
server.use(livereload({ port: livereloadport }));  // Add live reload
server.use(express.static('./dist')); // Use our 'dist' folder as rootfolder
server.all('/*', function(req, res) {  // Because I like HTML5 pushstate .. this redirects everything back to our index.html
  res.sendFile('index.html', { root: 'dist' });
});

gulp.task('js', function() {
  return gulp.src('app/scripts/main.js', {
    read: false
  }).pipe(browserify({
    insertGlobals: true,
    debug: !isProd
  })).pipe(rename('app.js')).pipe(gulp.dest(destinations.js));
});

gulp.task('sass', function() {
  return gulp.src('app/styles/styles.sass').pipe(sass({
    indentedSyntax: true,
    onError: function(e) {
      return console.log(e);
    }
  })).pipe(autoprefixer('last 2 versions', '> 1%', 'ie 8')).pipe(gulp.dest(destinations.css));
});

gulp.task('lint', function() {
  return gulp.src(sources.js).pipe(jshint()).pipe(jshint.reporter('default'));
});

gulp.task('html', function() {
  return gulp.src(sources.html).pipe(gulp.dest(destinations.html));
});

gulp.task('assets', function() {
  return gulp.src(sources.assets).pipe(gulp.dest(destinations.assets));
});

gulp.task('lib', function() {
  return gulp.src(sources.lib).pipe(gulp.dest(destinations.lib));
});

gulp.task('watch', function() {
  server.listen(serverport);  // Start webserver
  refresh.listen(livereloadport);  // Start live reload

  gulp.watch(sources.sass, ['sass']);
  gulp.watch(sources.assets, ['assets']);
  gulp.watch(sources.html, ['html']);
  gulp.watch(sources.js, ['js']);
  gulp.watch(sources.lib, ['lib']);

  gulp.watch('./dist/**').on('change', refresh.changed);
});

gulp.task('clean', function() {
  return gulp.src(['dist/'], {
    read: false
  }).pipe(rimraf({
    force: true
  }));
});

gulp.task('build', function() {
  return runSequence('clean', ['js', 'sass', 'html', 'lib', 'assets']);
});

gulp.task('default', ['build', 'watch']);
