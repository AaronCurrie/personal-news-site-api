const { addCommentToArticle } = require('../models/models.comments')
const { fetchArticle} = require('../models/models.articles')
const { createRef, formatComments } = require('../../db/seeds/utils')


exports.postArticleComment = (req, res, next) => {
    const id = req.params.article_id;
    const body = req.body;
    
    addCommentToArticle(id, body)
    .then(comment => {
        res.status(201).send({comment})
    })
    .catch(err => {
        next(err)
    })
}