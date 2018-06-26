//This is where we will be creating a schema and model for the documents in the dishes collection

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const dishSchema = new Schema({
	name : {
		type: String,
		required: true,
		unique: true
	},
	description : {
		type: String,
		required: true
	}
},{
	timestamps: true
});

var Dishes = mongoose.model('Dish', dishSchema);

module.exports = Dishes;