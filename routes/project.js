const router = require('express').Router()
	, moment = require('moment')
	, Project = require('../models/Project')
	, Design = require('../models/Design')
	, Document = require('../models/Document')
	, Schedule = require('../models/Schedule')
	, checkToken = require('../utils/checkToken')

function dateChange(time) {
	time[0] = moment(time[0]).format('MMM Do')
	time[1] = moment(time[1]).format('MMM Do')
	time = [time[0], time[1]]
	return time
}

checkToken(router)

//获取项目
router.get('/', (req, res)=> {
	Project.find({ }, {__v: 0, startDate: 0, endDate: 0, schedule: 0, cycle: 0, document: 0, designs: 0})
	.populate('possessor')
	.exec((err, projects)=> {
		if(err) return res.send(err)
		res.send(projects)
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
	Schedule.findOne({projectId: projectId}, {__v:0})
	.exec((err, schedule)=> {
		if(err) return res.send(err)
		if(!schedule) return res.send({error: 'Not found the schedule'})
		res.send(schedule)
	})
})

module.exports = router