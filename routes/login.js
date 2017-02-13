const router = require('express').Router()
	, Admin = require('../models/Admin')
	, jwt = require('jsonwebtoken')

router.post('/', (req, res)=> {
	Admin.findOne({admin: req.body.admin})
	.exec((err, keeper)=> {
		if(err) return res.send(err)
		if(!keeper) return res.send({error: 'Not found the admin'})
		if(keeper.password == req.body.password) {
			jwt.sign(
				{},
				'newteo',
				{expiresIn: '8h'}, 
				(err, token) => {
					if(err) return res.send(err)
					res.send({token: token})
				}
			)
		} else res.send({error: 'Password error'})
	})
})

module.exports = router