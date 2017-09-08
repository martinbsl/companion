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
const fs = require('fs');

require('./gulp/definitions');
require('./gulp/copy-static-files');

/**
 * Cleanup dist-folder
 */
gulp.task('clean', function() {
  return del(['dist, build']);
});


// COPY SOURCES ========================================================================================================
gulp.task('copy:component-sources', function() {
    return gulp.src(`${SRC_FOLDER}/**/*`)
        .pipe(gulp.dest(`${BUILD_FOLDER}/${SRC_FOLDER}`));
});

gulp.task('copy:public-api', function () {
    return gulp.src('public_api.ts',)
    .pipe(gulp.dest(BUILD_FOLDER));
});

gulp.task('copy:sources', ['copy:component-sources', 'copy:public-api']);


const libraryName = 'hello-world';
const libraryId = 'hello-world';

// NGC =================================================================================================================
gulp.task('create-tsconfig:FESM5', function() {
    const tsconfig = JSON.parse(fs.readFileSync('./node_modules/companion/tsconfig.json').toString());
    tsconfig.compilerOptions.target = 'es5';
    tsconfig.files = ['public_api.ts'];
    tsconfig.angularCompilerOptions.flatModuleOutFile = `${libraryName}.es5.js`;
    tsconfig.angularCompilerOptions.flatModuleId = libraryId;

    fs.writeFileSync(`${BUILD_FOLDER}/tsconfig.json`, JSON.stringify(tsconfig));
});

gulp.task('create-tsconfig:FESM15', function() {
    const tsconfig = JSON.parse(fs.readFileSync('./node_modules/companion/tsconfig.json').toString());
    tsconfig.compilerOptions.target = 'es2015';
    tsconfig.files = ['public_api.ts'];
    tsconfig.angularCompilerOptions.flatModuleOutFile = `${libraryName}.js`;
    tsconfig.angularCompilerOptions.flatModuleId = libraryId;

    fs.writeFileSync(`${BUILD_FOLDER}/tsconfig.json`, JSON.stringify(tsconfig));
});

gulp.task('ngc', function() {
  return ngc({
    project: `${BUILD_FOLDER}/tsconfig.json`
  }).then(exitCode => {
      if (exitCode) {
        throw new Error('ngc compilation failed');
      }
  });
});

gulp.task('copy:entry-points', function() {
    return gulp.src([
        `${BUILD_FOLDER}/public_api.d.ts`,
        `${BUILD_FOLDER}/${libraryName}.d.ts`,
        `${BUILD_FOLDER}/${libraryName}.metadata.json`,
    ]).pipe(gulp.dest(DIST_FOLDER));
});

gulp.task('ngc:FESM15', function() {
    return runSequence('create-tsconfig:FESM15', 'ngc', 'copy:entry-points');
});

gulp.task('ngc:FESM5', function() {
    return runSequence('create-tsconfig:FESM5', 'ngc');
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
  return runSequence('copy:sources', 'ngc:FESM15', 'ngc:FESM5');
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
