const {src, dest, task, series, watch, parallel} = require("gulp")
const rm = require( 'gulp-rm' )
const sass = require('gulp-sass')
const concat = require('gulp-concat')
const browserSync = require("browser-sync").create()
const reload = browserSync.reload
const sassGlob = require('gulp-sass-glob')
const autoprefixer = require('gulp-autoprefixer')
const px2rem = require('gulp-smile-px2rem')
const gcmq = require('gulp-group-css-media-queries')
const cleanCSS = require('gulp-clean-css')
const sourcemaps = require('gulp-sourcemaps')
const babel = require('gulp-babel')
const uglify = require('gulp-uglify')
const svgo = require('gulp-svgo')
const svgSprite = require('gulp-svg-sprite')
const gulpif = require('gulp-if')
const image = require('gulp-image')

const env = process.env.NODE_ENV

const { DIST_PATH, SRC_PATH, STYLES_LIBS, JS_LIBS } = require('./gulp.config')

sass.compiler = require('node-sass');

task('clean', () => {
  return src(`${DIST_PATH}/**/*`, { read: false })
    .pipe( rm() )
})

task('copy:html', () => {
  return src(`${SRC_PATH}/*.html`)
    .pipe(dest(`${DIST_PATH}`))
})

task('styles', () => {
  return src([
    ...STYLES_LIBS,
      'src/styles/main.scss'
    ])
    .pipe(gulpif(env === 'dev', sourcemaps.init()))
    .pipe(concat('main.min.scss'))
    .pipe(sassGlob())
    .pipe(sass().on('error', sass.logError))
    // .pipe(px2rem())
    .pipe(gulpif(env === 'dev', autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    })))
    .pipe(gulpif(env === 'prod', gcmq()))
    .pipe(gulpif(env === 'prod', cleanCSS()))
    .pipe(gulpif(env === 'dev', sourcemaps.write()))
    .pipe(dest(`${DIST_PATH}`))
})

task('scripts', () => {
  return src([
      ...JS_LIBS,
      './src/scripts/*.js'
    ])
    .pipe(gulpif(env === 'dev', sourcemaps.init()))
    .pipe(concat('main.min.js', { newLine: ';' }))
    .pipe(gulpif(env === 'prod',
      babel({
        presets: ['@babel/env']
      })
    ))
    .pipe(gulpif(env === 'prod', uglify()))
    .pipe(gulpif(env === 'dev', sourcemaps.write()))
    .pipe(dest(DIST_PATH))
})

task('icons', () => {
  return src(`${SRC_PATH}/images/icons/*.svg`)
    .pipe(svgo({
      plugins: [
        {
          removeAttrs: {
            attrs: '(fill|stroke|style|width|height|data.*)'
          }
        }
      ]
    }))
    .pipe(svgSprite({
      mode: {
        symbol: {
          sprite: "../sprite.svg"
        }
      }
    }))
    .pipe(dest(`${DIST_PATH}/images/icons`))
})

task('server', () => {
  browserSync.init({
      server: {
        baseDir: "./dist"
      },
      open: false
  })
})

task('images', () => {
  return src(`${SRC_PATH}/images/img/*`)
    .pipe(image())
    .pipe(dest(`${DIST_PATH}/images`));
})

task('watch', () => {
  watch('./src/styles/**/*.scss', series('styles')).on("change", reload, { straem: true })
  watch('./src/*.html', series('copy:html')).on("change", reload, { straem: true })
  watch('./src/scripts/*.js', series('scripts')).on("change", reload, { straem: true })
  watch('./src/images/icons/*.svg', series('icons'))
  watch('./src/images/*/*.png', series('images'))
})

task(
  'default',
    series(
      'clean', 
      parallel('copy:html', 'styles', 'scripts', 'icons', 'images'), 
      parallel('watch', 'server')
    )
)

task(
  'build',
    series('clean', parallel('copy:html', 'styles', 'scripts', 'icons', 'images'), )
)
