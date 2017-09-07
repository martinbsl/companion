/*
 * Companion main build-file.
 */
var gulp = require('gulp');
var del = require('del');
var runSequence = require('run-sequence');
var ngc = require('@angular/compiler-cli/src/main').main;
var rollup = require('gulp-rollup');
var sourcemaps = require('gulp-sourcemaps');
var rename = require('gulp-rename');

/**
 * Cleanup dist-folder
 */
gulp.task('clean', function() {
  return del(['dist, build']);
});

/**
 * Copies the 'README.md' file.
 */
gulp.task('copy:readme', function() {
  return gulp.src('README.md').pipe(gulp.dest('dist'));
});

/**
 * Copies the 'package.json' file.
 */
gulp.task('copy:package.json', function() {
  return gulp.src('package.json').pipe(gulp.dest('dist'));
});

gulp.task('copy:static-files', ['copy:readme', 'copy:package.json']);

/**
 * NGC-compile sources
 */
gulp.task('copy:sources', function() {
  return gulp.src([
      'index.ts',
      'src/**/*',
      'node_modules/companion/tsconfig.es5.json'
  ])
  .pipe(gulp.dest('build'));
});

gulp.task('ngc:es5', function() {
  return ngc({
    project: 'build/tsconfig.es5.json'
  });
});

gulp.task('rollup:fesm', function () {
  return gulp.src('build/**/*.js')
      .pipe(sourcemaps.init())
      .pipe(rollup({
        entry: 'build/index.js',
        format: 'es'
      }))
      .pipe(rename('wizard.es5.js'))
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest('dist/modules'));
});


gulp.task('compile', function () {
  //return runSequence('copy:sources', 'ngc:es5', 'rollup:fesm');
  return runSequence('copy:sources');
});

/**
 * Build distributable.
 */
gulp.task('build', ['copy:static-files', 'compile']);

/**
 * Rebuilds component library.
 */
gulp.task('default', function() {
  return runSequence('clean', 'build');
});
