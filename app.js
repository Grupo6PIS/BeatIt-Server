var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var schemas = require('./model/schemas');
var mongoose = require('mongoose');
var schedule = require('node-schedule');

var index = require('./routes/index');
var restServices = require('./routes/restServices');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
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

app.use('/', restServices);
app.use('/index', index);

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



//************* START SCHEDULE ************* //


var job = schedule.scheduleJob("01 00 * * 0", function(){
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
            var now = new Date()
            date = new Date(now);

            var newRound={
                _id: now.getWeek(),
                start_date: now,
                end_date: date.setDate(date.getDate()+7) ,
                challengeList: [],
                ranking:[]
            };

            
            for(var i=0; i< result.length; i++){
                
                if (cantSobrantes < sobrantes){
                    
                    if ((Math.floor(Math.random() * 1) == 1 )){
                        cantSobrantes++;
                        newRound.challengeList.push({
                            challengeID: result[i]._id
                        });
                    }
                }else{
                    newRound.challengeList.push({
                        _id: result[i]._id,
                        challengeName: result[i].name
                    });
                }
            }

            new Rounds(newRound).save();
        }
    });
    

    
    
});

