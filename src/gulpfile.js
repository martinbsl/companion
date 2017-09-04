/*
 * Companion main build-file.
 */
var gulp = require('gulp');
var del = require('del');
var runSequence = require('run-sequence');

/**
 * Cleanup dist-folder
 */
gulp.task('clean', function() {
  return del(['dist']);
});

/**
 * Copies the 'README.md' file.
 */
gulp.task('copy:readme', function() {
  return gulp.src('README.md').pipe(gulp.dest('dist'));
});

/**
 * Rebuilds component library.
 */
gulp.task('default', function() {
  return runSequence('clean', 'copy:readme');
});
