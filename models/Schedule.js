const mongoose = require('mongoose')
	, Schema = mongoose.Schema
	, Project = require('./Project')
	, Taskbar = require('./Taskbar')

const scheduleSchema = new Schema({
	projectId: { 
		type: Schema.Types.ObjectId, 
		ref: 'Project'
	},
	pending: {
		time: String,
		text: String,
		discussion: String
	},
	start: {
		time: String,
		text: String,
		discussion: String,
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
		taskbars: {
			frontEnd: { 
				type: Schema.Types.ObjectId, 
				ref: 'Taskbar'
			},
			backstage: { 
				type: Schema.Types.ObjectId, 
				ref: 'Taskbar'
			},
			backEnd: { 
				type: Schema.Types.ObjectId, 
				ref: 'Taskbar'
			}
		}
	},
	check: {
		time: String,
		text: String,
		discussion: String
	},
	finish: {
		time: String,
		text: String,
		discussion: String
	}
})
module.exports = mongoose.model('Schedule', scheduleSchema)