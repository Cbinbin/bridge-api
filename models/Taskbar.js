const mongoose = require('mongoose')
	, Schema = mongoose.Schema
	, Task = require('./Task')

const taskbarSchema = new Schema({
	part: {
		type: String,
		enum: ['frontEnd', 'backstage', 'backEnd']
	},
	column: [{
		type: Schema.Types.ObjectId,
		ref: 'Task'
	}]
})
module.exports = mongoose.model('Taskbar', taskbarSchema)