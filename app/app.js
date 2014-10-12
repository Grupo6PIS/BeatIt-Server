var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var schemas = require('./model/schemas');
var mongoose = require('mongoose');
var schedule = require('node-schedule');

var userRouter = require('./routes/user');
var roundRouter = require('./routes/round');
var challengeRouter = require('./routes/challenge');

var app = express();

// view engine setup
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var modelos = getModels(mongoose);

app.use(function(req , res, next){
	req.models = modelos;
	next();
});

app.use('/user', userRouter);
app.use('/round', roundRouter);
app.use('/challenge', challengeRouter);

app.use('/', express.static(__dirname + '/'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
	app.use(function(err, req, res, next) {
		res.status(err.status || 500);
		res.render('error', {
			message: err.message,
			error: err
		});
	});
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
	res.status(err.status || 500);
	res.render('error', {
		message: err.message,
		error: {}
	});
});


module.exports = app;

function getModels(db){
	return {
		"users" : db.model("users"),
		"challenges": db.model("challenges"),
		"rounds": db.model("rounds")
	}
}

//************** DATE SETTING *************** //

Date.prototype.getWeek = function() {
	var onejan = new Date(this.getFullYear(),0,1);
	return Math.ceil((((this - onejan) / 86400000) + onejan.getDay()+1)/7);
}


//************* START SCHEDULE ************* //
var weekCounter = (new Date()).getWeek();

var job = schedule.scheduleJob("0 0 12 ? * SUN *", function(){
	console.log(">>", weekCounter);
	var Rounds= mongoose.model("rounds"),
	Challenges = mongoose.model("challenges"),
	TOPE = 10,
	cantSobrantes = 0;

	Challenges
	.find({active: true})
	.exec(function(error, result){
		if (error){
			console.log(error);
		}
		else{
			var sobrantes = result.length - TOPE;
			var now = new Date(),
				date = new Date(now);

			date.setDate(date.getDate()+7);

			var newRound={
				_id: weekCounter,
				start_date: convertDateToUTC(now),
				end_date: convertDateToUTC(date),
				challengeList: [],
				ranking: []
			};

			for(var i=0; i< result.length; i++){

				if (cantSobrantes < sobrantes){

					if ((Math.floor(Math.random() * 1) == 1 )){
						cantSobrantes++;
						newRound.challengeList.push({
							id: result[i]._id,
							challengeName: result[i].name ,
							challengeLevel: Math.floor((Math.random() * 2) + 1),
							colorHex: result[i].colorHex,
							maxAttemps: result[i].maxAttemps,
							active: result[i].active
						});
					}
				}else{
					newRound.challengeList.push({
						id: result[i]._id,
						challengeName: result[i].name, 
						challengeLevel: Math.floor((Math.random() * 2) + 1),
						colorHex: result[i].colorHex,
						maxAttemps: result[i].maxAttemps,
						active: result[i].active
					});
				}
			}

			

			var roundInstance = new Rounds(newRound);
			roundInstance.save(function (error, round){
				console.log(error);
				if (!error){
					weekCounter++;
				}
			});
			
		}
		console.log("<<");
	});
});


function convertDateToUTC(date) {
	return Date.UTC(
					date.getUTCFullYear(),
					date.getUTCMonth(), 
					date.getUTCDate(),  
					date.getUTCHours(),
					date.getUTCMinutes(),
					date.getUTCSeconds()
					);
}

