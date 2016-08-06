#
# User: code house
# Date: 2016/08/06
#
fs = require('fs')
gulp = require('gulp')
sass = require('gulp-sass')
autoprefixer = require('gulp-autoprefixer')
cssmin = require('gulp-cssmin')
rename = require('gulp-rename')
plumber = require('gulp-plumber')

gulp.task 'sass', ->
  files = fs.readdirSync('static/scss')
  baseFiles = files.filter((file) ->
    return fs.statSync('static/scss/' + file).isFile() && /.*\.scss$/.test(file) && file.charAt(0) != "_"
  )
  .map((file) ->
    return 'static/scss/' + file
  )

  gulp.src(baseFiles)
  .pipe(plumber({
    errorHandler: (err) ->
      console.log(err.messageFormatted);
      @emit('end')
  }))
  .pipe(sass())
  .pipe(autoprefixer())
  .pipe(gulp.dest('static/css'))
  .pipe(cssmin())
  .pipe(rename({
    extname: '.min.css'
  }))
  .pipe(gulp.dest('static/css'))
