var express = require('express');
var debug = require('debug')('Server');
var router = express.Router();


router.post("/login", function(req, res){
	var User = req.models["users"];

	User
	.findOne({_id: req.body.userID })
	.exec(function(error, user){
		
		console.log(req.body);

		if (user){
			res.send({error: false, user: user.toJSON()});
		}
		else{
			res.send({error: true, message: "No existe usuario."});
		}
	});

});

router.post("/updateUser", function(req, res){
	var User = req.models["users"];

	User
	.findOne({_id: req.body.userID })
	.exec(function(error, user ){

		if (user){ // existe usuario

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
				_id: req.body.userID,
				imageURL: req.body.imageURL,
				name: req.body.name
			});

			newUser.save(function(error, userSaved){
				if (error){
					res.send({error: true, message: error.message});
				}
				else if (userSaved){
					res.send({error: false, user: userSaved.toJSON()});
				}
			});

		}

	});
});

module.exports = router;