const mongoose = require('mongoose')
	, Schema = mongoose.Schema
	, Project = require('./Project')

const designSchema = new Schema({
	projectId: { 
		type: Schema.Types.ObjectId, 
		ref: 'Project'
	},
	filename: { type: String },
	designUrl: { type: String }
})
module.exports = mongoose.model('Design', designSchema)