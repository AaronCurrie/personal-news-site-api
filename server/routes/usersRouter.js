const usersRouter = require('express').Router()

const { getUsers, getUser} = require('../controllers/controllersUsers')

usersRouter
.route('/')
.get(getUsers)

usersRouter
.route('/:username')
.get(getUser)

module.exports = usersRouter