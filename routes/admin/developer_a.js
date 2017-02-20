const router = require('express').Router()
	, User = require('../../models/User')

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

router.patch('/:id', (req, res)=> {
	const userId = req.params.id
		, doId = req.query.doing
		, pushId = req.query.push
		, pullId = req.query.pull
	if(pushId) {
		User.findOne({_id: userId})
		.exec((err, user)=> {
			if(err) return res.send(err)
			if(!user) return res.send({error: 'Not found user'})
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
					status: req.body.status || user.status,
					position: req.body.position || user.position,
					signature: req.body.signature || user.signature,
					introduction: req.body.introduction || user.introduction,
					QQ: req.body.QQ || user.QQ,
					telephone: req.body.telephone || user.telephone,
					doing: doId || user.doing
				}, 
				$push: {participations: pushId}
			}, 
			{new: true}, 
			(err, newuser)=> {
				if(err) return res.send(err)
				res.send(newuser)
			})
		})
	} else if(pullId) {
		User.findOne({_id: userId})
		.exec((err, user)=> {
			if(err) return res.send(err)
			if(!user) return res.send({error: 'Not found user'})
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
					status: req.body.status || user.status,
					position: req.body.position || user.position,
					signature: req.body.signature || user.signature,
					introduction: req.body.introduction || user.introduction,
					QQ: req.body.QQ || user.QQ,
					telephone: req.body.telephone || user.telephone,
					doing: doId || user.doing
				}, 
				$pull: {participations: pullId}
			}, 
			{new: true}, 
			(err, newuser)=> {
				if(err) return res.send(err)
				res.send(newuser)
			})
		})
	} else {
		User.findOne({_id: userId})
		.exec((err, user)=> {
			if(err) return res.send(err)
			if(!user) return res.send({error: 'Not found user'})
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
					status: req.body.status || user.status,
					position: req.body.position || user.position,
					signature: req.body.signature || user.signature,
					introduction: req.body.introduction || user.introduction,
					QQ: req.body.QQ || user.QQ,
					telephone: req.body.telephone || user.telephone,
					doing: doId || user.doing
				}
			}, 
			{new: true}, 
			(err, newuser)=> {
				if(err) return res.send(err)
				res.send(newuser)
			})
		})
	}
})
//
router.post('/:id/headimg', (req, res)=> {
	const userId = req.params.id
	const headimgUpload = upload('imgs', 'img')
	headimgUpload(req, res, (err)=> {
		if(err) return res.send('something wrong')
		User.findOne({_id: userId})
		.exec((err, user)=> {
			if(err) return res.send(err)
			if(!user) return res.send({error: 'Not found user'})
			User.findOneAndUpdate({_id: userId}, 
			{$set: {
				wxInfo: {nickName: user.wxInfo.nickName,
					openId: user.wxInfo.openId,
					gender: user.wxInfo.gender,
					language: user.wxInfo.language,
					city: user.wxInfo.city,
					province: user.wxInfo.province,
					country: user.wxInfo.country,
					avatarUrl: host.bridge + req.file.path
				}
			}}, 
			{new: true}, 
			(err, newuser)=> {
				if(err) return res.send(err)
				res.send(newuser)
			})
		})
	})
})

module.exports = router