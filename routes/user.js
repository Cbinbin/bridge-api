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

router.patch('/mold', (req, res)=> {
	const openId = req.decoded.openId
	User.findOne({openid: openId})
	.exec((err, user)=> {
		if(err) return res.send(err)
		if(req.body.mold == 'developer') {
			User.findOneAndUpdate({_id: user._id}, 
			{$set: {
				mold: req.body.mold,
				position: user.position || '',
				QQ: user.QQ || 0,
				telephone: user.telephone || 0,
				signature: user.signature || '',
				introduction: user.introduction || '',
				status: user.status || 'off',
				projectTime: user.projectTime || 0,
				totalTime: user.totalTime || 0,
				doing: user.doing || null,
				participations: user.participations || [ ]
			}}, 
			{new: true, upsert: true}, 
			(err, newuser)=> {
				if(err) return res.send(err)
				res.send(newuser)
			})
		} else if(req.body.mold == 'customer') {
			User.findOneAndUpdate({_id: user._id}, 
			{$set: {
				mold: req.body.mold,
				realname: user.realname || '',
				telephone: user.telephone || 0,
				company: user.company || '',
				companyLogo: user.companyLogo || '',
				companyAddress: user.companyAddress || '',
				fax: user.fax || '',
				seniority: user.seniority || 0,
				serviceDate: user.serviceDate || '',
				onGoing: user.onGoing || [ ],
				finishProjects: user.finishProjects || [ ],
				remark: user.remark || ''
			}}, 
			{new: true, upsert: true}, 
			(err, newuser)=> {
				if(err) return res.send(err)
				res.send(newuser)
			})
		} else {
			User.findOneAndUpdate({_id: user._id}, 
			{$set: {mold: 'user'}}, 
			{new: true, upsert: true}, 
			(err, newuser)=> {
				if(err) return res.send(err)
				res.send(newuser)
			})
		}
	})
})

module.exports = router