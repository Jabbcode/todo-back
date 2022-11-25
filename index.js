const express = require('express')
require('dotenv').config()
const cors = require('cors')
const { dbConnection } = require('./database/config')

dbConnection()

const app = express()

app.use(cors())

app.use(express.json())

app.use('/api/auth', require('./routes/auth'))
app.use('/api/todos', require('./routes/todo'))

app.listen(process.env.PORT, () => {
	console.log(`Server on Port ${process.env.PORT}`)
})
