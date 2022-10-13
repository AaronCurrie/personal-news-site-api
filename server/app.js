const express = require('express');
const apiRouter = require('./routes/apiRouter')

const { psqlErrors, internalError, javascriptErrors} = require('./controllers/controllersErrors')

const app = express();
app.use(express.json())

//api router
app.use('/api', apiRouter)


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