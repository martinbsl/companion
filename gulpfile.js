// companion-build

var gulp = require('gulp');
var runSequence = require('run-sequence');
var del = require('del');

gulp.task('init', function() {
  return gulp.src([
      'src/gulpfile.js',
      'package.json',
      'README.md'
  ])
  .pipe(gulp.dest('dist'));
});

gulp.task('clean', function() {
  return del(['dist']);
});

gulp.task('rebuild', function() {
  return runSequence('clean', 'init');
});

gulp.task('default', function() {
  return runSequence('rebuild');
});
