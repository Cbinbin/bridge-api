const router = require('express').Router()
	, User = require('../../models/User')

router.get('/', (req, res)=> {
	const per = Number(req.query.per) || 10
		, page = Number(req.query.page) || 1
	User.find({}, {wxInfo: 1, mold: 1, createdTime: 1})
	.sort({createdTime: -1})
	.limit(per)
	.skip((page - 1) * per)
	.exec((err, users)=> {
		if(err) return res.send(err)
		res.send(users)
	})
})

router.patch('/:id', (req, res)=> {
	const userId = req.params.id

})

router.delete('/:id', (req, res)=> {
	const userId = req.params.id
	User.remove({_id: userId})
	.exec((err)=> {
		if(err) return res.send(err)
		res.send({message: 'user delete success'})
	})
})

module.exports = router