const mongoose = require('mongoose')
	, Schema = mongoose.Schema
	, Design = require('./Design')
	, Document = require('./Document')
	, User = require('./User')
	, Schedule = require('./Schedule')

const projectSchema = new Schema({
	title: { type: String },
	version: { type: String },
	picture: { type: String },
	cycle: { type: Number },
	startDate: { type: Date },
	endDate: { type: Date },
	progression: { 
		type: String, 
		enum:['pending', 'start', 'going', 'check', 'finish'] 
	},
	participants: { type: Number },
	designs: [{ 
		type: Schema.Types.ObjectId, 
		ref: 'Design'
	}],
	document: { 
		type: Schema.Types.ObjectId, 
		ref: 'Document'
	},
	possessor: { 
		type: Schema.Types.ObjectId, 
		ref: 'User'
	},
	schedule: { 
		type: Schema.Types.ObjectId, 
		ref: 'Schedule'
	},
	developers: { 
		frontEnd: [{
			type: Schema.Types.ObjectId, 
			ref: 'User'
		}],
		backstage: [{
			type: Schema.Types.ObjectId, 
			ref: 'User'
		}],
		backEnd: [{
			type: Schema.Types.ObjectId, 
			ref: 'User'
		}]
	},
	createdAt: {
		type: Date, 
		default: Date.now
	},
	updatedAt: { type: Date }
})
module.exports = mongoose.model('Project', projectSchema)