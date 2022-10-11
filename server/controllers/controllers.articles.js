const { fetchArticle, updateArticleVotes } = require('../models/models.articles')

exports.getArticle = (req, res, next) => {
    
    const id = req.params.article_id;

    fetchArticle(id).then((article) => {
        res.status(200).send({article})
    })
    .catch(err => {
        next(err)
    })
}

exports.patchArticle = (req, res, next) => {
    const id = req.params.article_id;
    const body = req.body.inc_votes;

    updateArticleVotes(id, body).then(article => {
        res.status(200).send({article})
    })
    .catch(err => next(err))
}