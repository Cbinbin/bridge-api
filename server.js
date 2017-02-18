const express = require('express')
	, app = express()

require('./mongodb')
require('dotenv').config()

const port = process.env.PORT
	, routes = require('./routes')
	, admin = require('./routes/adminRoutes')

const cors = require('cors')
	, bodyParser = require('body-parser')

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use('/storage', express.static('storage'))

app.use('/', routes.home)
app.use('/reg', routes.reg)
app.use('/login', routes.login)
app.use('/user', routes.user)
app.use('/developer', routes.developer)
app.use('/session', routes.session)
app.use('/project', routes.project)
app.use('/admin', admin)

app.listen(port, ()=> {
	console.log('Server is ruuning on port: ' + port)
	console.log('Use Ctrl-C to stop')
})