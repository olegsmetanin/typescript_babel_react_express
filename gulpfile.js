var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var ts = require('gulp-typescript');
var babel = require('gulp-babel');
var mocha = require('gulp-mocha');
var webpack = require('webpack-stream');



var node_env = process.env.NODE_ENV;
// This plugin set process.env.NODE_ENV = 'development' WTF?!!
var gls = require('gulp-live-server');
// restore original process.env.NODE_ENV
process.env.NODE_ENV = node_env;

gulp.task('webpublic', function() {
  gulp.src(['src/webpublic/**']).pipe(gulp.dest('build/webpublic'
    ));
});

gulp.task("build:webclient", function() {
  var config = require('./webpack.client.config.js');
  return gulp.src('src/webclient/index.ts')
    .pipe(webpack(config))
    .pipe(gulp.dest('build/webpublic/static/js'));
});

gulp.task("webclient", ['webpublic', 'build:webclient'], function() {
  gulp.watch(['src/webclient/**/*.{ts,tsx}'], ['build:webclient']);
  gulp.watch(['src/webpublic/**'], ['webpublic']);
});

gulp.task('build:server:resources', function() {
  gulp.src(['src/server/*.raml']).pipe(gulp.dest('build/server'
    ));
});

gulp.task('build:server', function() {
  var config = require('./webpack.server.config.js');
  return gulp.src('src/server/index.ts')
    .pipe(webpack(config))
    .pipe(gulp.dest('build/server'));
});

var server = gls(['./build/server/server.js'], {cwd: __dirname, env: {NODE_ENV: 'development'}}, 35729);

gulp.task('watch:server', ['build:server'], function () {
  server.start.bind(server)();
});

gulp.task('server', ['build:server:resources', 'build:server'], function() {
  server.start();
  gulp.watch('src/**/*.ts', ['watch:server']);
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

gulp.task('default', ['webpublic', 'build:webclient', 'build:server:resources', 'build:server']);
