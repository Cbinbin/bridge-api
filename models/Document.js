const mongoose = require('mongoose')
	, Schema = mongoose.Schema

const documentSchema = new Schema({
	writer: { type: String }
})
module.exports = mongoose.model('Document', documentSchema)