const { fetchUsers, fetchUser } = require('../models/modelsUsers')

exports.getUsers = (req, res, next) => {
    fetchUsers().then((users) => {
        res.status(200).send({users})
    })
    .catch(err => {
        next(err)
    })
}

exports.getUser = (req, res, next) => {   
    const id = req.params.username;

    fetchUser(id).then((user) => {
        res.status(200).send({user})
    })
    .catch(err => {
        next(err)
    })
}