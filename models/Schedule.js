const mongoose = require('mongoose')
	, Schema = mongoose.Schema
	, Project = require('./Project')
	, Taskbar = require('./Taskbar')
	, Content = require('./Content')

const scheduleSchema = new Schema({
	projectId: { 
		type: Schema.Types.ObjectId, 
		ref: 'Project'
	},
	pending: {
		time: [{
			type: Date
		}],
		text: String,
		discussion: String
	},
	start: {
		time: [{
			type: Date
		}],
		text: String,
		discussion: String,
		contents: [{
			type: Schema.Types.ObjectId, 
			ref: 'Content'
		}]
	},
	going: {
		time: [{
			type: Date
		}],
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
		time: [{
			type: Date
		}],
		text: String,
		discussion: String
	},
	finish: {
		time: [{
			type: Date
		}],
		text: String,
		discussion: String
	}
})
module.exports = mongoose.model('Schedule', scheduleSchema)