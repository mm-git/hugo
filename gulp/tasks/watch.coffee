#
# User: code house
# Date: 2016/08/06
#
gulp = require('gulp')

gulp.task 'watch', ['sass'], ->
  gulp.watch 'static/scss/**/*', ['sass']
