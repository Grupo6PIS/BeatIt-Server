#!/usr/bin/env node
var debug = require('debug')('Server');
var app = require('./app/app');

app.set('port', process.env.OPENSHIFT_NODEJS_PORT || 3000);
app.set('address', process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1");

var server = app.listen(app.get('port'),app.get('address'), function() {
  debug('Express server listening on port ' + server.address().port);
});
