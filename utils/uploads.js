const multer = require('multer')

function uploads(pubilc, single) {
	const storage = multer.diskStorage({
		destination: (req, file, cb) => {
			cb(null, `storage/${pubilc}`)
		},
		filename: (req, file, cb)=> {
			cb(null, Date.now() + file.originalname )
		}
	})
	const uploads = multer({storage: storage}).array(`${single}`, 10)
	return uploads
}

module.exports = uploads