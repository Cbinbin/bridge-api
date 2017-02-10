const mongoose = require('mongoose')
	, Schema = mongoose.Schema

const designSchema = new Schema({
	filename: { type: String },
	designUrl: { type: String }
})
module.exports = mongoose.model('Design', designSchema)