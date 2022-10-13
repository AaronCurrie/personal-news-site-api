const articlesRouter = require('express').Router()

const { getArticle, getAllArticles, patchArticle, getArticleComments, postArticle } = require('../controllers/controllersArticles')
const { postArticleComment } = require('../controllers/controllersComment')

articlesRouter
.route('/:article_id')
.get(getArticle)
.patch(patchArticle)

articlesRouter
.route('/')
.get(getAllArticles)
.post(postArticle)

articlesRouter
.route('/:article_id/comments')
.get(getArticleComments)
.post(postArticleComment)

module.exports = articlesRouter