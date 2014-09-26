var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var user= new Schema({
	facebookID: String,
	twitterID: String,
	name: String,
	imageURL: String
});



var challenge = new Schema({
	_id: {type: Number,  required: true , unique: true},
	language: String,
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
			id: String,
			score: {type: Number,  default: 0 }, 
			userName: String
		}
	]
});

mongoose.model('users', user);
mongoose.model('challenges', challenge);
mongoose.model('rounds', round);


mongoose.connect("mongodb://admin:tzZba9LWXRBX@"+process.env.OPENSHIFT_MONGODB_DB_HOST+":"+process.env.OPENSHIFT_MONGODB_DB_PORT+"/beatit"); 
