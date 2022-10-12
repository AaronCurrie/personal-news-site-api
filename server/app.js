const express = require('express');

const { getTopics } = require('./controllers/controllersTopics')
const { getArticle, getAllArticles, patchArticle, getArticleComments } = require('./controllers/controllersArticles')
const { getUsers } = require('./controllers/controllersUsers')
const { psqlErrors, internalError, javascriptErrors} = require('./controllers/controllersErrors')
const { postArticleComment, deleteComment } = require('./controllers/controllersComment')
const apiData = require('../endpoints.json')

const app = express();
app.use(express.json())

//api
app.get('/api', (req, res, next) => {
    res.status(200).send({apiData})
})

//api/topics
app.get('/api/topics', getTopics)

//api/articles
app.get('/api/articles/:article_id', getArticle)
app.get('/api/articles', getAllArticles)
app.patch('/api/articles/:article_id', patchArticle)

app.get('/api/articles/:article_id/comments', getArticleComments)
app.post('/api/articles/:article_id/comments', postArticleComment)

//api/users
app.get('/api/users', getUsers)

//api/comments
app.delete('/api/comments/:comment_id', deleteComment)


//catch response for incorrect paths
app.all('/api/*',(req, res, next) => {
    res.status(404).send({ msg: "Path not found" })
})

//js errors 
app.use(javascriptErrors)

//PSQL erros
app.use(psqlErrors)

//500 error
app.use(internalError);

module.exports = app;