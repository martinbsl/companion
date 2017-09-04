// companion-build

var gulp = require('gulp');
var runSequence = require('run-sequence');

gulp.task('init', function() {
  gulp.src('src/gulpfile.js')
      .pipe(gulp.dest('dist'));
});

gulp.task('default', function() {
  runSequence('init');
});
