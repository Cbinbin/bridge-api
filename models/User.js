const mongoose = require('mongoose')
	, Schema = mongoose.Schema

const userSchema = new Schema({
	openid: { type: String },
	nickname: { type: String },
	sex: { type: String },
	headimg: { type: String },
	origin: { type: String }
})
module.exports = mongoose.model('User', userSchema)