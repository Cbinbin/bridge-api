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
			{$set: {
					wxInfo: {nickName: req.body.nickName || user.wxInfo.nickName,
					openId: user.wxInfo.openId,
					gender: user.wxInfo.gender,
					language: user.wxInfo.language,
					city: user.wxInfo.city,
					province: user.wxInfo.province,
					country: user.wxInfo.country,
					avatarUrl: user.wxInfo.avatarUrl
				},
				signature: req.body.signature || user.signature, 
				introduction: req.body.introduction || user.introduction}}, 
			{new: true, upsert: true}, 
			(err, newuser)=> {
				if(err) return res.send(err)
				res.send(newuser)
			})
		}
	})
})

router.get('/', (req, res)=> {
	const openId = req.decoded.openId
	User.findOne({openid: openId}, {wxInfo:1, mold:1, introduction:1, signature:1, telephone: 1, createdTime:1, updatedTime:1})
	.exec((err, user)=> {
		if(err) return res.send(err)
		if(!user) return res.send(user) 
		res.send(user)
	})
})

module.exports = router