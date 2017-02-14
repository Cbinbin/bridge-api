const mongoose = require('mongoose')
	, Schema = mongoose.Schema

const adminSchema = new Schema({
	admin: { 
		type: String,
		required: true,
		unique: true
	},
	password: { 
		type: String,
		required: true
	}
})
module.exports = mongoose.model('Admin', adminSchema)