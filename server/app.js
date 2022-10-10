const express = require('express');

//const { getTopics } = require('./controllers/controllers.topics')
const { getArticle } = require('./contollers/controllers.articles')

const app = express();

//api/topics
//app.get('/api/topics', getTopics)

//api/articles
app.get('/api/articles/:article_id', getArticle)


//catch response for incorrect paths
app.use((req, res, next) => {
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

//500 error
app.use((err, req, res, next) => {
    console.log(err);
    res.status(500).send({ msg: "internal server error"});
});

module.exports = app;