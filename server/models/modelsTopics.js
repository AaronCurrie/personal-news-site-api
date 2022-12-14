const db = require('../../db/connection');

exports.fetchTopics = () => {
    return db
    .query(`SELECT * FROM topics`)
    .then(({ rows: topics }) => {
        return topics;
    });
}

exports.checkTopicsSlugs = (query) => {
    return db
    .query(`SELECT slug FROM topics WHERE slug = $1`, [query])
    .then(({ rows: topicsSlugs }) => {
        if(topicsSlugs.length === 0) {
            return Promise.reject({ status: 404, msg: 'invalid topic'})
        } else {
            return
        }
        
    });
}

exports.addTopic = (sentData) => {

    const slug = sentData.slug;
    const description = sentData.description

    return db.query('INSERT INTO topics (slug, description) VALUES ($1, $2) RETURNING *;', [slug, description])
    .then(({rows: article}) => {
        return article[0] 
    })
}