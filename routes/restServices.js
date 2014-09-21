var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/getRanking', function(req, res) {
  var Round = req.models["rounds"];
  var retorno = [];
  Round
  	.find()
  	.limit("3")// last 3 weeks
  	.sort("_id")
  	.exec(function(error, result){

  		for(var i=0; i< result.length; i++){
  			var rankingTemp = [];
  			for(var j=0; j< result.ranking.length;j++){
  				rankingTemp.push({
  					userId: result.ranking[j].result.ranking,
  					score: result.ranking[j].result.score
  				});
  			}
	  		
  			retorno.push({
  				start_date: round.start_date,
  				end_date: round.end_date,
  				ranking: rankingTemp
  			});
  		}
  		res.send(retorno);
  	});
});

router.post("/addUser", function(req, res){
	var User = req.models["users"];

	var user = new User({
		_id: req.body.id,
		name: req.body.name,
		age: req.body.age
	})
	.save(function(error, user){
		if (error){
			res.send({message:"Error al guardar.", error: true});
		}
		else{
			res.send({message:"Operacion exitosa.", error: false});
		}
	});
});

router.get("/getRound", function(req, res){
	
	var Rounds = req.models["rounds"];
	var numberWeek = (new Date()).getWeek();

	Rounds
		.findOne({_id: numberWeek})
		.exec(function(error, round){
			if (error){
				res.send("ERROR");
			}
			else{
				res.send({
					weekNumber: round._id,
					start_date: round.start_date,
					end_date: round.end_date,
					ranking: round.ranking,
					challengeList: round.challengeList
				});
			}
		});
});

router.post('/sendScore', function(req, res) {
	// roundID,score, userID

	var Users = req.models["users"];
	Users
	.findOne({_id: req.body.userID})
	.exec(function(error, user){

		if (user){
		
			var Rounds = req.models["rounds"];
			
			Rounds
			.findOne({_id: req.body.roundID})
			.exec(function(error, round){

				var ranking = round.ranking, 
					i=0, 
					ui = req.body.userID;
					console.log(ranking.length);
					while (i<ranking.length && ranking[i].userId!=ui){
						i++;
					}

					if (i>=ranking.length){
						round.ranking.push({
							userId: ui,
							score: req.body.score
						})

						round.save(function(error, round){
							if (error){
								res.send({message: "Error al guardar.", error: true});
							}
							else{
								res.send({message: "Operacion exitosa.", error: false});
							}
						});
					}
					else{
						round.ranking[i].score = parseInt(req.body.score) + parseInt(round.ranking[i].score);
						round.save(function(error, round){
							if (error){
								res.send({message: "Error al guardar.", error: true});
							}
							else{
								res.send({message: "Operacion exitosa.", error: false});
							}
						});
					}
				
			});

		}
		else{
			res.send({message: "No existe usuario.", error: true});
		}
	});	
});


router.post('/addChallenge', function(req, res){
	var Challenge = req.models["challenges"];
			
	var newChallenge = new Challenge({
		_id: parseInt(req.body._id),
		language: req.body.language,
		name: req.body.name,
		description: req.body.description,
		active: req.body.active
	}).save(function(error,newChallenge){
		if (error){
			res.send({message: "Error al guardar.", error: true});
		}
		else{
			res.send({message: "Operacion exitosa.", error: false});
		}
	});


	
});

module.exports = router;

Date.prototype.getWeek = function() {
	var onejan = new Date(this.getFullYear(),0,1);
	return Math.ceil((((this - onejan) / 86400000) + onejan.getDay()+1)/7);
}