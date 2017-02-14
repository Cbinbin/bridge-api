const mongoose = require('mongoose')
	, Schema = mongoose.Schema
	, Project = require('./Project')

const contentSchema = new Schema({
	projectId: { 
		type: Schema.Types.ObjectId, 
		ref: 'Project'
	},
	content: {type: String}
})
module.exports = mongoose.model('Content', contentSchema)