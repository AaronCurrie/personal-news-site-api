
const { fetchArticle, fetchAllArticles, updateArticleVotes } = require('../models/models.articles')
const { fetchComments } = require('../models/models.comments');
const { checkTopicsSlugs } = require('../models/models.topics');


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
    const topic = req.query.topic;
    const sort = req.query.sort_by;

    const promises = [fetchAllArticles(topic, sort)]

    if(topic) {
        promises.push(checkTopicsSlugs(topic))
    }

    return Promise.all(promises)
    .then((promises) => {
        res.status(200).send({articles: promises[0]})
    })
    .catch(err => {
        console.log(err)
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

exports.getArticleComments = (req, res, next) => {
    const id = req.params.article_id;

    const promises = [fetchComments(id), fetchArticle(id)]

    Promise.all(promises)
    .then(promises => {
        res.status(200).send({comments : promises[0]})
    })
    .catch(err => next(err))

}