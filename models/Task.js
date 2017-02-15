const mongoose = require('mongoose')
	, Schema = mongoose.Schema
	, Project = require('./Project')

const taskSchema = new Schema({
	projectId: { 
		type: Schema.Types.ObjectId, 
		ref: 'Project'
	},
	txt: String,
	completion: Boolean
})
module.exports = mongoose.model('Task', taskSchema)