var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/getRanking', function(req, res) {
	var Round = req.models["rounds"];
	var retorno = [];

	Round
	.find()
	.limit("3")// last 3 weeks
	.sort({ "_id": 'desc'})
	.exec(function(error, result){

		if (error){
			res.send({error:true, message: error.message});
			return;
		}

		for(var i=0; i< result.length; i++){

			ordenar(result[i].ranking);
			retorno.push({
				numberWeek: result[i]._id,
				start_date: result[i].start_date,
				end_date: result[i].end_date,
				ranking: result[i].ranking
			});

		}
		res.send({
			error: false,
			data: retorno
		});
	});
});



router.get("/getRound", function(req, res){
	
	var Rounds = req.models["rounds"];
	
	Rounds
	.findOne()
	.sort({ "_id": 'desc'})
	.exec(function(error, round){

		console.log(error, round);

		if (error){
			res.send({error: true, message: error.message });
			return;
		}

		if(round){

			ordenar(round.ranking);
			
			res.send({
				error: false,
				round: {
					weekNumber: round._id,
					start_date: round.start_date,
					end_date: round.end_date,
					ranking: round.ranking,
					challengeList: round.challengeList
				}
			});
		}
		else{
			res.send({error: true, message: "No hay rondas creadas."});
		}
	});
});

router.post('/sendScore', function(req, res) {

	var Users = req.models["users"];

	Users
	.findOne({ _id: req.body.userID})
	.exec(function(error, user){

		if (user){

			var Rounds = req.models["rounds"];
			var roundId = req.body.roundId;

			if (roundId){
				Rounds
				.findOne({ "_id": roundId})
				.exec(function(error, round){
					updateRound(error, round, req, res, user);
				});

			}else{
				Rounds
				.findOne()
				.sort({ "_id": 'desc'})
				.exec(function(error, round){
					updateRound(error, round, req, res, user);
				});
			}



		}
		else{
			res.send({message: "No existe usuario.", error: true});
		}

	}); 
});

function ordenar( array){

	var swap, 
	retorno = [], 
	maxInd;

	for(var i=0; i< array.length; i++){

		maxInd = i;

		for(var j=i+1; j< array.length; j++){

			if (parseInt(array[j].score) > parseInt(array[i].score)){
				swap = array[i];
				array[i] = array[j];
				array[j] = swap;
			}

		}
	}
}

function updateRound(error, round, req, res, user){

	if (round){

		var userRanking = round.ranking.filter(function(aSome) {
			return aSome.id === req.body.userID;
		}).pop(),
			score = req.body.score ? req.body.score : 0;

		if (userRanking){

			userRanking.score = Math.max( parseInt( score), parseInt(userRanking.score) );
			round.save(function(error, userRanking){
				if (error){
					res.send({message: "Fallo al guardar puntaje.", error: true});
				}
				else{
					res.send({message: "Operacion exitosa.", error: false});
				}

			});
		}
		else{
			round.ranking.push({
				id: req.body.userID,
				score: parseInt( score), 
				userName: user.name, 
				imageURL: user.imageURL
			});
			round.save(function(error, round){
				if (error){
					res.send({error: true, message: "Problemas con operacion."});
					return;
				}
				else{
					res.send({error: false, message: "Operacion exitosa."});
				}
			});
		}
	}
	else{
		res.send({error: true, message: "No existe ronda."});
	}
}

module.exports = router;


