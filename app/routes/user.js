var express = require('express');
var debug = require('debug')('Server');
var router = express.Router();


router.post("/addOrUpdateUser", function(req, res){
	var User = req.models["users"];

	User
	.findOne({_id: req.body.userID})
	.exec(function(error, user ){

		if (user){ // existe usuario
			if (req.body.facebookID){
				user.facebookID = req.body.facebookID;
			}

			if (req.body.twitterID){
				user.twitterID = req.body.twitterID;
			}

			if (req.body.name){
				user.name = req.body.name;
			}

			if (req.body.imageURL){
				user.imageURL = req.body.imageURL;
			}

			user.save();
			res.send({error: false, user: user.toJSON() });
		}
		else{
			var newUser = new User({
				facebookID: req.body.facebookID,
				twitterID: req.body.twitterID,
				name: req.body.name,
				imageURL: req.body.imageURL
			});
			newUser
			.save(function(error, user){
				if (error){
					res.send({error: true, message: error.message});
				}
				else if(user){
					res.send({error: false, user: user.toJSON() });
				}
			});
		}

	});
});

module.exports = router;