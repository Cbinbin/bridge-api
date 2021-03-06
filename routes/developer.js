const router = require('express').Router()
	, User = require('../models/User')
	, Project = require('../models/Project')
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

router.post('/status', (req, res)=> {
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
//
router.get('/:id', (req, res)=> {
	const developerId = req.params.id
	User.findOne({_id: developerId}, {wxInfo:1, mold:1, introduction:1, signature:1, position:1, QQ:1, status:1, projectTime:1, totalTime:1, doing:1, participations:1, telephone: 1, createdTime:1, updatedTime:1})
	.where('mold').equals('developer')
	.exec((err, user)=> {
		if(err) return res.send(err)
		if(!user) return res.send({warning: 'Not the developer'}) 
		res.send(user)
	})
})

// function worked(pId, parts, uId) {
// 	Project.findOne({_id: pId})
// 	.where(`developers.${parts}`).in([uId])
// 	.exec((err, project)=>{
// 		if(err) return console.log(err)
// 		if(!project) return tf = false
// 		return tf = true
// 	})
// }
//
router.get('/project/all', (req, res)=> {
	const openId = req.decoded.openId
		// , parts = ['frontEnd', 'backstage', 'backEnd']
		, projects = []
		, work = ''
	User.findOne({openid: openId})
	.populate('participations')
	.exec((err, user)=> {
		if(err) return res.send(err)
		if(user.mold != 'developer') return res.send({warning: 'Not the developer'})
		user.participations.map((projectItem)=> {
			projects.push(projectItem)
		})
		// projects.map((item)=> {
		// 	item.developers.frontEnd.map((userItem)=> {
		// 		if(user._id == userItem) {
		// 			work = '前端界面'
		// 		}
		// 		return work
		// 	})
		// 	item.developers.backstage.map((userItem)=> {
		// 		if(user._id == userItem) {
		// 			work = '后台管理界面'
		// 		}
		// 		return work
		// 	})
		// 	item.developers.backEnd.map((userItem)=> {
		// 		if(user._id == userItem) {
		// 			work = '后端api'
		// 			console.log('work')
		// 		}
		// 		console.log(work)
		// 		return work
		// 	})
		// 	item.push({work: work})
		// 	return projects
		// })
		res.send(projects)
	})
})

module.exports = router
