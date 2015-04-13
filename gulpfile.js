var autoprefixer, browserSync, browserify, destinations, gulp, gutil, isProd, jshint, rename, rimraf, runSequence, sass, sources;

gulp = require('gulp');
gutil = require('gulp-util');
jshint = require('gulp-jshint');
browserSync = require('browser-sync');
sass = require('gulp-sass');
rename = require('gulp-rename');

modRewrite = require('connect-modrewrite');
source = require('vinyl-source-stream');
watchify = require('watchify');
browserify = require('gulp-browserify');
autoprefixer = require('gulp-autoprefixer');
rimraf = require('gulp-rimraf');
runSequence = require('run-sequence');

isProd = gutil.env.type === 'prod';

sources = {
  sass: 'app/styles/*.scss',
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

gulp.task('browser-sync', function() {
  return browserSync({
    server: {
      baseDir: 'dist/',
      middleware: [
        modRewrite([
          '!\\.\\w+$ /index.html [L]'
        ])
      ]
    },
    port: 5000
  });
});

gulp.task('js', function() {
  return gulp.src('app/scripts/main.js', {
    read: false
  }).pipe(browserify({
    insertGlobals: true,
    debug: !isProd
  })).pipe(rename('app.js')).pipe(gulp.dest(destinations.js)).pipe(browserSync.reload({
    stream: true
  }));
});

gulp.task('sass', function() {
  return gulp.src('app/styles/*.scss').pipe(sass({
    onError: function(e) {
      return console.log(e);
    }
  })).pipe(autoprefixer('last 2 versions', '> 1%', 'ie 8')).pipe(gulp.dest(destinations.css)).pipe(browserSync.reload({
    stream: true
  }));
});

gulp.task('lint', function() {
  return gulp.src(sources.js).pipe(jshint()).pipe(jshint.reporter('default'));
});

gulp.task('html', function() {
  return gulp.src(sources.html).pipe(gulp.dest(destinations.html)).pipe(browserSync.reload({
    stream: true
  }));;
});

gulp.task('assets', function() {
  return gulp.src(sources.assets).pipe(gulp.dest(destinations.assets)).pipe(browserSync.reload({
    stream: true
  }));;
});

gulp.task('lib', function() {
  return gulp.src(sources.lib).pipe(gulp.dest(destinations.lib)).pipe(browserSync.reload({
    stream: true
  }));;
});

gulp.task('watch', function() {
  gulp.watch(sources.sass, ['sass']);
  gulp.watch(sources.assets, ['assets']);
  gulp.watch(sources.html, ['html']);
  gulp.watch(sources.js, ['js']);
  gulp.watch(sources.lib, ['lib']);
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

gulp.task('default', ['browser-sync', 'build', 'watch']);