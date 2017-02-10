const mongoose = require('mongoose')
	, Schema = mongoose.Schema

const adminSchema = new Schema({
	admin: { type: String },
	password: { type: String }
})
module.exports = mongoose.model('Admin', adminSchema)