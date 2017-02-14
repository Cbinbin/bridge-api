const router = require('express').Router()
	, moment = require('moment')
	, mongoose = require('mongoose')
	, defaultId = new mongoose.Types.ObjectId('000000000000000000000000')
	, Project = require('../../models/Project')
	, Schedule = require('../../models/Schedule')
	, Taskbar = require('../../models/Taskbar')
	, Task = require('../../models/Task')
	, host = require('../../utils/hosturl')
	, upload = require('../../utils/upload')
	, delFile = require('../../utils/delFile')
	, datenow = new Date()


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
//创建项目
router.post('/', (req, res)=> {
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
//改项目图
router.post('/:id/pic', (req, res)=> {
	const projectId = req.params.id
	const picUpload = upload('pics', 'picture')
	picUpload(req, res, (err)=> {
		if(err) return res.send('something wrong')
		Project.findOne({_id: projectId}) 
		.exec((err, project)=> {
			if(err) return res.send(err)
			delFile(project.picture)
			project.picture = host.bridge + req.file.path
			project.save((err)=> {
				if(err) return res.send(err)
				res.send(project)
			})
		})
	})
})
//更改项目详情
router.patch('/:id/change', (req, res)=> {
	const projectId = req.params.id
	Project.findOne({_id: projectId})
	.exec((err, project)=> {
		if(err) return res.send(err)
		if(!project) return res.send({error: 'Not found the project '})
		if(req.body.title) project.title = req.body.title
		if(req.body.version) project.version = req.body.version
		if(req.body.cycle) project.cycle = req.body.cycle
		if(req.body.startDate) project.startDate = req.body.startDate
		if(req.body.endDate) project.endDate = req.body.endDate
		if(req.body.progression) project.progression = req.body.progression
		project.save((err)=> {
			if(err) return res.send(err)
			res.send(project)
		})
	})
})
//创建进度
router.post('/:id/schedule', (req, res)=> {
	const projectId = req.params.id
	dateFormat = moment(datenow).format('L')
	const schedule = new Schedule({
		projectId: projectId,
		pending: {
			time: [req.body.time1 || dateFormat, ''],
			text: req.body.text1 || '该项目暂未开始，待处理。',
			discussion: req.body.discussion1 || 'undefined'
		},
		start: {
			time: req.body.time2 || [dateFormat, dateFormat],
			text: req.body.text2 || '该项目已经正式启动。',
			discussion: req.body.discussion2 || '该阶段包括以下工作内容：',
			contents: req.body.contents || []
		},
		going: {
			time: req.body.time3 || [dateFormat, dateFormat],
			text: req.body.text3 || '该项目已进入代码开发阶段。',
			taskbars: {
				frontEnd: req.body.frontEnd || defaultId,
				backstage: req.body.backstage || defaultId,
				backEnd: req.body.backEnd || defaultId
			}
		},
		check: {
			time: req.body.time4 || [dateFormat, dateFormat],
			text: req.body.text4 || '该项目已部署上线。',
			discussion: req.body.discussion4 || 'undefined'
		},
		finish: {
			time: [req.body.time5 || dateFormat, ''],
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
//更改进度时间
router.patch('/:id/schedule', (req, res)=> {
	const projectId = req.params.id
	Project.findOne({_id: projectId})
	.exec((err, project)=> {
		if(err) return res.send(err)
		if(!project) return res.send({error: 'Not found the project '})
		Schedule.findOne({_id: project.schedule})
		.exec((err, schedule)=> {
			if(err) return res.send(err)
			if(!schedule) return res.send({error: 'Not found the schedule '})
			if(req.body.t1) schedule.pending.time = [req.body.t1, '']
			if(req.body.t2 || req.body.t3) schedule.start.time = [req.body.t2, req.body.t3]
			if(req.body.t4 || req.body.t5) schedule.going.time = [req.body.t4, req.body.t5]
			if(req.body.t6 || req.body.t7) schedule.check.time = [req.body.t6, req.body.t7]
			if(req.body.t8) schedule.finish.time = [req.body.t8, '']
			schedule.save((err)=> {
				if(err) return res.send(err)
				res.send(schedule)
			})
		})
	})
})
//创建任务栏
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
//添加单个任务
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

module.exports = router