var express = require('express');
var router = express.Router();

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
      res.send({message: "Problema al guardar desafio.", error: true});
    }
    else{
      res.send({message: "Operacion exitosa.", error: false});
    }
  });  
});

router.post('/activeChallenge', function(req, res ){
  var Challenge = req.models["challenges"];

  Challenge
  .find({_id: req.body.challengeID})
  .exec(function(error, challenge){

    if (error){
      res.send({error: true, message: error.message});
      return;
    }

    if (challenge && req.body.active){
      challenge.active = req.body.active;
      challenge.save(function(error, challenge){
         if (error){
            res.send({error: true, message: error.message});
            return;
         }
      });
    }

  });
});


module.exports = router;