const mongoose = require('mongoose')
	, Schema = mongoose.Schema

const backendSchema = new Schema({
	task1: {
		txt: String,
		completion: Boolean
	},
	task2: {
		txt: String,
		completion: Boolean
	},
	task3: {
		txt: String,
		completion: Boolean
	},
	task4: {
		txt: String,
		completion: Boolean
	},
	task5: {
		txt: String,
		completion: Boolean
	},
	task6: {
		txt: String,
		completion: Boolean
	},
	task7: {
		txt: String,
		completion: Boolean
	},
	task8: {
		txt: String,
		completion: Boolean
	}
})
module.exports = mongoose.model('Backend', backendSchema)