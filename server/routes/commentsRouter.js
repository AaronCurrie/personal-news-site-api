const commentsRouter = require('express').Router()

const {  deleteComment } = require('../controllers/controllersComment')

commentsRouter
.route('/:comment_id')
.delete(deleteComment)

module.exports = commentsRouter