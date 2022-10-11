const seed = require('../db/seeds/seed');
const testData = require('../db/data/test-data/index');
const db = require('../db/connection');
const app = require('../server/app');
const request = require('supertest');
const { response } = require('express')

beforeEach(() => seed(testData));

afterAll(() => {
    db.end();
});

xdescribe('GET api/articles/id/comments', () => {
    test('return 200 and array of comments for article', () => {
        return request(app).get('/api/articles/1/comments').expect(200)
        .then(({ body: { comments } }) => {
            expect(comments).toBeInstanceOf(Array);
            expect(comments.length > 0).toBe(true);
            comments.forEach(comment => {
                expect(comment).toEqual(
                    expect.objectContaining({
                        comment_id: expect.any(String),
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