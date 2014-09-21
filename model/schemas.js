var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var user= new Schema({
	//facebookID
	_id: {type: String, required: true , index: true, unique: true},
	name: {type: String, required: true },
	age: {type: Number, required: true }
});



var challenge = new Schema({
	_id: {type: Number,  required: true , unique: true},
	language: {type: String,  required: true },
	name: {type: String,  required: true },
	description: String,
	active: {type: Boolean,  required: true }
});

var round= new Schema({
	_id: {type: Number,  required: true, unique: true },
	start_date: {type: Date,  required: true },
	end_date: {type: Date,  required: true },
	challengeList: [
		{
			_id:  {type: Number,  required: true , unique: true , index: true},
			challengeName: {type: String, require: true}
		}
	],
	ranking: [
		{
			userId: {type: String,  required: true },
			score: {type: String,  default: 0 }
		}
	]
});

mongoose.model('users', user);
mongoose.model('challenges', challenge);
mongoose.model('rounds', round);


mongoose.connect('mongodb://localhost:27017/test'); 
