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

gulp.task("webpack", function() {
  var config = require('./webpack.client.config.js');
  return gulp.src('src/webclient/index.ts')
    .pipe(webpack(config))
    .pipe(gulp.dest('build/webpublic/assets/js'));
});

gulp.task('build:webclient', ['webpack', 'webpublic']);

gulp.task("webpack-watch", function() {
  var config = require('./webpack.client.config.js');
  config.watch = true;
  return gulp.src('src/webclient/index.ts')
    .pipe(webpack(config))
    .pipe(gulp.dest('build/webpublic/assets/js'));
});

gulp.task('webclient', ['webpack-watch', 'webpublic']);

var tsProject = ts.createProject('./tsconfig.json');

gulp.task('build:server:resources', function() {
  gulp.src(['src/server/*.raml']).pipe(gulp.dest('build/server'
    ));
});

gulp.task('build:server', ['build:server:resources'], function() {
    return gulp.src(['src/**/*.ts', 'src/**/*.tsx'])
        .pipe(sourcemaps.init())
        .pipe(ts(tsProject))
        .pipe(babel())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('build'));
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

gulp.task('default', ['build:server', 'build:webclient']);
