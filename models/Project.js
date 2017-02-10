const mongoose = require('mongoose')
	, Schema = mongoose.Schema
	, Design = require('./Design')
	, Document = require('./Document')
	, Customer = require('./Customer')
	, Schedule = require('./Schedule')
	, Developer = require('./Developer')

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
		ref: 'Customer'
	},
	schedule: { 
		type: Schema.Types.ObjectId, 
		ref: 'Schedule'
	},
	developers: { 
		frontEnd: [{
			type: Schema.Types.ObjectId, 
			ref: 'Developer'
		}],
		backstage: [{
			type: Schema.Types.ObjectId, 
			ref: 'Developer'
		}],
		backEnd: [{
			type: Schema.Types.ObjectId, 
			ref: 'Developer'
		}]
	}
})
module.exports = mongoose.model('Project', projectSchema)