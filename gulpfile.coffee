gulp = require('gulp')
coffee = require('gulp-coffee')
rename = require('gulp-rename')
gutil = require('gulp-util')
jade = require('gulp-jade')
jshint = require('gulp-jshint')
sass = require('gulp-sass')
rename = require('gulp-rename')
modRewrite = require('connect-modrewrite')
source = require('vinyl-source-stream')
browserify = require('gulp-browserify')
autoprefixer = require('gulp-autoprefixer')
rimraf = require('gulp-rimraf')
runSequence = require('run-sequence')

isProd = gutil.env.type == 'prod'

changedFile = (file) ->
  # refresh.changed file.path
  return

sources =
  sass: 'app/styles/**'
  html: 'app/**/*.html'
  jade: 'app/**/*.jade'
  js: 'app/**/*.js'
  coffee: 'app/**/*.coffee'
  assets: 'app/assets/**/*'
  lib: 'app/scripts/lib/*.js'

destinations =
  css: 'dist/'
  html: 'dist/'
  js: 'dist/'
  coffee: 'app/'
  assets: 'dist/assets'
  lib: 'dist/scripts/lib/'

# Modules for webserver and livereload
express = require('express')
# refresh = require('gulp-livereload')
# liveReload = require('connect-livereload')
# liveReloadPort = 35729
serverPort = 7000

server = express()
server.set 'view engine', 'jade'
# server.use liveReload(port: liveReloadPort) # Add live reload
server.use express.static('dist') # Use our 'dist' folder as rootfolder
server.all '/*', (req, res) ->  # Because I like HTML5 pushstate .. this redirects everything back to our index.html
  res.sendFile 'index.html', root: 'dist'
  return

gulp.task 'js', ->
  gulp.src('app/scripts/main.coffee', read: false)
    .pipe(browserify(
      transform: ['coffeeify']
      extensions: ['.coffee', '.js']
      insertGlobals: true
      debug: !isProd))
    .pipe(rename('app.js'))
    .pipe(gulp.dest(destinations.js))

gulp.task 'sass', ->
  gulp.src('app/styles/styles.sass')
    .pipe(sass(
      indentedSyntax: true
      onError: (e) ->
        console.log e
    ))
    .pipe(autoprefixer('last 2 versions', '> 1%', 'ie 8'))
    .pipe(gulp.dest(destinations.css))

gulp.task 'lint', ->
  gulp.src(sources.js)
    .pipe(jshint())
    .pipe(jshint.reporter('default'))

gulp.task 'html', ->
  gulp.src(sources.html)
    .pipe(gulp.dest(destinations.html))

gulp.task 'jade', ->
  gulp.src(sources.jade)
    .pipe(jade())
    .pipe(gulp.dest(destinations.html))

gulp.task 'assets', ->
  gulp.src(sources.assets)
    .pipe(gulp.dest(destinations.assets))

gulp.task 'lib', ->
  gulp.src(sources.lib)
    .pipe(gulp.dest(destinations.lib))

gulp.task 'server', ->
  gutil.log 'Express Server Running on Port:', gutil.colors.cyan(serverPort)
  # gutil.log 'LiveReload Server Running on Port:', gutil.colors.cyan(liveReloadPort)
  server.listen(serverPort)
  # refresh.listen(liveReloadPort)
  return

gulp.task 'watch', ->
  gulp.watch(sources.sass, [ 'sass' ]).on 'change', changedFile
  gulp.watch(sources.assets, [ 'assets' ]).on 'change', changedFile
  gulp.watch(sources.jade, [ 'jade' ]).on 'change', changedFile
  gulp.watch(sources.html, [ 'html' ]).on 'change', changedFile
  gulp.watch(sources.js, [ 'js' ]).on 'change', changedFile
  gulp.watch(sources.coffee, [ 'js' ]).on 'change', changedFile
  gulp.watch(sources.lib, [ 'lib' ]).on 'change', changedFile
  return

gulp.task 'clean', ->
  gulp
    .src([ 'dist/' ], read: false)
    .pipe(rimraf(force: true))

gulp.task 'build', ->
  runSequence 'clean', [
    'js'
    'sass'
    'jade'
    'html'
    'lib'
    'assets'
  ]

gulp.task 'default', [
  'build'
  'server'
  'watch'
]
