
exports.javascriptErrors = (err, req, res, next) => {
    if(err.status) {
        res.status(err.status).send({ msg: err.msg })
    } else {
        next(err)
    }
}

exports.psqlErrors = (err, req, res, next) => {
    if(err.code === '22P02') {
        res.status(400).send({msg: 'incorrect data type inputted'})
    } else if(err.code === '23502') {
        res.status(400).send({msg: 'incorrect data format'})
    } else if(err.code === '23503') {
        res.status(404).send({msg: 'something went wrong, inputted data incorrect'})
    } else if(err.code === '42703'){
        res.status(404).send({msg: 'column does not exist'})
    } else{
        next(err)
    }
}

exports.internalError = (err, req, res, next) => {
    console.log(err);
    res.status(500).send({ msg: "internal server error"});
}