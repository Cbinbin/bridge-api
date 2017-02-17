const router = require('express').Router()
	, User = require('../../models/User')

router.get('/', (req, res)=> {
	const per = Number(req.query.per) || 10
		, page = Number(req.query.page) || 1
	User.find({}, {wxInfo:1, mold:1, telephone: 1, createdTime:1, updatedTime:1, realname:1, company:1, companyLogo:1, companyAddress:1, fax:1, seniority:1, serviceDate:1, remark:1, onGoing:1, finishProjects:1})
	.sort({createdTime: -1})
	.limit(per)
	.skip((page - 1) * per)
	.exec((err, users)=> {
		if(err) return res.send(err)
		res.send(users)
	})
})

router.patch('/:id', (req, res)=> {

})

module.exports = router