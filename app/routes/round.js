var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/getRanking', function(req, res) {
  var Round = req.models["rounds"];
  var retorno = [];
  Round
    .find()
    .limit("3")// last 3 weeks
    .sort({_id: 'desc'})
    .exec(function(error, result){

      if (error){
        res.send({error:true, message: error.message});
        return;
      }

      for(var i=0; i< result.length; i++){
        var rankingTemp = [];
        for(var j=0; j< result[i].ranking.length;j++){
          rankingTemp.push({
            userName: result[i].ranking[j].userName,
            score: result[i].ranking[j].score
          });
        }
        
        ordenar(rankingTemp);

        retorno.push({
          numberWeek: result[i]._id,
          start_date: result[i].start_date,
          end_date: result[i].end_date,
          ranking: rankingTemp
        });
      }
      res.send(retorno);
    });

    function ordenar( array){
      var  swap;
      for(var i=0; i< array.length; i++){

        for(var j=i+1; j< array.length; j++){

          if (parseInt(array[j]).score > parseInt(array[i].score)){
            swap = array[i];
            array[i] = array[j];
            array[j] = swap;
          }

        }
      }
    }
});



router.get("/getRound", function(req, res){
  
  var Rounds = req.models["rounds"];
  var numberWeek = (new Date()).getWeek();

  Rounds
    .findOne({_id: numberWeek})
    .exec(function(error, round){
      
      if (error){
        res.send({error: true, message: error.message });
        return;
      }

      if(round){
        res.send({
          weekNumber: round._id,
          start_date: round.start_date,
          end_date: round.end_date,
          ranking: round.ranking,
          challengeList: round.challengeList
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
      
      Rounds
      .findOne({_id: req.body.roundID})
      .exec(function(error, round){

        if (round){
          var ranking = round.ranking, 
            i=0, 
            ui = req.body.userID;
            while (i<ranking.length && ranking[i].id != user._id){
              i++;
            }

            if (i>=ranking.length){
              round.ranking.push({
                id: user._id,
                userName: user.name,
                score: req.body.score
              })

              round.save(function(error, round){
                if (error){
                  res.send({message: "Fallo al guardar puntaje.", error: true});
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
                  res.send({message: "Fallo al guardar puntaje.", error: true});
                }
                else{
                  res.send({message: "Operacion exitosa.", error: false});
                }
              });
            }
        }
        else{
          res.send({error: true, message: "No existe ronda."});
        } 
      });

    }
    else{
      res.send({message: "No existe usuario.", error: true});
    }
  }); 
});

module.exports = router;


