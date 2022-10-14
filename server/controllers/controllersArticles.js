
const { fetchArticle, fetchAllArticles, updateArticleVotes, addArticle, fetchArticlesByPage } = require('../models/modelsArticles')
const { fetchCommentsByPage, fetchComments } = require('../models/modelsComments');
const { checkTopicsSlugs } = require('../models/modelsTopics');


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
    const order = req.query.order
    const limit = (req.query.limit) ? req.query.limit : 10;
    const inputtedPageNumber = (req.query.p) ? req.query.p : 1;
    const page = (req.query.p) ? ((req.query.p - 1) * limit ): 0;

    //rather than having multiple calls to the data base can I get everything I need from fetchArticlesByPage?
    const promises = [fetchArticlesByPage(topic, sort, order, limit, page), fetchAllArticles(topic)]

    if(topic) {
        promises.push(checkTopicsSlugs(topic))
    }

    return Promise.all(promises)
    .then((promises) => {
        if(page > Number(promises[1].length)) {
            res.status(404).send({msg: 'that page does not exist'})
        } else {
            res.status(200).send(
            {
                articles: promises[0],
                displayed_on_page: promises[0].length,
                total_count: Number(promises[1].length),
                page: Number(inputtedPageNumber),
            })
        }

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

exports.getArticleComments = (req, res, next) => {
    const id = req.params.article_id;
    const limit = (req.query.limit) ? req.query.limit : 10;
    const inputtedPageNumber = (req.query.p) ? req.query.p : 1;
    const page = (req.query.p) ? ((req.query.p - 1) * limit ): 0;

    const promises = [fetchCommentsByPage(id, limit, page),fetchComments(id), fetchArticle(id)]

    Promise.all(promises)
    .then(promises => {
        if(page > Number(promises[1].length)) {
            res.status(404).send({msg: 'that page does not exist'})
        } else {
            res.status(200).send(
                {
                    comments : promises[0],
                    displayed_on_page: promises[0].length,
                    total_count: Number(promises[1].length),
                    page: Number(inputtedPageNumber)
                })
        }
    })
    .catch(err => next(err))

}

exports.postArticle = (req, res, next) => {
    const body = req.body;
    
    addArticle(body)
    .then(article => {
        res.status(201).send({article})
    })
    .catch(err => {
        next(err)
    })
}