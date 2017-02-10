const mongoose = require('mongoose')
	, Schema = mongoose.Schema
	, Project = require('./Project')

const customerSchema = new Schema({
	openid: { type: String },
	nickname: { type: String },
	sex: { type: String },
	headimg: { type: String },
	origin: { type: String },
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
	allProjects: [{ 
		type: Schema.Types.ObjectId, 
		ref:'Project' 
	}],
	remark: { type: String }
})
module.exports = mongoose.model('Customer', customerSchema)