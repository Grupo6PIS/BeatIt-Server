var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var user= new Schema({
	_id: {type: String,  required: true , unique: true},
	name: String,
	imageURL: String
});



var challenge = new Schema({
	_id: {type: Number,  required: true , unique: true},
	language: String,
	name: {type: String,  required: true },
	description: String,
	active: {type: Boolean,  required: true },
	colorHex: String,
	maxAttemps: {type: String, default: 3}
});

var round= new Schema({
	_id: {type: Number,  required: true, unique: true },
	start_date: {type: Number,  required: true },
	end_date: {type: Number,  required: true },
	challengeList: [
	{
		id: {type: Number},
		challengeName: {type: String, require: true},
		challengeLevel: {type: Number, default: 1},
		colorHex: String,
		maxAttemps: Number,
		active: Boolean
	}
	],
	ranking: [
	{
		id: String,
		score: {type: Number,  default: 0 }, 
		userName: String, 
		imageURL: String
	}
	]
});

mongoose.model('users', user);
mongoose.model('challenges', challenge);
mongoose.model('rounds', round);


mongoose.connect("mongodb://admin:pM4W9SukXggR@"+process.env.OPENSHIFT_MONGODB_DB_HOST+":"+process.env.OPENSHIFT_MONGODB_DB_PORT+"/beatit"); 
