const { fetchArticle, fetchAllArticles } = require('../models/models.articles')

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