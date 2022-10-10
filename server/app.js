const express = require('express');

const { getTopics } = require('./controllers/controllers.topics')

const app = express();
app.use(express.json());

app.get('/api/topics', getTopics)


//error codes

//js errors
app.use((err, req, res, next) => {
    if (err.status && err.msg) {
        res.status(err.status).send({ msg: err.msg });
    } else {
        next(err);
    }
});

//PSQL errors
app.use((err, req, res, next) => {
    next(err)
});

app.use((err, req, res, next) => {
    console.log(err);
    res.sendStatus(500);
});

module.exports = app;