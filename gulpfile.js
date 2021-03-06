let project_folder = "dist";
let source_folder = "#src";
let fs = require('fs');

let path = {
  build: {
    html: project_folder + "/",
    css: project_folder + "/css/",
    js: project_folder + "/js/",
    img: project_folder + "/img/",
    fonts: project_folder + "/fonts/",
  },

  src: {
    html: [source_folder + "/*.html", "!" + source_folder + "/_*.html"],
    css: source_folder + "/scss/style.scss",
    js: source_folder + "/js/script.js",
    img: source_folder + "/img/**/*.{jpg,png,svg,gif,ico,webp}",
    fonts: source_folder + "/fonts/*.ttf",
  },

  watch: {
    html: source_folder + "/**/*.html",
    css: source_folder + "/scss/**/*.scss",
    js: source_folder + "/js/**/*.js",
    img: source_folder + "/img/**/*.{jpg,png,svg,gif,ico,webp}",
  },

  clean: "./" + project_folder + "/"
}

let { src, dest } = require('gulp'),
  gulp = require('gulp'),
  browsersync = require('browser-sync').create();
  fileinclude = require('gulp-file-include');
  del = require('del');
  scss = require('gulp-sass')(require('sass'));
  autoprefixer = require('gulp-autoprefixer');
  groupMedia = require('gulp-group-css-media-queries');
  cleanCss = require('gulp-clean-css');
  rename = require('gulp-rename');
  uglify = require('gulp-uglify');
  concat = require('gulp-concat');
  jQuery = require('jquery');
  imagemin = require('gulp-imagemin');
  webp = require('gulp-webp');
  webphtml = require('gulp-webp-html');
  webpcss = require('gulp-webpcss');
  svgsprite = require('gulp-svg-sprite');
  ttf2woff = require('gulp-ttf2woff');
  ttf2woff2 = require('gulp-ttf2woff2');
  fonter = require('gulp-fonter');


function browserSync() {
  browsersync.init({
    server: {
      baseDir: "./" + project_folder + "/"
    },
    port: 3000,
    notify: false
  })
}

function html() {
  return src(path.src.html)
    .pipe(fileinclude())
    .pipe(webphtml())
    .pipe(dest(path.build.html))
    .pipe(browsersync.stream())
}

function css() {
  return src(path.src.css)
    .pipe(
      scss({ outputStyle: 'expanded' }).on('error', scss.logError)
    )
    .pipe(
      groupMedia()
    )
    .pipe(
      autoprefixer({
        overrideBrowserslist: ['last 10 versions'],
        cascade: true,
        grid: true,
      })
    )
    .pipe(webpcss())
    .pipe(dest(path.build.css))
    .pipe(cleanCss())
    .pipe(
      rename({
        extname: ".min.css"
      })
    )
    .pipe(dest(path.build.css))
    .pipe(browsersync.stream())
}

function js() {
  return src([

    './node_modules/jquery/dist/jquery.js',
    // './node_modules/mixitup/dist/mixitup.js',
    './node_modules/slick-carousel/slick/slick.js',
    './node_modules/rateyo/src/jquery.rateyo.js',
    
    path.src.js,
  ])
    .pipe(concat('script.js'))
    .pipe(fileinclude())
    .pipe(dest(path.build.js))
    .pipe(uglify())
    .pipe(
      rename({
        extname: ".min.js"
      })
    )
    .pipe(dest(path.build.js))
    .pipe(browsersync.stream())
}

function images() {
  return src(path.src.img)
    .pipe(
      webp({
        quality: 70
      })
    )
    .pipe(dest(path.build.img))
    .pipe(src(path.src.img))
    .pipe(imagemin([
      imagemin.gifsicle({ interlaced: true }),
      imagemin.mozjpeg({ quality: 75, progressive: true }),
      imagemin.optipng({ optimizationLevel: 5 }),
      imagemin.svgo({
        plugins: [
          { removeViewBox: true },
          { cleanupIDs: false }
        ]
      })
    ]))
    .pipe(dest(path.build.img))
    .pipe(browsersync.stream())
}

function fonts() {
  src(path.src.fonts)
    .pipe(ttf2woff())
    .pipe(dest(path.build.fonts));
  return src(path.src.fonts)
    .pipe(ttf2woff2())
    .pipe(dest(path.build.fonts))
}

gulp.task('otf2ttf', function () {
  return gulp.src([source_folder + '/fonts/*.otf'])
    .pipe(fonter({
      formats: ['ttf']
    }))
    .pipe(dest(source_folder + '/fonts/'));
})

gulp.task('svgsprite', function () {
  return gulp.src([source_folder + '/iconsprite/*.svg'])
    .pipe(svgsprite({
      mode: {
        stack: {
          sprite: "../icons/icons.svg",
          example: true
        }
      },
    }))
    .pipe(dest(path.build.img))
  //.pipe(dest([source_folder + '/img']))


})


function fontsStyle() {
  let file_content = fs.readFileSync(source_folder + '/scss/fonts.scss');
  if (file_content == '') {
    fs.writeFile(source_folder + '/scss/fonts.scss', '', cb);
    return fs.readdir(path.build.fonts, function (err, items) {
      if (items) {
        let c_fontname;
        for (var i = 0; i < items.length; i++) {
          let fontname = items[i].split('.');
          fontname = fontname[0];
          if (c_fontname != fontname) {
            fs.appendFile(source_folder + '/scss/fonts.scss', '@include font("' + fontname + '", "' + fontname + '", "400", "normal");\r\n', cb);
          }
          c_fontname = fontname;
        }
      }
    })
  }
  return src(path.src.fonts)
}

function cb() { }


function watchFiles() {
  gulp.watch([path.watch.html], html);
  gulp.watch([path.watch.css], css);
  gulp.watch([path.watch.js], js);
  gulp.watch([path.watch.img], images);
}

function clean() {
  return del(path.clean);
}

let build = gulp.series(clean, fonts, gulp.parallel(js, css, html, images), fontsStyle);
let watch = gulp.parallel(build, watchFiles, browserSync);

exports.fontsStyle = fontsStyle;
exports.fonts = fonts;
exports.images = images;
exports.js = js;
exports.scc = css;
exports.html = html;
exports.build = build;
exports.watch = watch;

exports.default = gulp.parallel(html, css, images, js, browserSync, watchFiles);

// let project_folder = "dist";
// let source_folder = "#src";

// let fs = require('fs');

// let path = {
//   build:{
//     html: project_folder + "/",
//     css: project_folder + "/css/",
//     js: project_folder + "/js/",
//     img: project_folder + "/img/",
//     fonts: project_folder + "/fonts/",
//   },
//   src: {
//     html: [source_folder + "/*.html", "!" + source_folder + "/_*.html"],
//     css: source_folder + "/scss/style.scss",
//     js: source_folder + "/js/main.js",
//     img: source_folder + "/img/**/*.{jpg,png,svg,gif,ico,webp}",
//     fonts: source_folder + "/fonts/*.ttf",
//   },
//   watch: {
//     html: source_folder + "/**/*.html",
//     css: source_folder + "/scss/**/*.scss",
//     js: source_folder + "/js/**/*.js",
//     img: source_folder + "/img/**/*.{jpg,png,svg,gif,ico,webp}"
//   },
//   clean: "./" + project_folder + "/"
// }

// let { src, dest } = require('gulp'),
//   gulp = require('gulp'),
//   browsersync = require('browser-sync').create();
//   fileinclude = require('gulp-file-include');
//   del = require('del');
//   scss = require('gulp-sass')(require('sass'));
//   autoprefixer = require('gulp-autoprefixer');
//   group_media = require('gulp-group-css-media-queries');
//   clean_css = require('gulp-clean-css');
//   rename = require('gulp-rename');
//   uglify = require('gulp-uglify-es').default;
//   imagemin = require('gulp-imagemin');
//   webp = require('gulp-webp');
//   webphtml = require('gulp-webp-html');
//   webpcss = require('gulp-webpcss');
//   svgSprite = require('gulp-svg-sprite');
//   ttf2woff = require('gulp-ttf2woff');
//   ttf2woff2 = require('gulp-ttf2woff2');
//   fonter = require('gulp-fonter');
//   concat = require('gulp-concat');

// function browserSync() {
//   browsersync.init({
//     server:{
//       baseDir: "./" + project_folder + "/"
//     },
//     port:3002,
//     notify:false
//   })
// }

// function html() {
//   return src(path.src.html)
//     .pipe(fileinclude())
//     .pipe(webphtml())
//     .pipe(dest(path.build.html))
//     .pipe(browsersync.stream())
// }

// function css() {
//   return src(path.src.css)
//     .pipe(
//       scss({
//         outputStyle: 'expanded'
//       }).on('error', scss.logError)
//     )
//     .pipe(
//       group_media()
//     )
//     .pipe(
//       autoprefixer({
//         overrideBrowserslist: ["last 10 versions"],
//         cascade: true
//       })
//     )
//     .pipe(webpcss())
//     .pipe(dest(path.build.css))
//     .pipe(clean_css())
//     .pipe(
//       rename({
//         extname: ".min.css"
//       })
//     )
//     .pipe(dest(path.build.css))
//     .pipe(browsersync.stream())
// }

// function js() {
//   return src([
//     './node_modules/jquery/dist/jquery.js',
//     // 'node_modules/slick-carousel/slick/slick.js',
//     // 'node_modules/mixitup/dist/mixitup.js',
//     // 'node_modules/ion-rangeslider/js/ion.rangeSlider.js',
//     // 'node_modules/rateyo/src/jquery.rateyo.js',
//     // 'node_modules/jquery-form-styler/dist/jquery.formstyler.js',

//     path.src.js,
//   ])
//     .pipe(concat('main.js'))
//     .pipe(fileinclude())
//     .pipe(dest(path.build.js))
//     .pipe(uglify())
//     .pipe(
//       rename({
//         extname: ".min.js"
//       })
//     )
//     .pipe(dest(path.build.js))
//     .pipe(browsersync.stream())
// }

// function images() {
//   return src(path.src.img)
//     .pipe(
//       webp({
//         quality: 70
//       })
//     )
//     .pipe(dest(path.build.img))
//     .pipe(src(path.src.img))
//     .pipe(imagemin([
//       imagemin.gifsicle({ interlaced: true }),
//       imagemin.mozjpeg({ quality: 75, progressive: true }),
//       imagemin.optipng({ optimizationLevel: 5 }),
//       imagemin.svgo({
//         plugins: [
//           { removeViewBox: true },
//           { cleanupIDs: false }
//         ]
//       })
//     ]))
//     .pipe(dest(path.build.img))
//     .pipe(browsersync.stream())
// }

// function fonts() {
//   src(path.src.fonts)
//     .pipe(ttf2woff())
//     .pipe(dest(path.build.fonts));
//   return src(path.src.fonts)
//     .pipe(ttf2woff2())
//     .pipe(dest(path.build.fonts));
// }

// gulp.task('otf2ttf', function () {
//   return gulp.src([source_folder + '/fonts/*.otf'])
//     .pipe(fonter({
//       formats: ['ttf']
//     }))
//     .pipe(dest(source_folder + '/fonts/'))
// })

// gulp.task('svgSprite', function() {
//     return gulp.src([source_folder + '/iconsprite/*.svg'])
//       .pipe(svgSprite({
//         mode: {
//           stack: {
//             sprite: '../icons/icons.svg',
//             example: true
//           }
//         },
//       }))
//       .pipe(dest(path.build.img))
// })

// function fontsStyle() {
//   let file_content = fs.readFileSync(source_folder + '/scss/fonts.scss');
//   if (file_content == '') {
//     fs.writeFile(source_folder + '/scss/fonts.scss', '', cb);
//     return fs.readdir(path.build.fonts, function (err, items) {
//       if (items) {
//         let c_fontname;
//         for (var i = 0; i < items.length; i++) {
//           let fontname = items[i].split('.');
//           fontname = fontname[0];
//           if (c_fontname != fontname) {
//             fs.appendFile(source_folder + '/scss/fonts.scss', '@include font("' + fontname + '", "' + fontname + '", "400", "normal");\r\n', cb);
//           }
//           c_fontname = fontname;
//         }
//       }
//     })
//   }
// }

// function cb() { }

// function watchFiles() {
//   gulp.watch([path.watch.html], html);
//   gulp.watch([path.watch.css], css);
//   gulp.watch([path.watch.js], js);
//   gulp.watch([path.watch.img], images);
// }

// function clean() {
//   return del(path.clean);
// }

// let build = gulp.series(clean, gulp.parallel(js, css, html, images, fonts), fontsStyle);
// let watch = gulp.parallel(build, watchFiles, browserSync);

// exports.images = images;
// exports.fontsStyle = fontsStyle;
// exports.fonts = fonts;
// exports.js = js;
// exports.html = html;
// exports.css = css;
// exports.build = build;
// exports.watch = watch;

// //exports.default = gulp.parallel(html, css, images, js, browserSync, watchFiles);

// exports.default = watch;