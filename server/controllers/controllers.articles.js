const { fetchArticle, editArticleVotes } = require('../models/models.articles')

exports.getArticle = (req, res, next) => {
    
    const id = req.params.article_id;

    fetchArticle(id).then((article) => {
        res.status(200).send({article})
    })
    .catch(err => {
        next(err)
    })
}

exports.patchArticles = (req, res, next) => {
    const id = req.params.article_id;

    editArticleVotes(id).then(article => {
        res.status(201).send({article})
    })
}