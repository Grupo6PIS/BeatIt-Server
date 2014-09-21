var schedule = require('node-schedule');

var rule = new schedule.RecurrenceRule();
rule.minute = 5;

var job = schedule.scheduleJob(rule, function(){
    
});