var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    notify = require('gulp-notify'),
    rename = require('gulp-rename');

gulp.task('default', function () {
    gulp.src([
        'slick/slick.js'
    ])
        .pipe(uglify())
        .pipe(rename('slick.min.js'))
        .pipe(gulp.dest('./slick'))
        .pipe(notify('Minified'));
});