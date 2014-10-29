gulp = require 'gulp'
gutil = require 'gulp-util'

sass = require 'gulp-sass'
rename = require 'gulp-rename'
browserify = require 'gulp-browserify'
ngAnnotate =  require 'gulp-ng-annotate'
coffeelint = require 'gulp-coffeelint'
coffee = require 'gulp-coffee'
autoprefixer = require 'gulp-autoprefixer'
concat = require 'gulp-concat'
uglify = require 'gulp-uglify'
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

# gulp.task('browser-sync', ->
#     browserSync.init null,
#     open: false
#     server:
#       baseDir: "dist"
#     watchOptions:
#       debounceDelay: 1000
# )

express = require('express')
refresh = require('gulp-livereload')
livereload = require('connect-livereload')

LIVERELOADPORT = 35729
SERVERPORT = 5000

server = express()
server.use(livereload(port: LIVERELOADPORT))
server.use(express.static('./dist'))
server.all('/*', (req, res) -> res.sendFile('index.html', root: 'dist' ))

# Compile and concatenate scripts
gulp.task('coffee', ->
  # gulp.src(sources.coffee)
  # .pipe(coffee({bare: true})
  # .on('error', gutil.log))
  # # .pipe(concat('app.js'))
  # # .pipe(if isProd then uglify() else gutil.noop())
  # .pipe(gulp.dest(destinations.js))

  gulp.src('app/scripts/main.coffee', read: false)  
    .pipe(browserify(
      transform: ['coffeeify']
      extensions: ['.coffee']
      ))
    .pipe(rename('app.js'))
    .pipe(gulp.dest(destinations.js))
)

# Compile stylesheets
gulp.task('sass', ->
  # gulp.src('app/**/*.scss')  # Not working (malloc error)
  gulp.src('app/styles/*.scss')
  .pipe(sass(onError: (e) -> console.log(e)))
  .pipe(autoprefixer('last 2 versions', '> 1%', 'ie 8'))
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

gulp.task('assets', ->
  gulp.src(sources.assets).pipe(gulp.dest(destinations.assets))
)

gulp.task('lib', ->
  gulp.src(sources.lib).pipe(gulp.dest(destinations.lib))
)

# Browserify task
gulp.task('browserify', ->
  # Single point of entry (make sure not to src ALL your files, browserify will figure it out)
  gulp.src(['dist/scripts/main.js'])
  .pipe(browserify({
    insertGlobals: true,
    debug: true
  }))
  .pipe(concat('bundle.js')) # Bundle to a single file
  .pipe(ngAnnotate())
  # .pipe(uglify())
  .pipe(gulp.dest('dist/'));
);


# Watched tasks
gulp.task('watch', ->
  server.listen(SERVERPORT)
  refresh.listen(LIVERELOADPORT)

  gulp.watch sources.sass, ['sass']
  gulp.watch sources.assets, ['assets']
  gulp.watch sources.html, ['html']
  gulp.watch sources.coffee, ['coffee', 'lint']
  gulp.watch sources.lib, ['lib']

  gulp.watch('./dist/**').on('change', refresh.changed);
  # # Reload browser
  # gulp.watch 'dist/**/**', (file) -> 
  #   browserSync.reload(file.path) if file.type is "changed"
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
  'build'
  'watch'
])