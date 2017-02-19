const router = require('express').Router()
	, User = require('../models/User')
	, checkToken = require('../utils/checkToken')

checkToken(router)

router.get('/all', (req, res)=> {
	const openId = req.decoded.openId
	const per = Number(req.query.per) || 10
		, page = Number(req.query.page) || 1
	User.findOne({openid: openId})
	.exec((err, user)=> {
		if(err) return res.send(err)
		if(!user) return res.send(user)
		if(user.mold == 'user') return res.send({warning: 'You do not have permission'})
		User.find({mold: 'developer'}, {wxInfo:1, mold:1, introduction:1, signature:1, position:1, QQ:1, status:1, projectTime:1, totalTime:1, doing:1, participations:1, telephone: 1, createdTime:1, updatedTime:1})
		.sort({createdTime: -1})
		.limit(per)
		.skip((page - 1) * per)
		.exec((err, users)=> {
			if(err) return res.send(err)
			res.send(users)
		})
	})
})

router.patch('/status', (req, res)=> {
	const openId = req.decoded.openId
	User.findOne({openid: openId})
	.exec((err, user)=> {
		if(err) return res.send(err)
		if(!user) return res.send(user)
		if(user.mold == 'developer') {
			if(user.status == 'off') user.status = 'on'
			else if(user.status == 'on') user.status = 'off'
			user.save((err)=> {
				if(err) return res.send(err)
				res.send(user)
			})
		} else res.send('You are not the developer')
	})
})

router.get('/', (req, res)=> {
	const openId = req.decoded.openId
	User.findOne({openid: openId}, {wxInfo:1, mold:1, introduction:1, signature:1, position:1, QQ:1, status:1, projectTime:1, totalTime:1, doing:1, participations:1, telephone: 1, createdTime:1, updatedTime:1})
	.where('mold').equals('developer')
	.exec((err, user)=> {
		if(err) return res.send(err)
		if(!user) return res.send({warning: 'You are not the developer'}) 
		res.send(user)
	})
})

module.exports = router
