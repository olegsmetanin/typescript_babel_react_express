var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var ts = require('gulp-typescript');
var babel = require('gulp-babel');
var mocha = require('gulp-mocha');
var webpack = require('webpack-stream');
var fs = require('fs');



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

gulp.task("watch:webclient", function() {
  var config = require('./webpack.client.config.js');
  config.watch = true;
  return gulp.src('src/webclient/index.ts')
    .pipe(webpack(config))
    .pipe(gulp.dest('build/webpublic/static/js'));
});

gulp.task("webclient", ['webpublic', 'watch:webclient'], function() {
  gulp.watch(['src/webpublic/**'], ['webpublic']);
});

gulp.task('build:server:resources', function() {
  // gulp.src(['src/server/*.raml']).pipe(gulp.dest('build/server'
  //   ));
});

gulp.task('build:server:resources:api', function(done) {
  var swaggerDoc = require('./src/common/api/api.json');

  function flattenRefs(obj, defs) {
    for(var key in obj) {
      if (obj.hasOwnProperty(key) && key === '$ref' && typeof obj[key] === 'string') {
        var path = obj[key];
        //console.log('path', path);
        if (!path || path.indexOf('#/definitions') === 0) continue;

        var prefix = './src/common/api/';
        var dotpath = path.replace('/', '.');
        defs[dotpath] = require(prefix + path);
        obj[key] = '#/definitions/' + dotpath;
      }

      if (typeof obj[key] === 'object') {
        flattenRefs(obj[key], defs);
      }
    }
  }

  swaggerDoc.definitions = swaggerDoc.definitions || {};
  flattenRefs(swaggerDoc, swaggerDoc.definitions);
  flattenRefs(swaggerDoc.definitions, swaggerDoc.definitions);

  //console.log(JSON.stringify(swaggerDoc, null, 2));
  fs.writeFileSync('./build/webpublic/static/api.json', JSON.stringify(swaggerDoc, null, 2), 'utf-8');
  done();
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

gulp.task('server', ['build:server:resources', 'build:server:resources:api', 'build:server'], function() {
  server.start();
  gulp.watch('src/**/*.{ts,tsx}', ['watch:server']);
  gulp.watch('src/common/api/**/*.{json}', ['build:server:resources:api']);

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

gulp.task('default', ['webpublic', 'build:webclient', 'build:server:resources:api', 'build:server']);
