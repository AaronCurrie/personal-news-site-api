const {
    fetchTopics,
} = require('../models/modelsTopics');

exports.getTopics = (req, res, next) => {
    
    fetchTopics()
        .then(topics => {
            res.status(200).send({ topics });
        })
        .catch(err => next(err));
};