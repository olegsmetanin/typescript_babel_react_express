var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var ts = require('gulp-typescript');
var babel = require('gulp-babel');
var mocha = require('gulp-mocha');



var node_env = process.env.NODE_ENV;
// This plugin set process.env.NODE_ENV = 'development' WTF?!!
var gls = require('gulp-live-server');
// restore original process.env.NODE_ENV
process.env.NODE_ENV = node_env;


var tsProject = ts.createProject('./tsconfig.json');

gulp.task('build:server', function() {
    return gulp.src(['src/**/*.ts'])
        .pipe(sourcemaps.init())
        .pipe(ts(tsProject))
        .pipe(babel())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('build'));
});

gulp.task('watch', function() {

});

var serverArgs = ['./build/server/index.js'];

gulp.task('server', ['build:server'], function() {
  var server = gls(serverArgs, undefined, 35729);
  server.start();
  gulp.watch('src/**/*.ts', ['build:server']);
  gulp.watch(['build/framework/**/*.js', 'build/server/**/*.js'], function() {
    server.start.bind(server)();
  });
});

gulp.task('test', ['build:server'], function() {
  return gulp.src('build/test/**/*.js')
    .pipe(mocha())
    .once('error', function () {
      process.exit(1);
    })
    .once('end', function () {
      process.exit();
    });
});

gulp.task('default', ['build:server']);
