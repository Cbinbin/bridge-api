const router = require('express').Router()
	, mongoose = require('mongoose')
	, defaultId = new mongoose.Types.ObjectId('000000000000000000000000')
	, Project = require('../models/Project')
	, Schedule = require('../models/Schedule')
	, Taskbar = require('../models/Taskbar')
	, Task = require('../models/Task')

router.post('/', (req, res)=> {
	const datenow = new Date()
	const project = new Project({
		title: req.body.title || '空',
		version: req.body.version || '空',
		picture: req.body.picture || 'nothing',
		cycle: req.body.cycle || 0,
		startDate: req.body.startDate || datenow,
		endDate: req.body.endDate || datenow,
		progression: req.body.progression || 'pending',
		designs: req.body.designs || [],
		document: req.body.document || defaultId,
		possessor: req.body.possessor || defaultId,
		schedule: req.body.schedule || defaultId,
		developers: req.body.developers || []
	})
	project.save((err)=> {
		if(err) return res.send(err)
		res.send(project)
	})
})

router.post('/:id/schedule', (req, res)=> {
	const projectId = req.params.id
	const schedule = new Schedule({
		projectId: projectId,
		pending: {
			time: req.body.time1 || '？月？日',
			text: req.body.text1 || '该项目暂未开始，待处理。',
			discussion: req.body.discussion1 || 'undefined'
		},
		start: {
			time: req.body.time2 || '？月？日 ~ ？月？日',
			text: req.body.text2 || '该项目已经正式启动。',
			discussion: req.body.discussion2 || '该阶段包括以下工作内容：',
			tasks: {
				txt1: req.body.txt1 || 'undefined',
				txt2: req.body.txt2 || 'undefined',
				txt3: req.body.txt3 || 'undefined',
				txt4: req.body.txt4 || 'undefined',
				txt5: req.body.txt5 || 'undefined',
				txt6: req.body.txt6 || 'undefined',
			}
		},
		going: {
			time: req.body.time3 || '？月？日 ~ ？月？日',
			text: req.body.text3 || '该项目已进入代码开发阶段。',
			taskbars: {
				frontEnd: req.body.frontEnd || defaultId,
				backstage: req.body.backstage || defaultId,
				backEnd: req.body.backEnd || defaultId
			}
		},
		check: {
			time: req.body.time4 || '？月？日 ~ ？月？日',
			text: req.body.text4 || '该项目已部署上线。',
			discussion: req.body.discussion4 || 'undefined'
		},
		finish: {
			time: req.body.time5 || '？月？日',
			text: req.body.text5 || '该项目已完结。',
			discussion: req.body.discussion5 || '如需修改或添加功能，将在下一版本中更新。'
		}
	})
	schedule.save((err)=> {
		if(err) return res.send(err)
		Project.update({_id: projectId},
		{$set: {schedule: schedule._id}},
		(err, result)=> {
			if(err) return res.send(err)
			console.log(result)
		})
		res.send(schedule)
	})
})

router.post('/schedule/:id/all', (req, res)=> {
	
})

router.get('/', (req, res)=> {
	project.find('/', (err, projects)=> {
		if(err) return res.send(err)
		res.send(projects)
	})
})

module.exports = router