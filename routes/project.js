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
	Schedule.findOne({projectId: projectId})
	.exec((err, same)=> {
		if(err) return res.send(err)
		if(!same) {
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
		} else {
			res.send('该项目已添加过进度')
		}
	})
})

function findTaskbarId(part, schedule) {
	if(part == 'frontEnd') {
		return schedule.going.taskbars.frontEnd
	} else if(part == 'backstage') {
		return schedule.going.taskbars.backstage
	} else if(part == 'backEnd') {
		return schedule.going.taskbars.backEnd
	}
}

function scheduleChange(part, projectId, taskbarId) {
	Schedule.findOne({projectId: projectId})
	.exec((err, schedule)=> {
		if(err) return res.send(err)
		var schedule_bar = schedule.going.taskbars
		if(part == 'frontEnd') {
			schedule_bar.frontEnd = taskbarId
		} else if(part == 'backstage') {
			schedule_bar.backstage = taskbarId
		} else if(part == 'backEnd') {
			schedule_bar.backEnd = taskbarId
		}
		schedule.save((err)=> {
			if(err) return console.log(err)
			console.log(schedule)
		})
	})
}

router.post('/:id/schedule/:part', (req, res)=> {
	const projectId = req.params.id
		, part = req.params.part
	Schedule.findOne({projectId: projectId})
	.exec((err, schedule)=> {
		if(err) return res.send(err)
		if(!schedule) return res.send('Not found projectId')
		barId = findTaskbarId(part, schedule)
		Taskbar.findOne({_id: barId})
		.exec((err, same)=> {
			if(err) return res.send(err)
			if(same) return res.send(`${part} taskbar already exists`)
			const taskbar = new Taskbar({
				projectId: projectId,
				part: part,
				column: []
			})
			const task = new Task({
				txt: req.body.txt || '暂无',
				completion: req.body.completion || false
			})
			task.save((err)=> {
				if(err) return res.send(err)
				taskbar.column.push(task._id)
				taskbar.save((err)=> {
					if(err) return res.send(err)
					scheduleChange(part, projectId, taskbar._id)
					res.send(taskbar)
				})
			})
		})
	})
})

router.post('/schedule/:barid/task', (req, res)=> {
	const barId = req.params.barid
	const task = new Task({
		txt: req.body.txt || '暂无',
		completion: req.body.completion || false
	})
	task.save((err)=> {
		if(err) return res.send(err)
		Taskbar.update({_id: barId},
		{$push: {column: task._id}},
		(err, txt)=> {
			if(err) return res.send(err)
			console.log(txt)
			res.send(task)
		})
	})
})

router.get('/:id', (req, res)=> {
	const projectId = req.params.id
	Project.findOne({_id: projectId})
	.populate('schedule')
	.exec((err, project)=> {
		if(err) return res.send(err)
		res.send(project)
	})
})

module.exports = router