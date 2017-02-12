const mongoose = require('mongoose')
	, Schema = mongoose.Schema
	, Project = require('./Project')
	, Task = require('./Task')

const taskbarSchema = new Schema({
	projectId: { 
		type: Schema.Types.ObjectId, 
		ref: 'Project'
	},
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