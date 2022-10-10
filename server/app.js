const express = require('express');

const { getTopics } = require('./controllers/controllers.topics')

const app = express();

app.get('/api/topics', getTopics)


//catch response for incorrect paths
app.use((req, res, next) => {
    res.status(404).send({ msg: "Path not found" })
})

//500 error
app.use((err, req, res, next) => {
    console.log(err);
    res.status(500);
});

module.exports = app;