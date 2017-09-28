var gulp = require('gulp');
var gutil = require('gulp-util');
var bower = require('bower');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var sh = require('shelljs');
var create = require('gulp-cordova-create');
var plugin = require('gulp-cordova-plugin');
var android = require('gulp-cordova-build-android');

var paths = {
  sass: ['./scss/**/*.scss']
};

gulp.task('default', ['sass']);

gulp.task('sass', function (done) {
  gulp.src('./scss/ionic.app.scss')
    .pipe(sass())
    .on('error', sass.logError)
    .pipe(gulp.dest('./www/css/'))
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(rename({
      extname: '.min.css'
    }))
    .pipe(gulp.dest('./www/css/'))
    .on('end', done);
});
gulp.task('install', ['git-check'], function () {
  return bower.commands.install()
    .on('log', function (data) {
      gutil.log('bower', gutil.colors.cyan(data.id), data.message);
    });
});
gulp.task('build', function () {
  return gulp.src('dist')
    .pipe(create())
    .pipe(android({
      release: true,
      storeFile: 'wohlig.keystore',
      keyAlias: 'wohlig'
    }))
    .pipe(gulp.dest('apk'));
});

gulp.task('watch', ['sass'], function () {
  gulp.watch(paths.sass, ['sass']);
});
