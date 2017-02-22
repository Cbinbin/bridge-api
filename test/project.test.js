const request = require('superagent')
	, chai = require('chai')
	, host = require('../utils/hosturl')
	, expect = chai.expect

describe('admin', function() {
	it('注册', function(done) {
		request
		.post(host.bridge + 'reg?pass=' + process.env.N_HX)
		.send({
			admin: 'newteo',
			password: 'newteonewteo'
		})
		.set('Accept', 'application/json')
		.end(function(err, res) {
			if(err) return console.log(err.message)
			expect(res.body._id).to.be.exist
			rqId = res.body._id
			done()
		})	
	})
	// it('', function(done) {
	// 	request
	// 	.get(host.bridge + '')
	// 	.end(function(err, res) {
	// 		if(err) return console.log(err.message)
	// 		expect(res.body).to.be.an('')
	// 		done()
	// 	})	
	// })
	// it('', function(done) {
	// 	request
	// 	.get(host.bridge + '')
	// 	.end(function(err, res) {
	// 		if(err) return console.log(err.message)
	// 		expect(res.body).to.be.an('object')
	// 		done()
	// 		// console.log(res.body)
	// 	})	
	// })
	// it('', function(done) {
	// 	request
	// 	.delete(host.bridge + '' + '?token=' + token)
	// 	.end(function(err, res) {
	// 		if(err) return console.log(err.message)
	// 		expect(res.text).to.be.equal('')
	// 		done()
	// 	})	
	// })
})