
const { fetchArticle, fetchAllArticles, updateArticleVotes } = require('../models/models.articles')
const { fetchComments } = require('../models/models.comments')


exports.getArticle = (req, res, next) => {
    
    const id = req.params.article_id;

    fetchArticle(id).then((article) => {
        res.status(200).send({article})
    })
    .catch(err => {
        next(err)
    })
}

exports.getAllArticles = (req, res, next) => {
    fetchAllArticles().then(articles => {
        res.status(200).send({articles})
    })
    .catch(err => next(err))
}

exports.patchArticle = (req, res, next) => {
    const id = req.params.article_id;
    const body = req.body.inc_votes;

    updateArticleVotes(id, body).then(article => {
        res.status(200).send({article})

    })
    .catch(err => next(err))
}

exports.getArticleComments = (req, res, next) => {
    const id = req.params.article_id;

    const promises = [fetchComments(id), fetchArticle(id)]

    Promise.all(promises)
    .then(promises => {
        res.status(200).send({comments : promises[0]})
    })
    .catch(err => next(err))

}