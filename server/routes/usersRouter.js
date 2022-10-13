const usersRouter = require('express').Router()

const { getUsers} = require('../controllers/controllersUsers')

usersRouter
.route('/')
.get(getUsers)

module.exports = usersRouter