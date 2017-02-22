const router = require('express').Router()
	, host = require('../utils/hosturl')

router.get('/', (req, res)=> {
	res.json({
		api: host.bridge,
		login: host.bridge + 'login',
		admin_user: host.bridge + 'admin/user?token=${token}',
		admin_customer: host.bridge + 'admin/customer?token=${token}',
		admin_developer: host.bridge + 'admin/developer?token=${token}',
		admin_projects: host.bridge + 'admin/project?token=${token}',
		admin_project: host.bridge + 'admin/project/:id?token=${token}',
		session: host.bridge + 'session',
		projects: host.bridge + 'project',
		project: host.bridge + 'project/:id?token=${token}',
		schedule: host.bridge + 'project/:id/schedule?token=${token}',
		design: host.bridge + 'project/:id/design?token=${token}',
		document: host.bridge + 'project/:id/document?token=${token}',
		user: host.bridge + 'user?token=${token}',
	})
})

module.exports = router
