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
  sass: 'app/**/*.scss'
  html: 'app/**/*.html'
  coffee: 'app/**/*.coffee'
  assets: 'app/assets/**/*'

destinations =
  css: 'dist/'
  html: 'dist/'
  js: 'dist/'
  assets: 'dist/assets'

# TASKS -------------------------------------------------------------

gulp.task('browser-sync', ->
    browserSync.init null,
    open: false
    server:
      baseDir: "app"
    watchOptions:
      debounceDelay: 1000
)

# Compile and concatenate scripts
gulp.task('src', ->
  gulp.src(sources.coffee)
  .pipe(coffee({bare: true})
  .on('error', gutil.log))
  .pipe(concat('app.js'))
  .pipe(if isProd then uglify() else gutil.noop())
  .pipe(gulp.dest(destinations.js))
)

# Compile stylesheets
gulp.task('style', ->
  gulp.src(sources.sass) # we defined that at the top of the file
  .pipe(sass())
  .pipe(gulp.dest(destinations.css))
)

# Lint coffeescript
# TODO Fix this
gulp.task('lint', ->
  gulp.src(sources.coffee)
  .pipe(coffeelint())
  .pipe(coffeelint.reporter())
)

gulp.task('html', ->
  gulp.src(sources.html).pipe(gulp.dest(destinations.html))
)

gulp.task('static', ->
  gulp.src(sources.assets).pipe(gulp.dest(destinations.assets))
)

# Watched tasks
gulp.task('watch', ->
  gulp.watch sources.sass, ['style']
  gulp.watch sources.static, ['static']
  gulp.watch sources.html, ['html']
  gulp.watch sources.coffee, ['src']

  # Reload browser
  gulp.watch 'dist/**/**', (file) -> 
    browserSync.reload(file.path) if file.type is "changed"
)

# Remove /dist directory
gulp.task('clean', ->
  gulp.src(['dist/'], {read: false}).pipe(clean())
)

# Build sequence
gulp.task('build', ->
  runSequence 'clean', ['style', 'src', 'html', 'static']  # 'lint'
)

gulp.task('default', [
  'build'
  'browser-sync'
  'watch'
])