const { addCommentToArticle, removeComment } = require('../models/modelsComments')
const { fetchArticle} = require('../models/modelsArticles')
const { response } = require('express');


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

exports.deleteComment = (req, res, next) => {
    const id = req.params.comment_id;

    removeComment(id)
    .then(() => {
        res.status(204).send()
    })
    .catch(err => {
        next(err)
    })
}