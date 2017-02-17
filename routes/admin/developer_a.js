const router = require('express').Router()
	, User = require('../../models/User')

router.get('/', (req, res)=> {
	const per = Number(req.query.per) || 10
		, page = Number(req.query.page) || 1
	User.find({}, {wxInfo:1, mold:1, introduction:1, signature:1, position:1, QQ:1, status:1, projectTime:1, totalTime:1, doing:1, participations:1, telephone: 1, createdTime:1, updatedTime:1})
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