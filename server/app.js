const express = require('express');

const { getTopics } = require('./controllers/controllers.topics')

const { getArticle, getAllArticles, patchArticle } = require('./controllers/controllers.articles')

const { getUsers } = require('./controllers/controllers.users')

const app = express();
app.use(express.json())

//api/topics
app.get('/api/topics', getTopics)

//api/articles
app.get('/api/articles/:article_id', getArticle)
app.get('/api/articles', getAllArticles)
app.patch('/api/articles/:article_id', patchArticle)


//api/users
app.get('/api/users', getUsers)



//catch response for incorrect paths
app.all('/api/*',(req, res, next) => {
    res.status(404).send({ msg: "Path not found" })
})

//js errors 
app.use((err, req, res, next) => {
    if(err.status) {
        res.status(err.status).send({ msg: err.msg })
    } else {
        next(err)
    }
})

//PSQL erros
app.use((err, req, res, next) => {
    if(err.code === '22P02') {
        res.status(400).send({msg: 'incorrect data type inputted'})
    } else if(err.code === '23502') {
        res.status(400).send({msg: 'incorrect data format'})
    } else {
        next(err)
    }
})

//500 error
app.use((err, req, res, next) => {
    console.log(err);
    res.status(500).send({ msg: "internal server error"});
});

module.exports = app;