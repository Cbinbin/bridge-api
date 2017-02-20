const router = require('express').Router()
	, moment = require('moment')
	, mongoose = require('mongoose')
	, defaultId = new mongoose.Types.ObjectId('000000000000000000000000')
	, Project = require('../../models/Project')
	, Design = require('../../models/Design')
	, Document = require('../../models/Document')
	, Schedule = require('../../models/Schedule')
	, Taskbar = require('../../models/Taskbar')
	, Task = require('../../models/Task')
	, Content = require('../../models/Content')
	, host = require('../../utils/hosturl')
	, upload = require('../../utils/upload')
	, uploads = require('../../utils/uploads')
	, delFile = require('../../utils/delFile')
	, datenow = new Date()

function removeId(Model, id) {
	Model.remove({projectId: id})
	.exec((err)=> {
		if(err) return console.log(err)
	})
}

function dateChange(time) {
	time[0] = moment(time[0]).format('MMM Do')
	time[1] = moment(time[1]).format('MMM Do')
	time = [time[0], time[1]]
	return time
}

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
		})
	})
}

function removeDesign(id) {
	Design.findOne({_id: id})
	.exec((err, design)=> {
		if(err) return console.log(err)
		if(!design) return console.log(err)
		delFile(design.designUrl)
		Design.remove({_id: design._id})
		.exec((err)=> {
			if(err) return console.log(err)

		})
	})
}

//----------------------------------------------------------------------------------------------------------

//创建项目
router.post('/', (req, res)=> {
	const project = new Project({
		title: req.body.title || '0元设计官网',
		version: req.body.version || '0.1.0',
		picture: req.body.picture || 'nothing',
		cycle: req.body.cycle,
		startDate: req.body.startDate || datenow,
		endDate: req.body.endDate || datenow,
		progression: req.body.progression || 'pending',
		participants: 0,
		designs: req.body.designs || [],
		document: req.body.document || defaultId,
		possessor: req.body.possessor || defaultId,
		schedule: req.body.schedule || defaultId,
		developers: req.body.developers || []
	})
	project.save((err)=> {
		if(err) return res.send(err)
		var timeLength = project.endDate - project.startDate
			, cycleDay = timeLength/(1000*60*60*24)
		Project.findOneAndUpdate({_id: project._id}, 
		{$set: {cycle: cycleDay}}, 
		{new: true},
		(err, newproject)=> {
			if(err) return res.send(newproject)
			res.send(newproject)
		})
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
		// if(req.body.cycle) project.cycle = req.body.cycle
		if(req.body.startDate) project.startDate = req.body.startDate
		if(req.body.endDate) project.endDate = req.body.endDate
		if(req.body.progression) project.progression = req.body.progression
		project.save((err)=> {
			if(err) return res.send(err)
			var timeLength = project.endDate - project.startDate
				, cycleDay = timeLength/(1000*60*60*24)
			Project.findOneAndUpdate({_id: project._id}, 
			{$set: {cycle: cycleDay}}, 
			{new: true},
			(err, newproject)=> {
				if(err) return res.send(newproject)
				res.send(newproject)
			})
		})
	})
})
//删除项目
router.delete('/:id', (req, res)=> {
	const projectId = req.params.id
	removeId(Task, projectId)
	removeId(Taskbar, projectId)
	removeId(Content, projectId)
	removeId(Schedule, projectId)
	Project.findOne({_id: projectId})
	.exec((err, project)=> {
		if(err) return res.send(err)
		if(!project) return res.send({error: 'Not found the project'})
		delFile(project.picture)
		if(project.designs) {
			project.designs.map((item)=> {
				removeDesign(item)
			})
		}
		Document.remove({_id: project.document}, (err)=> {
			if(err) return console.log(err)
			Project.remove({_id: project._id}, (err)=> {
				if(err) return res.send(err)
				res.json({message: 'the project delete success'})
			})
		})
	})
})
//------------------------------------------------------------------------------------------------------------------

//添加设计图
router.post('/:id/design', (req, res, next)=> {
	const projectId = req.params.id
		// , designArray = []
	const designUpload = upload('designs', 'design')
	designUpload(req, res, (err)=> {
		if(err) return res.send('something wrong')
		const design = new Design({
			projectId: projectId,
			filename: req.file.originalname,
			designUrl: host.bridge + req.file.path
		})
		design.save((err)=> {
			if(err) return res.send(err)
			Project.update({_id: projectId}, 
			{$push: {designs: design._id}}, 
			(err, result)=> {
				if(err) return console.log(err)
				res.send(design)
			})
		})
	})
})
//删除设计图
router.delete('/:id/design/:designId', (req, res)=> {
	const projectId = req.params.id
		, designId = req.params.designId
	Project.update({_id: projectId}, 
	{$pull: {designs: designId}},
	(err, result)=> {
		if(err) return console.log(err)
	})
	Design.findOne({_id: designId})
	.exec((err, design)=> {
		if(err) return res.send(err)
		if(!design) return res.send({error: 'Not found the design'})
		delFile(design.designUrl)
		Design.remove({_id: designId})
		.exec((err)=> {
			if(err) return res.send(err)
			res.json({message: 'the design delete success'})
		})
	})
})
//添加开发文档
router.post('/:id/doc', (req, res)=> {
	const projectId = req.params.id
	const doc = new Document({
		writer: req.body.writer
	})
	doc.save((err)=> {
		if(err) return res.send(err)
		Project.update({_id: projectId}, 
		{$set: {document: doc._id}}, 
		(err, result)=> {
			if(err) return console.log(err)
		})
		res.send(doc)
	})
})
//更改开发文档
router.patch('/:id/doc/:docId', (req, res)=> {
	const projectId = req.params.id
		, docId = req.params.docId
	Document.remove({_id: docId})
	.exec((err)=> {
		if(err) return res.send(err)
		Project.update({_id: projectId}, 
		{$set: {document: defaultId}},
		(err, result)=> {
			if(err) return console.log(err)
		})
		res.json({message: 'the doc delete success'})
	})
})
//删除开发文档
router.delete('/:id/doc/:docId', (req, res)=> {
	const projectId = req.params.id
		, docId = req.params.docId
	Document.remove({_id: docId})
	.exec((err)=> {
		if(err) return res.send(err)
		Project.update({_id: projectId}, 
		{$set: {document: defaultId}},
		(err, result)=> {
			if(err) return console.log(err)
		})
		res.json({message: 'the doc delete success'})
	})
})
//------------------------------------------------------------------------------------------------------------------

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
					// console.log(result)
				})
				res.send(schedule)
			})
		} else {
			res.send({message: '该项目已添加过进度'})
		}
	})
})
//更改进度时间
router.patch('/:id/schedule', (req, res)=> {
	const projectId = req.params.id
	Schedule.findOne({projectId: projectId})
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
//创建任务栏
router.post('/:id/schedule/:part', (req, res)=> {
	const projectId = req.params.id
		, part = req.params.part
	Schedule.findOne({projectId: projectId})
	.exec((err, schedule)=> {
		if(err) return res.send(err)
		if(!schedule) return res.send({error: 'Not found the schedule'})
		barId = findTaskbarId(part, schedule)
		Taskbar.findOne({_id: barId})
		.exec((err, same)=> {
			if(err) return res.send(err)
			if(same) return res.send({message: `${part} taskbar already exists`})
			const taskbar = new Taskbar({
				projectId: projectId,
				part: part,
				column: []
			})
			// const task = new Task({
			// 	projectId: projectId,
			// 	txt: req.body.txt || '项目构架搭建',
			// 	completion: req.body.completion || false
			// })
			// task.save((err)=> {
			// 	if(err) return res.send(err)
			// taskbar.column.push(task._id)
			taskbar.save((err)=> {
				if(err) return res.send(err)
				scheduleChange(part, projectId, taskbar._id)
				res.send(taskbar)
			})
			// })
		})
	})
})
//添加单个任务
router.post('/schedule/:barid/task', (req, res)=> {
	const barId = req.params.barid
	Taskbar.findOne({_id: barId})
	.exec((err, taskbar)=> {
		if(err) return res.send(err)
		if(!taskbar) return res.send({error: 'Not found taskbar'})
		const task = new Task({
			projectId: taskbar.projectId,
			txt: req.body.txt || '项目构架搭建',
			completion: req.body.completion || false
		})
		task.save((err)=> {
			if(err) return res.send(err)
			Taskbar.update({_id: barId},
			{$push: {column: task._id}},
			(err, txt)=> {
				if(err) return res.send(err)
				// console.log(txt)
				res.send(task)
			})
		})
	})
})
//更改任务
router.patch('/schedule/task/:taskId', (req, res)=> {
	const taskId = req.params.taskId
	Task.findOne({_id: taskId})
	.exec((err, task)=> {
		if(err) return res.send(err)
		if(!task) return res.send({error: 'Not found task'})
		Task.findOneAndUpdate({_id: taskId}, 
		{$set: {txt: req.body.txt || task.txt, completion: req.body.completion || task.completion}}, 
		{new: true}, 
		(err, newtask)=> {
			if(err) return res.send(err)
			res.send(newtask)
		})
	})
})
//删除任务
router.delete('/schedule/task/:taskId', (req, res)=> {
	const taskId = req.params.taskId
	Taskbar.findOne()
	.where('column').in([taskId])
	.exec((err, taskbar)=> {
		if(err) return res.send(err)
		if(!taskbar) return res.send({error: 'Not found taskbar'})
		Taskbar.findOneAndUpdate({_id: taskbar._id}, 
		{$pull: {column: taskId}}, 
		{new: true}, 
		(err, newbar)=> {
			if(err) return res.send(err)
			Task.remove({_id: taskId})
			.exec((err)=> {
				if(err) return res.send(err)
				res.json({message: 'the task delete success'})
			})
		})
	})
})
//--------------------------------------------------------------------------------------------------------------------------

//添加需求内容
router.post('/:id/start', (req, res)=> {
	const projectId = req.params.id
	Schedule.findOne({projectId: projectId})
	.exec((err, schedule)=> {
		if(err) return res.send(err)
		if(!schedule) return res.send({error: 'Not found the schedule '})
		const content = new Content({
			projectId: projectId,
			content: req.body.content || '项目负责任将与您探讨项目事项。'
		})
		content.save((err)=> {
			if(err) return res.send(err)
			schedule.start.contents.push(content._id)
			schedule.save((err)=> {
				if(err) return res.send(err)
				res.send(schedule)
			})
		})
	})
})
//删除需求内容
router.delete('/schedule/content/:contentId', (req, res)=> {
	const contentId = req.params.contentId
	Schedule.findOne()
	.where('start.contents').in([contentId])
	.exec((err, schedule)=> {
		if(err) return res.send(err)
		if(!schedule) return res.send({error: 'Not found the schedule '})
		schedule.start.contents.pull(contentId)
		schedule.save((err)=> {
			if(err) return res.send(err)
			Content.remove({_id: contentId})
			.exec((err)=> {
				if(err) return res.send(err)
				res.json({message: 'the content delete success'})
			})
		})
	})
})
//-------------------------------------------------------------------------------------------------------

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
	.populate('designs', 'filename designUrl')
	.populate('document', 'writer')
	.populate('possessor', 'company wxInfo')
	.populate('developers.backEnd', 'wxInfo mold position QQ telephone signature introduction status projectTime totalTime doing participations')
	.populate('developers.backstage', 'wxInfo mold position QQ telephone signature introduction status projectTime totalTime doing participations')
	.populate('developers.frontEnd', 'wxInfo mold position QQ telephone signature introduction status projectTime totalTime doing participations')
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
//----------------------------------------------------------------------------------------------------------------------------------

//添加客户进项目
router.patch('/:id/possessor', (req, res)=> {
	const projectId = req.params.id
		, possessorId = req.query.customer
	Project.findOneAndUpdate({_id: projectId}, 
	{$set: {possessor: possessorId}}, 
	{new: true}, 
	(err, project)=> {
		if(err) return res.send(err)
		res.send(project)
	})
})
//添加开发者进项目
router.patch('/:id/:part', (req, res)=> {
	const projectId = req.params.id
		, part = req.params.part
		, developerId = req.query.developer
	Project.findOne({_id: projectId})
	.where(`developers.${part}`).in([developerId])
	.exec((err, same)=> {
		if(err) return res.send(err)
		var backEndId = null
			, backstageId = null
			, frontEndId = null
		if(part == 'backEnd') backEndId = developerId
		else if(part == 'backstage') backstageId = developerId
		else if(part == 'frontEnd') frontEndId = developerId
		else return res.send({error: 'Not found the part'})
		if(same) {
			Project.findOne({_id: projectId})
			.exec((err, project)=> {
				if(err) return res.send(err)
				if(backEndId) project.developers.backEnd.pull(backEndId)
				if(backstageId) project.developers.backstage.pull(backstageId)
				if(frontEndId) project.developers.frontEnd.pull(frontEndId)
				if(project.participants >= 0) project.participants = project.participants - 1
				project.save((err)=> {
					if(err) return res.send(err)
					res.send(project)
				})
			})
		} else {
			Project.findOne({_id: projectId})
			.exec((err, project)=> {
				if(err) return res.send(err)
				if(backEndId) project.developers.backEnd.push(backEndId)
				if(backstageId) project.developers.backstage.push(backstageId)
				if(frontEndId) project.developers.frontEnd.push(frontEndId)
				if(project.participants >= 0) project.participants = project.participants + 1
				project.save((err)=> {
					if(err) return res.send(err)
					res.send(project)
				})
			})
		}
	})
})

module.exports = router