/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes');
var sys = require('util');
var app = module.exports = express.createServer();

//MySQL
var mysql = require('mysql');
var config = require('./config')
var client = config.client;
client.query('USE dice');

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes


app.listen(3000, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});


//App

app.get('/', function(req, res){
	res.render('index');
});

app.param(':id', function(req, res, next, id){
	//id
	client.query('SELECT * FROM rolls WHERE id = ?', [id], function(err, info){
		req.roll = info;
		next();
	});
});

app.get('/roll/:id', function(req, res){
	//get info about roll
	var output = '';
	roll = req.roll[0];
	if(roll.number == null) {
		//rollable
		output += "Roll this!";
	} else {
		//already rolled
		output += "Roll value = "+roll.number;
	}
	res.send(output);
});

app.post('/roll', function(req, res){
	if(req.body.action == "Create Roll") {
		//insert roll into db, show roll
		client.query(
			'INSERT INTO rolls (sides) VALUES (?)', [req.body.sides], function(err, info) {
				//redirect to roll:id
				
				res.send('<script>window.location="/roll/'+info.insertId+'";</script>');
				
			}
		);
	} else {
		//this is a roll, roll it!
		
		//save value
		
		//redirect to roll:id
		//res.redirect('/roll/'+id);
	}
});