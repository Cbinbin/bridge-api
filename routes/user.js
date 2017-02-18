const router = require('express').Router()
	, User = require('../models/User')
	, checkToken = require('../utils/checkToken')

checkToken(router)

router.patch('/', (req, res)=> {
	const openId = req.decoded.openId
	User.findOne({openid: openId}, {openid: 0, updatedTime: 0, __v: 0})
	.exec((err, user)=> {
		if(err) return res.send(err)
		if(!user) return res.send({error: 'Not found user'})
		if(!user.signature) user.signature = 'undefinded'
		if(!user.introduction) user.introduction = 'undefinded'
		if(req.body.signature || req.body.introduction) {
			User.findOneAndUpdate({_id: user._id}, 
			{$set: {signature: req.body.signature || user.signature, 
				introduction: req.body.introduction || user.introduction}}, 
			{new: true, upsert: true}, 
			(err, newuser)=> {
				if(err) return res.send(err)
				if(req.body.nickName) newuser.wxInfo.nickName = req.body.nickName
				newuser.save((err)=> {
					if(err) return res.send(err)
					res.send(newuser)
				})
			})
		}
	})
})

router.get('/', (req, res)=> {
	const per = Number(req.query.per) || 10
		, page = Number(req.query.page) || 1
	User.find({mold: 'developer'}, {wxInfo:1, mold:1, introduction:1, signature:1, position:1, QQ:1, status:1, projectTime:1, totalTime:1, doing:1, participations:1, telephone: 1, createdTime:1, updatedTime:1})
	.sort({createdTime: -1})
	.limit(per)
	.skip((page - 1) * per)
	.exec((err, users)=> {
		if(err) return res.send(err)
		res.send(users)
	})
})

module.exports = router