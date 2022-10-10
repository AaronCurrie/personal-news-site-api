const db = require('../../db/connection')

exports.fetchArticle = (id) => {
    return db.query(`SELECT * FROM articles WHERE article_id=$1;`, [id])
    .then(({rows: article}) => {
        if(article.length === 0) {
            return Promise.reject({ status: 404, msg: 'that article id does not exsist'})
        } else {
            return article[0]
        }
        
    })
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