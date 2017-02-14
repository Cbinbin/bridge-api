const mongoose = require('mongoose')
	, Schema = mongoose.Schema
	, Project = require('./Project')

const userSchema = new Schema({
	//普通用户字段
	openid: { type: String },
	wxInfo: { type: Object },
	mold: { 
		type: String, 
		enum: ['user', 'customer', 'developer'] 
	},
	//开发者字段
	position: { type: String },
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
	}],
	//客户字段
	realname: { type: String },
	telephone: { type: Number },
	company: { type: String },
	companyLogo: { type: String },
	companyAddress: { type: String },
	fax: { type: String },
	seniority: { type: Number },
	serviceDate: { type: String },
	onGoing: [{ 
		type: Schema.Types.ObjectId, 
		ref:'Project' 
	}],
	finishProjects: [{ 
		type: Schema.Types.ObjectId, 
		ref:'Project' 
	}],
	remark: { type: String },
	createdTime: {
		type: Date, 
		default: Date.now
	},
	updatedTime: {
		type: Date, 
		default: Date.now
	}
},{
	timestamps: {
		createdAt: 'createdTime',
		updatedAt: 'updatedTime'
	}
})
module.exports = mongoose.model('User', userSchema)