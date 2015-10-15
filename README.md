# typescript_babel_react_express
typescript+babel+react+express

npm install

npm run tsd install


npm run devserver

!!!!
Due https://github.com/brianc/node-postgres/issues/838
comment
// lazy require native module...the native module may not have installed
// module.exports.__defineGetter__("native", function() {
//   delete module.exports.native;
//   module.exports.native = new PG(require('./native'));
//   return module.exports.native;
// });

in

node_modules/pg/lib/index.js
