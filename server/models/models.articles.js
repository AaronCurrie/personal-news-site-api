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

exports.fetchAllArticles = () => {
    return db
    .query(`
    SELECT articles.*, COUNT(comments.article_id) ::INT AS comment_count
    FROM articles
    LEFT JOIN comments ON articles.article_id = comments.article_id
    GROUP BY articles.article_id;`)
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