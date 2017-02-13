const router = require('express').Router()
	, host = require('../utils/hosturl')

router.get('/', (req, res)=> {
	res.json({
		api: host.bridge,
		admin: host.bridge + 'admin',
		user: host.bridge + 'user',
		session: host.bridge + 'session',
		project: host.bridge + 'project'
	})
})

module.exports = router
