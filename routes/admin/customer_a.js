const router = require('express').Router()
	, User = require('../../models/User')
	, upload = require('../../utils/upload')
	, host = require('../../utils/hosturl')

router.get('/', (req, res)=> {
	const per = Number(req.query.per) || 10
		, page = Number(req.query.page) || 1
	User.find({mold: 'customer'}, {wxInfo:1, mold:1, telephone: 1, createdTime:1, updatedTime:1, realname:1, company:1, companyLogo:1, companyAddress:1, fax:1, seniority:1, serviceDate:1, remark:1, onGoing:1, finishProjects:1})
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
		, onpushId = req.query.onpush
		, onpullId = req.query.onpull
		, finishpushId = req.query.fpush
		, finishpullId = req.query.fpull
	User.findOne({_id: userId})
	.exec((err, user)=> {
		if(err) return res.send(err)
		if(!user) return res.send({error: 'Not found user'})
		if((onpushId && onpullId) || (onpushId && finishpullId) || (finishpullId && finishpushId) || (onpullId && finishpushId)) {
			return res.send({error: 'push and pull can not exist at the same time'})
		} else if((onpushId && !onpullId) || (finishpushId && !finishpullId)) {
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
					realname: req.body.realname || user.realname,
					company: req.body.company || user.company,
					companyAddress: req.body.companyAddress || user.companyAddress,
					fax: req.body.fax || user.fax,
					seniority: req.body.seniority || user.seniority,
					serviceDate: req.body.serviceDate || user.serviceDate,
					remark: req.body.remark || user.remark,
					telephone: req.body.telephone || user.telephone
				}, 
				$push: {onGoing: onpushId, finishProjects: finishpushId}
			}, 
			{new: true}, 
			(err, newuser)=> {
				if(err) return res.send(err)
				res.send(newuser)
			})
		} else {
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
					realname: req.body.realname || user.realname,
					company: req.body.company || user.company,
					companyAddress: req.body.companyAddress || user.companyAddress,
					fax: req.body.fax || user.fax,
					seniority: req.body.seniority || user.seniority,
					serviceDate: req.body.serviceDate || user.serviceDate,
					remark: req.body.remark || user.remark,
					telephone: req.body.telephone || user.telephone
				}, 
				$pull: {onGoing: onpullId, finishProjects: finishpullId}
			}, 
			{new: true}, 
			(err, newuser)=> {
				if(err) return res.send(err)
				res.send(newuser)
			})
		}
	})
})
//头像
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