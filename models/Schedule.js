const mongoose = require('mongoose')
	, Schema = mongoose.Schema
	, Project = require('./Project')
	, FrontEnd = require('./FrontEnd')
	, Backstage = require('./Backstage')
	, BackEnd = require('./BackEnd')

const scheduleSchema = new Schema({
	projectId: { 
		type: Schema.Types.ObjectId, 
		ref: 'Project'
	},
	pending: {
		time: String,
		text: String
	},
	start: {
		time: String,
		text: String,
		tasks: {
			txt1: String,
			txt2: String,
			txt3: String,
			txt4: String,
			txt5: String,
			txt6: String,
		}
	},
	going: {
		time: String,
		text: String,
		taskbar: {
			frontEnd: { 
				type: Schema.Types.ObjectId, 
				ref: 'FrontEnd'
			},
			backstage: { 
				type: Schema.Types.ObjectId, 
				ref: 'Backstage'
			},
			backEnd: { 
				type: Schema.Types.ObjectId, 
				ref: 'BackEnd'
			}
		}
	},
	check: {
		time: String,
		text: String
	},
	finish: {
		time: String,
		text: String
	}
})
module.exports = mongoose.model('Schedule', scheduleSchema)