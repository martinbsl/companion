/*
 * Companion main build-file.
 */
const gulp = require('gulp');
const del = require('del');
const runSequence = require('run-sequence');
const ngc = require('@angular/compiler-cli/src/main').main;
const rollup = require('gulp-rollup');
const sourcemaps = require('gulp-sourcemaps');
const rename = require('gulp-rename');


require('./gulp/copy-static-files');

/**
 * Cleanup dist-folder
 */
gulp.task('clean', function() {
  return del(['dist, build']);
});

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
