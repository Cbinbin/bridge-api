const router = require('express').Router()
	, Admin = require('../../models/Admin')

router.get('/', (req, res)=> {
	Admin.find({}, {__v:0, password:0})
	.exec((err, admins)=> {
		if(err) return res.send(err)
		res.send(admins)
	})
})

router.delete('/:id', (req, res)=> {
	const adminId = req.params.id
	Admin.remove({_id: adminId})
	.exec((err)=> {
		if(err) return res.send(err)
		res.json({message: 'the admin delete success'})
	})
})

module.exports = router