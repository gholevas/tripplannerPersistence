var express = require('express');
var router = express.Router();
var models = require('../../models/index.js');
var Hotel = models.Hotel;
var Restaurant = models.Restaurant;
var Activity = models.Activity;
var Day = models.Day;



router.get('/api/days', function(req, res) {
  Day.find({}).populate('hotel')
  .populate('restaurant')
  .populate('activity')
  .exec()
  .then(function(days){
    res.send(days)
  })
  .then(null,function(err){
    throw err;
  })
})


router.post('/api/days', function(req, res) {
  Day.create({number:req.body.number})
  .then(function(day){
    res.send('created')
    console.log('created '+day)
  })
  .then(null,function(err){
    console.log(err);
    throw err;
  })
})

router.delete('/api/days/:num', function(req, res) {
  Day.remove({number:req.params.num})
  .then(null,function(err){
    throw err;
  })
})


router.get('/api/days/:id/:type', function(req, res) {
  res.send('get day '+req.params.id+' '+req.params.type);
})

router.post('/api/days/:number/:type', function(req, res) {

  var type = req.params.type;
  var id = req.body.id;
  var operator;
  if(type === 'hotel'){
    operator = "$set";
  }else operator = "$push";

  Day.findOneAndUpdate(
      {number: req.params.number}, 
      {[operator]: {[type]: id}})
        .then(function(attraction) {
          console.log('attraction is '+attraction)
            res.send({
                message: 'Updated successfully',
                attraction: attraction
            });
        })
        .then(null, function(err) {
            res.statusCode = 500;
            res.send(err);
        })

})


module.exports = router;
