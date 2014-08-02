
/**
 * Module dependencies.
 */

var express = require('express');
var contacts = require('./app/controllers/contacts');
var http = require('http');
var path = require('path');
var fs = require('fs');
var mongoose = require('mongoose');
var models_path = __dirname + '/app/models';
fs.readdirSync(models_path).forEach(function (file) {
  if (~file.indexOf('.js')) require(models_path + '/' + file);
});

var app = express();


mongoose.connect('mongodb://localhost/contact_book');

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/app/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(require('stylus').middleware(__dirname + '/public'));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

//app.get('/', contacts.home);
app.get('/api/contacts', contacts.index);
app.get('/api/contacts/:id', contacts.show);

app.post('/api/contacts', contacts.add);
app.put('/api/contacts/:id', contacts.update);
app.delete('/api/contacts/:id', contacts.remove);


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
