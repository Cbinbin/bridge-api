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

module.exports = router