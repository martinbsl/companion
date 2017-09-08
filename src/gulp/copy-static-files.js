const gulp = require('gulp');

require('./definitions');

/**
 * Copies the 'README.md' file.
 */
gulp.task('copy:readme', function () {
    return gulp.src(README_MD).pipe(gulp.dest(DIST_FOLDER));
});

/**
 * Copies the 'package.json' file.
 */
gulp.task('copy:package.json', function () {
    return gulp.src(PACKAGE_JSON).pipe(gulp.dest(DIST_FOLDER));
});

gulp.task('copy:static-files', ['copy:readme', 'copy:package.json']);

