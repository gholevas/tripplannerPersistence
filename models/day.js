var mongoose = require('mongoose');

var DaySchema = new mongoose.Schema({
	number: {type:Number, index:true,unique: true, required:true},
	hotel: {type: mongoose.Schema.Types.ObjectId, ref: 'Hotel'},
	restaurant: [{type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant'}],
	activity: [{type: mongoose.Schema.Types.ObjectId, ref: 'Activity'}]
});

module.exports = mongoose.model('Day', DaySchema);