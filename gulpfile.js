var gulp = require('gulp'),
  concat = require('gulp-concat'),
  jqc = require('gulp-jquery-closure');
 
gulp.task('default', function() {
  gulp.src('./src/*.js')
    .pipe(concat('bootstrap.data-driven-components.js'))
    .pipe(jqc({$: false, window: true, document: true, undefined: true}))
    .pipe(gulp.dest('./dist/'))
});