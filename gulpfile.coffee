gulp = require 'gulp'
gutil = require 'gulp-util'

browserSync = require 'browser-sync'
sass = require 'gulp-sass'
rename = require 'gulp-rename'
browserify = require 'gulp-browserify'
coffeelint = require 'gulp-coffeelint'
coffee = require 'gulp-coffee'
autoprefixer = require 'gulp-autoprefixer'
rimraf = require 'gulp-rimraf'
runSequence = require 'run-sequence'

# CONFIG ---------------------------------------------------------

isProd = gutil.env.type is 'prod'

sources =
  sass: 'app/styles/*.scss'
  html: 'app/**/*.html'
  coffee: 'app/**/*.coffee'
  assets: 'app/assets/**/*'
  lib: 'app/scripts/lib/*.js'

destinations =
  css: 'dist/'
  html: 'dist/'
  js: 'dist/'
  assets: 'dist/assets'
  lib: 'dist/scripts/lib/'

# TASKS -------------------------------------------------------------

gulp.task('browser-sync', ->
  browserSync(
    server:
      baseDir: 'dist/'
  )
)

# Compile and concatenate scripts
gulp.task('coffee', ->
  gulp.src('app/scripts/main.coffee', read: false)  
    .pipe(browserify(
      transform: ['coffeeify']
      extensions: ['.coffee']
      insertGlobals: true,
      debug: !isProd
      ))
    .pipe(rename('app.js'))
    .pipe(gulp.dest(destinations.js))
    .pipe(browserSync.reload(stream: true))
)

# Compile stylesheets
gulp.task('sass', ->
  gulp.src('app/styles/*.scss')
  .pipe(sass(onError: (e) -> console.log(e)))
  .pipe(autoprefixer('last 2 versions', '> 1%', 'ie 8'))
  .pipe(gulp.dest(destinations.css))
  .pipe(browserSync.reload(stream: true))
)

# Lint coffeescript
gulp.task('lint', ->
  gulp.src(sources.coffee)
  .pipe(coffeelint())
  .pipe(coffeelint.reporter())
)

gulp.task('html', ->
  gulp.src(sources.html).pipe(gulp.dest(destinations.html))
)

gulp.task('assets', ->
  gulp.src(sources.assets).pipe(gulp.dest(destinations.assets))
)

gulp.task('lib', ->
  gulp.src(sources.lib).pipe(gulp.dest(destinations.lib))
)

# Watched tasks
gulp.task('watch', ->
  gulp.watch sources.sass, ['sass']
  gulp.watch sources.assets, ['assets']
  gulp.watch sources.html, ['html']
  gulp.watch sources.coffee, ['coffee', 'lint']
  gulp.watch sources.lib, ['lib']
 )

# Remove /dist directory
gulp.task('clean', ->
  gulp.src(['dist/'], read: false)
  .pipe(rimraf(force: true))
)

# Build sequence
gulp.task('build', ->
  runSequence('clean', ['coffee', 'sass', 'html', 'lib', 'assets'])
)

gulp.task('default', [
  'browser-sync'
  'build'
  'watch'
])