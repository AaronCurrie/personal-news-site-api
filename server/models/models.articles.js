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

exports.fetchAllArticles = (topic, sort) => {
    const validSorts = ['title', 'topic', 'author', 'body', 'created_at', 'votes']

    if (!validSorts.includes(sort)) {
        return Promise.reject({
            status: 400,
            msg: 'invalid sort by query',
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
    let orderQuery = ` ORDER BY created_at DESC;`
    if(sort) {
        orderQuery = ` ORDER BY ${sort} DESC;`
    }
    baseQuery += orderQuery;

    return db.query(baseQuery, queryArr)
    .then(({ rows: articles }) => {
        console.log(articles)
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