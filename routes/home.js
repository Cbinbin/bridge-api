const router = require('express').Router()
	, host = require('../utils/hosturl')

router.get('/', (req, res)=> {
	res.json({
		api: host.bridge,
		project: host.bridge + 'project'
	})
})

module.exports = router
