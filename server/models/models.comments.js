const db = require('../../db/connection')

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