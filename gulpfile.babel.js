'use strict'

import { task, src, dest, parallel, series, watch } from 'gulp'
import browserSync from 'browser-sync'
import plumber from 'gulp-plumber'
import del from 'del'
import rename from 'gulp-rename'
import fileinclude from 'gulp-file-include'
import htmlBeautify from 'gulp-html-beautify'
import sass from 'gulp-sass'
import postcss from 'gulp-postcss'
import mqpacker from 'css-mqpacker'
import sortCSSmq from 'sort-css-media-queries'
import autoprefixer from 'gulp-autoprefixer'
import cssnano from 'gulp-cssnano'
import webpackStream from 'webpack-stream'
import webpack from 'webpack'

const dist = process.argv.includes(`dev`) ? `dev-server` : `dist`

const path = {
  src: {
    html: `src/html/views/*.html`,
    scss: `src/scss/main.scss`,
    js: `src/js/main.js`,
    img: `src/img/**/*`,
    video: `src/video/**/*`,
    fonts: `src/fonts/**/*`,
    favicon: `src/favicon/**/*`,
    libs: `src/libs/**/*`,
    shaders: `src/**/*.{frag,vert}`
  },
  dist: {
    html: dist,
    css: `${dist}/css`,
    js: `${dist}/js`,
    img: `${dist}/img`,
    video: `${dist}/video`,
    fonts: `${dist}/fonts`,
    favicon: `${dist}/favicon`,
    libs: `${dist}/libs`
  },
  watch: {
    html: `src/html/**/*.html`,
    scss: `src/scss/**/*.scss`,
    js: `src/js/**/*.js`
  },
  clean: dist,
  cleanAll: [`dev-server`, `dist`]
}

const webpackConfig = {
  mode: process.argv.includes(`dev`) ? `development` : `production`,
  output: {
    filename: `bundle.js`
  },
  module: {
    rules: [
      {
        test: /\.(js)$/,
        loader: `babel-loader`,
        exclude: /(node_modules)/
      }, {
        test: /\.(gif|png|jpe?g|svg|glb|fbx)$/i,
        loader: `file-loader`,
        options: {
          name: `../assets/[name].[ext]`,
          publicPath: dist
        }
      }, {
        test: /\.(frag|vert|glsl)$/,
        use: [
          {
            loader: 'glsl-shader-loader'
          }
        ]
      }
    ]
  },
  performance: {
    hints: false
  },
  resolve: {
    extensions: [`.js`, `.vue`, `.json`],
    alias: {
      vue$: `vue/${dist}/vue.esm.js`
    }
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          filename: `vendors.js`,
          test: /node_modules/,
          chunks: `all`,
          enforce: true
        }
      }
    }
  },
  plugins: [],
  devtool: false
}

const sourseMap = new webpack.SourceMapDevToolPlugin({
  filename: `[file].map`,
  exclude: `vendors.js`
})

process.argv.includes(`dev`) && webpackConfig.plugins.push(sourseMap)

task(`html`, () =>
  src(path.src.html)
    .pipe(plumber())
    .pipe(fileinclude())
    .pipe(htmlBeautify())
    .pipe(dest(path.dist.html))
    .pipe(browserSync.stream())
)

task(`scss`, () =>
  src(path.src.scss)
    .pipe(plumber())
    .pipe(sass.sync().on(`error`, sass.logError))
    .pipe(postcss([mqpacker({ sort: sortCSSmq })]))
    .pipe(autoprefixer({ cascade: true }))
    .pipe(rename(function (path) { path.basename = `style` }))
    .pipe(dest(path.dist.css))
    .pipe(browserSync.stream())
)

task(`cssmin`, () =>
  src(`${path.dist.css}/**/*.css`)
    .pipe(cssnano({ zindex: false }))
    .pipe(rename((path) => { path.basename += `.min` }))
    .pipe(dest(path.dist.css))
)

task(`js`, () =>
  src(path.src.js)
    .pipe(plumber())
    .pipe(webpackStream(webpackConfig))
    .pipe(dest(path.dist.js))
    .pipe(browserSync.stream())
)

task(`img`, () =>
  src(path.src.img)
    .pipe(dest(path.dist.img))
    .pipe(browserSync.stream())
)

task(`video`, () =>
  src(path.src.video)
    .pipe(dest(path.dist.video))
    .pipe(browserSync.stream())
)

task(`fonts`, () =>
  src(path.src.fonts)
    .pipe(dest(path.dist.fonts))
    .pipe(browserSync.stream())
)

task(`favicon`, () =>
  src(path.src.favicon)
    .pipe(dest(path.dist.favicon))
)

task(`libs`, () =>
  src(path.src.libs)
    .pipe(dest(path.dist.libs))
    .pipe(browserSync.stream())
)

task(`server`, () =>
  browserSync.init({
    server: path.dist.html,
    notify: false
  })
)

task(`clean`, () => del(path.clean))

task(`clean-all`, () => del(path.cleanAll))

task(`watch`, () => {
  watch(path.watch.html, series(`html`))
  watch(path.watch.scss, series(`scss`))
  watch(path.watch.js, series(`js`))
  watch(path.src.shaders, series(`js`))
  watch(path.src.img, series(`img`))
  watch(path.src.video, series(`video`))
  watch(path.src.fonts, series(`fonts`))
  watch(path.src.favicon, series(`favicon`))
  watch(path.src.libs, series(`libs`))
})

const tasks = [`html`, `js`, `scss`, `img`, `fonts`, `favicon`, `libs`]

task(`dev`, series(`clean`, ...tasks, parallel(`server`, `watch`)))

task(`prod`, series(`clean`, parallel(...tasks), `cssmin`))
