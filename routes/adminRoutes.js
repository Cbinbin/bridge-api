const router = require('express').Router()
	, index = require('./admin/admin_a')
	, project = require('./admin/project_a')
	, user = require('./admin/user_a')
	, customer = require('./admin/customer_a')
	, developer = require('./admin/developer_a')
	, checkAdminToken = require('../utils/checkAdminToken')

checkAdminToken(router)

router.use('/', index)
router.use('/project', project)
router.use('/user', user)
router.use('/customer', customer)
router.use('/developer', developer)

module.exports = router