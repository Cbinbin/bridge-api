const router = require('express').Router()
	, User = require('../../models/User')

//查看用户
router.get('/', (req, res)=> {
	const per = Number(req.query.per) || 10
		, page = Number(req.query.page) || 1
	User.find({}, {wxInfo: 1, mold: 1, createdTime: 1})
	.sort({createdTime: -1})
	.limit(per)
	.skip((page - 1) * per)
	.exec((err, users)=> {
		if(err) return res.send(err)
		res.send(users)
	})
})
//更改用户权限
router.patch('/:id/mold', (req, res)=> {
	const userId = req.params.id
	User.findOne({_id: userId})
	.exec((err, user)=> {
		if(err) return res.send(err)
		if(req.body.mold == 'developer') {
			User.findOneAndUpdate({_id: userId}, 
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
			User.findOneAndUpdate({_id: userId}, 
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
		}
	})
})
//删除用户
router.delete('/:id', (req, res)=> {
	const userId = req.params.id
	User.remove({_id: userId})
	.exec((err)=> {
		if(err) return res.send(err)
		res.send({message: 'user delete success'})
	})
})

module.exports = router