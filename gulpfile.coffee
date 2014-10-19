gulp = require 'gulp'
gutil = require 'gulp-util'

sass = require 'gulp-sass'
browserSync = require 'browser-sync'
coffeelint = require 'gulp-coffeelint'
coffee = require 'gulp-coffee'
concat = require 'gulp-concat'
uglify = require 'gulp-uglify'
clean = require 'gulp-clean'
runSequence = require 'run-sequence'


# CONFIG ---------------------------------------------------------

isProd = gutil.env.type is 'prod'

sources =
  sass: 'static/scss/*.scss'
  html: 'static/views/*.html'
  coffee: 'static/coffee/**/*.coffee'

destinations =
  css: 'dist/css'
  html: 'dist/views'
  js: 'dist/scripts'

# TASKS -------------------------------------------------------------

gulp.task 'browser-sync', ->
    browserSync.init null,
    open: false
    server:
      baseDir: "./"
    watchOptions:
      debounceDelay: 1000

gulp.task 'style', ->
  gulp.src(sources.sass) # we defined that at the top of the file
  .pipe(sass())
  .pipe(gulp.dest(destinations.css))

gulp.task 'html', ->
  gulp.src(sources.html)
  .pipe(gulp.dest(destinations.html))

# I put linting as a separate task so we can run it by itself if we want to
gulp.task 'lint', ->
  gulp.src(sources.coffee)
  .pipe(coffeelint())
  .pipe(coffeelint.reporter())

gulp.task 'src', ->
  gulp.src(sources.coffee)
  .pipe(coffee({bare: true})
  .on('error', gutil.log))
  # .pipe(concat('app.js'))
  .pipe(if isProd then uglify() else gutil.noop())
  .pipe(gulp.dest(destinations.js))

gulp.task 'watch', ->
  # Compilation
  gulp.watch sources.sass, ['style']
  gulp.watch sources.html, ['html']
  gulp.watch sources.coffee, ['src']

  # Reload browser
  gulp.watch 'dist/**/**', (file) -> 
    browserSync.reload(file.path) if file.type is "changed"

gulp.task 'clean', ->
  gulp.src(['dist/'], {read: false}).pipe(clean())

gulp.task 'build', ->
  runSequence 'clean', ['style', 'src', 'html']  # 'lint'

gulp.task 'default', [
  'build'
  'browser-sync'
  'watch'
]