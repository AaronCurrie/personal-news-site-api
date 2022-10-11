const express = require('express');

const { getTopics } = require('./controllers/controllers.topics')
const { getArticle, getAllArticles, patchArticle, getArticleComments } = require('./controllers/controllers.articles')
const { getUsers } = require('./controllers/controllers.users')
const { psqlErrors, internalError, javascriptErrors} = require('./controllers/controllers.errors')

const app = express();
app.use(express.json())

//api/topics
app.get('/api/topics', getTopics)

//api/articles
app.get('/api/articles/:article_id', getArticle)
app.get('/api/articles', getAllArticles)
app.patch('/api/articles/:article_id', patchArticle)

app.get('/api/articles/:article_id/comments', getArticleComments)

//api/users
app.get('/api/users', getUsers)



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