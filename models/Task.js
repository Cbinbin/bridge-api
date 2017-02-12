const mongoose = require('mongoose')
	, Schema = mongoose.Schema

const taskSchema = new Schema({
	txt: String,
	completion: Boolean
})
module.exports = mongoose.model('Task', taskSchema)