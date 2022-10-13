const db = require('../../db/connection')

exports.fetchUsers = () => {
    return db
    .query(`SELECT * FROM users`)
    .then(({ rows: users }) => {
        return users;
    });
}

exports.fetchUser = (id) => {
    return db.query(`
    SELECT * 
    FROM users
    WHERE username=$1
    `, [id])

    .then(({rows: user}) => {
        if(user.length === 0) {
            return Promise.reject({ status: 404, msg: 'that username does not exsist'})
        } else {
            return user[0]
        }
    })
}
