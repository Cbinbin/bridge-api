const router = require('express').Router()
	, Admin = require('../models/Admin')

router.post('/', (req, res)=> {
	const newteobridge = req.query.newteo
	if(newteobridge != process.env.NTB) {
		return res.send(`You have't permission`)
	} else {
		const keeper = new Admin({
			admin: req.body.admin,
			password: req.body.password
		})
		keeper.save((err)=> {
			if(err) return res.send(err)
			res.send(keeper)
		})
	}
})

module.exports = router