const apiRouter = require('express').Router()
const topicsRouter = require('./topicsRouter')
const articlesRouter = require('./articlesRouter')
const usersRouter = require('./usersRouter')
const commentsRouter = require('./commentsRouter')

const apiData = require('../../endpoints.json')




apiRouter.get('/', (req, res, next) => {
    res.status(200).send({apiData})
})

//topics router
apiRouter.use('/topics', topicsRouter)

//articles router
apiRouter.use('/articles', articlesRouter)

//users router
apiRouter.use('/users', usersRouter)

//comments router
apiRouter.use('/comments', commentsRouter)

module.exports = apiRouter