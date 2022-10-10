const {
    fetchTopics,
} = require('../models/models.topics');

exports.getTopics = (req, res, next) => {
    
    fetchTopics()
        .then(topics => {
            res.status(200).send({ topics });
        })
        .catch(err => next(err));
};