const db = require('../../db/connection')

exports.fetchArticle = (id) => {
    return db.query(`
    SELECT articles.*, COUNT(comments.article_id) ::INT AS comment_count
    FROM articles 
    LEFT JOIN comments ON articles.article_id = comments.article_id
    WHERE articles.article_id=$1
    GROUP BY articles.article_id
    `, [id])

    .then(({rows: article}) => {
        if(article.length === 0) {
            return Promise.reject({ status: 404, msg: 'that article id does not exsist'})
        } else {
            return article[0]
        }
    })
}

exports.fetchAllArticles = (topic, sort, order) => {
    const validSorts = ['title', 'topic', 'author', 'body', 'created_at', 'votes', 'comment_count']
    const validOrders = ['ASC', 'DESC']
    if(order){
        order = order.toUpperCase();
    }

    if (sort && !validSorts.includes(sort)) {
        return Promise.reject({
            status: 400,
            msg: 'invalid sort by query',
        });
    }

    if (order && !validOrders.includes(order)) {
        return Promise.reject({
            status: 400,
            msg: 'invalid order query',
        });
    }

    const queryArr = [];
    let baseQuery = `SELECT articles.*, COUNT(comments.article_id) ::INT AS comment_count
    FROM articles
    LEFT JOIN comments ON articles.article_id = comments.article_id`;
    if(topic) {
        baseQuery += ` WHERE topic=$1`;
        queryArr.push(topic)
    }
    baseQuery += ` GROUP BY articles.article_id`
    let sortQuery = ` ORDER BY created_at`
    if(sort) {
        sortQuery = ` ORDER BY ${sort}`
    }
    baseQuery += sortQuery;
    let orderQuery = ` DESC`
    if(order) {
        orderQuery = ` ${order}`
    }
    baseQuery += orderQuery
    baseQuery += `;`

    return db.query(baseQuery, queryArr)
    .then(({ rows: articles }) => {
        return articles;
    });
}

exports.updateArticleVotes = (id, votes) => {

    return db.query(`UPDATE articles SET votes = votes + $2 WHERE article_id = $1 RETURNING *;`, [id, votes])
    .then(({rows: article}) => {
        if(article.length === 0) {
            return Promise.reject({ status: 404, msg: 'that article id does not exsist'})
        } else {
            return article[0]
        }
    })
}