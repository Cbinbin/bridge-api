const router = require('express').Router()
	, mongoose = require('mongoose')
	, Project = require('../models/Project')
	, Schedule = require('../models/Schedule')
	, FrontEnd = require('../models/FrontEnd')
	, Backstage = require('../models/Backstage')
	, BackEnd = require('../models/BackEnd')

router.post('/', (req, res)=> {
	const datenow = new Date()
		, defaultId = new mongoose.Types.ObjectId('000000000000000000000000')
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
	
})

router.post('/schedule/:id/all', (req, res)=> {
	
})

router.get('/', (req, res)=> {
	
})

module.exports = router