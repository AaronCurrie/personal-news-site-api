const db = require('../../db/connection')
const { convertTimestampToDate } = require('../../db/seeds/utils')

exports.fetchComments = (id) => {
    return db.query(`
    SELECT comment_id, comments.votes, comments.created_at, comments.author, comments.body
    FROM comments
    JOIN articles ON comments.article_id = articles.article_id
    WHERE articles.article_id=$1
    ORDER BY created_at ASC
    `, [id])

    .then(({rows: comments}) => {
            return comments
    })
}

//you are working on this. how do we get teh time ?? utils??
exports.addCommentToArticle = (id, sentData) => {

    const username = sentData.username;
    const body = sentData.body

    return db.query('INSERT INTO comments (body, author, article_id) VALUES ($1, $2, $3) RETURNING *;', [body, username, id])
    .then(({rows: article}) => {

        return article[0]
        
    })
}