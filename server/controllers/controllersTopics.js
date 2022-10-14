const { fetchTopics, addTopic } = require('../models/modelsTopics');

exports.getTopics = (req, res, next) => {
    
    fetchTopics()
        .then(topics => {
            res.status(200).send({ topics });
        })
        .catch(err => next(err));
};

exports.postTopic = (req, res, next) => {
    const body = req.body;
    
    addTopic(body)
    .then(topic => {
        res.status(201).send({topic})
    })
    .catch(err => {
        next(err)
    })
}