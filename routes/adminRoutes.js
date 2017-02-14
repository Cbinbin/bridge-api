const router = require('express').Router()
	, project = require('./admin/project_a')
	, checkAdminToken = require('../utils/checkAdminToken')

checkAdminToken(router)

router.use('/project', project)

module.exports = router