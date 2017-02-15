const router = require('express').Router()
	, moment = require('moment')
	, Project = require('../models/Project')

function dateChange(time) {
	time[0] = moment(time[0]).format('MMM Do')
	time[1] = moment(time[1]).format('MMM Do')
	time = [time[0], time[1]]
	return time
}

//获取项目
router.get('/', (req, res)=> {
	Project.find({ }, {__v: 0, document: 0, designs: 0})
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
		res.send(project)
	})
})

module.exports = router