#
# User: code house
# Date: 2016/08/06
#
gulp = require('gulp')
uglify = require('gulp-uglify')
rename = require('gulp-rename')
plumber = require('gulp-plumber')

gulp.task 'uglify', ->
  gulp.src('static/js/main.js')
  .pipe(plumber({
    errorHandler: (err) ->
      console.log(err.messageFormatted);
      @emit('end')
  }))
  .pipe(uglify())
  .pipe(rename({
    extname: '.min.js'
  }))
  .pipe(gulp.dest('static/js'))
