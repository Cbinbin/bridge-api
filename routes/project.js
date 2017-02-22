const router = require('express').Router()
	, moment = require('moment')
	, User = require('../models/User')
	, Project = require('../models/Project')
	, Design = require('../models/Design')
	, Document = require('../models/Document')
	, Schedule = require('../models/Schedule')
	, checkToken = require('../utils/checkToken')

function dateChange(time) {
	time[0] = moment(time[0]).format('MM月DD日')
	time[1] = moment(time[1]).format('MM月DD日')
	time = [time[0], time[1]]
	return time
}

checkToken(router)

//获取项目
router.get('/', (req, res)=> {
	const openId = req.decoded.openId
	User.findOne({openid: openId})
	.exec((err, user)=> {
		if(err) return res.send(err)
		Project.find({possessor: user._id}, {__v: 0, startDate: 0, endDate: 0, schedule: 0, cycle: 0, document: 0, designs: 0})
		.exec((err, projects)=> {
			if(err) return res.send(err)
			res.send(projects)
		})
	})
})
//获取单个项目
router.get('/:id', (req, res)=> {
	const projectId = req.params.id
	Project.findOne({_id: projectId}, {__v: 0})
	.populate({path: 'schedule',
		select: 'finish check going start pending',
		populate: {
			path: 'going.taskbars.frontEnd going.taskbars.backstage going.taskbars.backEnd start.contents',
			select: 'part column content',
			populate: {
				path: 'column',
				select: 'txt completion'
			}
		}
	})
	.populate('designs', 'filename designUrl')
	.populate('document', 'writer')
	.populate('possessor', 'company wxInfo')
	.populate('developers.backEnd', 'wxInfo mold position status')
	.populate('developers.backstage', 'wxInfo mold position status')
	.populate('developers.frontEnd', 'wxInfo mold position status')
	.exec((err, project)=> {
		if(err) return res.send(err)
		if(!project) return res.json({error: 'Not found the project'})
		if(project.schedule) {
			project.schedule.pending.time = dateChange(project.schedule.pending.time)
			project.schedule.start.time = dateChange(project.schedule.start.time)
			project.schedule.going.time = dateChange(project.schedule.going.time)
			project.schedule.check.time = dateChange(project.schedule.check.time)
			project.schedule.finish.time = dateChange(project.schedule.finish.time)
		}
		var startdate = moment(project.startDate).format('YYYY年MM月DD日')
			, enddate = moment(project.endDate).format('YYYY年MM月DD日')
			, period = `${startdate} ~ ${enddate}`
		res.send({project, period: period})
	})
})
//
router.get('/:id/design', (req, res)=> {
	const projectId = req.params.id
	Design.find({projectId: projectId}, {projectId:0, __v:0})
	.exec((err, designs)=> {
		if(err) return res.send(err)
		res.send(designs)
	})
})
//
router.get('/:id/document', (req, res)=> {
	const projectId = req.params.id
	Project.findOne({_id: projectId})
	.exec((err, project)=> {
		if(err) return res.send(err)
		if(!project) return res.send({error: 'Not found the project'})
		Document.findOne({_id: project.document})
		.exec((err, doc)=> {
			if(err) return res.send(err)
			if(!doc) return res.send({error: 'Not found the document'})
			res.send(doc)
		})
	})
})
//
router.get('/:id/schedule', (req, res)=> {
	const projectId = req.params.id
	Project.findOne({_id: projectId})
	.exec((err, project)=> {
		if(err) return res.send(err)
		if(!project) return res.json({error: 'Not found the project'})
		Schedule.findOne({projectId: projectId}, {__v:0})
		.populate({path: 'going.taskbars.frontEnd going.taskbars.backstage going.taskbars.backEnd start.contents', 
			select: 'part column content',
			populate: {
				path: 'column',
				select: 'txt completion'
			}
		})
		.exec((err, schedule)=> {
			if(err) return res.send(err)
			if(!schedule) return res.send({error: 'Not found the schedule'})
			var nowdate = new Date()
				, remain = parseInt((schedule.going.time[1] - nowdate)/(1000*60*60*24))
				, stage
			if(remain < 0) remain = 0
			schedule.pending.time = dateChange(schedule.pending.time)
			schedule.start.time = dateChange(schedule.start.time)
			schedule.going.time = dateChange(schedule.going.time)
			schedule.check.time = dateChange(schedule.check.time)
			schedule.finish.time = dateChange(schedule.finish.time)
			if(project.progression == 'pending')  stage = schedule.pending
			if(project.progression == 'start')  stage = schedule.start
			if(project.progression == 'going')  stage = schedule.going
			if(project.progression == 'check')  stage = schedule.check
			if(project.progression == 'finish')  stage = schedule.finish
			res.send({stage: stage, remainTime: remain})
		})
	})
})

module.exports = router