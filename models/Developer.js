const mongoose = require('mongoose')
	, Schema = mongoose.Schema
	, Project = require('./Project')

const developerSchema = new Schema({
	openid: { type: String },
	nickname: { type: String },
	sex: { type: String },
	headimg: { type: String },
	origin: { type: String },
	position: { type: String },
	phone: { type: Number },
	QQ: { type: Number },
	signature: { type: String },
	introduction: { type: String },
	status: { 
		type: String, 
		enum: ['on', 'off'] 
	},
	projectTime: { type: Number },
	totalTime: { type: Number },
	doing: { 
		type: Schema.Types.ObjectId, 
		ref:'Project' 
	},
	participations: [{ 
		type: Schema.Types.ObjectId, 
		ref:'Project' 
	}]
})
module.exports = mongoose.model('Developer', developerSchema)