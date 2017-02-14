const jsSHA = require('jssha')
	, ntb = process.env.NTB

function checkNewTeoAdmin(router) {
	router.use('*', (req, res, next) => {
		var encryptedAdmin = req.query.pass 
			, shaObj = new jsSHA('SHA-1', 'TEXT')
		shaObj.update(ntb)
		if(shaObj.getHash('HEX') === encryptedAdmin) next()
		else res.send({message: `You have't permission`})
	})
}

module.exports = checkNewTeoAdmin