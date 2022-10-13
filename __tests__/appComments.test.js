const seed = require('../db/seeds/seed');
const testData = require('../db/data/test-data/index');
const db = require('../db/connection');
const app = require('../server/app');
const request = require('supertest');

beforeEach(() => seed(testData));

afterAll(() => {
    db.end();
});

describe('GET api/articles/id/comments', () => {
    test('return 200 and array of comments for article', () => {
        return request(app).get('/api/articles/1/comments').expect(200)
        .then(({ body: { comments } }) => {
            expect(comments).toBeInstanceOf(Array);
            expect(comments.length > 0).toBe(true);
            expect(comments).toBeSortedBy('created_at')
            comments.forEach(comment => {
                expect(comment).toEqual(
                    expect.objectContaining({
                        comment_id: expect.any(Number),
                        votes: expect.any(Number),
                        created_at: expect.any(String),
                        author: expect.any(String),
                        body: expect.any(String)
                    })
                );
            });
        });
    });

    test('return 200 and an empty array if the article exsists but has no comments', () => {
        return request(app).get('/api/articles/2/comments').expect(200)
        .then(({ body: { comments } }) => {
            expect(comments).toBeInstanceOf(Array);
            expect(comments.length).toBe(0);
        });
    });

    test('404 and an error if the id doesnt exsist', () => {
        return request(app).get('/api/articles/9999/comments').expect(404)
        .then(({body: { msg }}) => {
            expect(msg).toBe('that article id does not exsist')
        })
    });
});

describe('POST /api/articles/id/comment', () => {
    test('return 201 and posted comment is returned if a valid username is provided', () => {
        const input = {username: 'butter_bridge', body: 'I loved this article'}

        return request(app).post('/api/articles/2/comments').send(input).expect(201)
        .then(({ body: { comment } }) => {
            expect(comment).toBeInstanceOf(Object);
            expect(comment).toEqual(
                expect.objectContaining({
                    body: "I loved this article",
                    votes: 0,
                    author: "butter_bridge",
                    article_id: expect.any(Number),
                    created_at: expect.any(String),
                    comment_id: expect.any(Number)
                })
            );
        })
    });

    test('returns 404 when inputted id does not exsit', () => {
        const input = {username: 'butter_bridge', body: 'I loved this article'}
        return request(app).post('/api/articles/9999/comments').send(input).expect(404)
        .then(({body: { msg }}) => {
            expect(msg).toBe('Information not found')
        })
    });

    test('returns 400 when wrong data is inputted on path', () => {
        const input = {username: 'butter_bridge', body: 'I loved this article'}
        return request(app).post('/api/articles/ONE/comments').send(input).expect(400)
        .then(({body: { msg }}) => {
            expect(msg).toBe('incorrect data type inputted')
        })
    });

    test('returns 400 when incorrect post data is inputted', () => {
        const input = {article_name: 'I love coding'}
        return request(app).post('/api/articles/1/comments').send(input).expect(400)
        .then(({body: { msg }}) => {
            expect(msg).toBe('incorrect data format')
        })
    });

    test('returns 404 and fails to post if username is not valid', () => {
        const input = {username: 'aaronCurrie', body: 'This is a great article'}
        return request(app).post('/api/articles/1/comments').send(input).expect(404)
        .then(({body: { msg }}) => {
            expect(msg).toBe('Information not found')
        })
    })
});

describe('DELETE api/comment/comment_id', () => {
    test('returns 204 and returns nothing', () => {
        return request(app).delete('/api/comments/1').expect(204)
    });
    test('returns 404 if comment_id is does not exist', () => {
        return request(app).delete('/api/comments/9999').expect(404)
        .then(({body: { msg }}) => {
            expect(msg).toBe('comment id does not exist, nothing deleted')
        })
    });
    test('returns 400 if comment_id is invalid', () => {
        return request(app).delete('/api/comments/apples').expect(400)
        .then(({body: { msg }}) => {
            expect(msg).toBe('incorrect data type inputted')
        })
    });
});

describe('PATCH/api/comments/:comment_id', () => {
    test('returns a 200 and the updated oject when incrementing', () => {
        const update = {inc_votes: 43}

        return request(app).patch('/api/comments/1').send(update).expect(200)
        .then(({ body: { comment } }) => {
            expect(comment).toBeInstanceOf(Object);
            expect(comment).toEqual(
                expect.objectContaining({
                    comment_id: 1,
                    body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
                    votes: 59,
                    author: "butter_bridge",
                    article_id: 9,
                    created_at: expect.any(String),
                })
            );
        })
    })

    test('returns a 200 and the updated oject when decrementing', () => {
        const update = {inc_votes: -1}

        return request(app).patch('/api/comments/1').send(update).expect(200)
        .then(({ body: { comment } }) => {
            expect(comment).toBeInstanceOf(Object);
            expect(comment).toEqual(
                expect.objectContaining({
                    comment_id: 1,
                    body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
                    votes: 15,
                    author: "butter_bridge",
                    article_id: 9,
                    created_at: expect.any(String),
                })
            );
        })
    })

    test('incorrect id inputted', () => {
        const update = {inc_votes: 43}
        return request(app).patch('/api/comments/9999').send(update).expect(404)
        .then(({body: { msg }}) => {
            expect(msg).toBe('that comment id does not exsist')
        })
    });

    test('bad request on path', () => {
        const update = {inc_votes: 43}
        return request(app).patch('/api/comments/one').send(update).expect(400)
        .then(({body: { msg }}) => {
            expect(msg).toBe('incorrect data type inputted')
        })
    });

    test('returns 400 when inputted patch data is incorrect data type', () => {
        const update = {inc_votes: 'one'}
        return request(app).patch('/api/comments/1').send(update).expect(400)
        .then(({body: { msg }}) => {
            expect(msg).toBe('incorrect data type inputted')
        })
    });

    test('returns 400 when incorrect patch data is inputted', () => {
        const update = {body: 'I love coding'}
        return request(app).patch('/api/comments/1').send(update).expect(400)
        .then(({body: { msg }}) => {
            expect(msg).toBe('incorrect data format')
        })
    });
    
})