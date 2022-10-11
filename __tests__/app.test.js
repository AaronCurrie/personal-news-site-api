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

describe(`GET/api/topics`, () => {
    test('status 200 returns topics', () => {
        return request(app).get('/api/topics').expect(200)
        .then(({ body: { topics } }) => {
            expect(topics).toBeInstanceOf(Array);
            expect(topics.length).toBe(3);
            topics.forEach(topic => {
                expect(topic).toEqual(
                    expect.objectContaining({
                        slug: expect.any(String),
                        description: expect.any(String),
                    })
                );
            });
        });
    });

    test('status 404 with incorrect path', () => {
        return request(app).get('/api/ttopics').expect(404)
        .then(({body: { msg }}) => {
            expect(msg).toBe('Path not found')
        })
    });
});

describe('GET/api/articles/:article_id', () => {
    test('status 200 returns topic with the id', () => {
        return request(app).get('/api/articles/1').expect(200)
        .then(({ body: { article } }) => {
            expect(article).toBeInstanceOf(Object);
            expect(article).toEqual(
                expect.objectContaining({
                    author: "butter_bridge",
                    title: "Living in the shadow of a great man",
                    article_id: 1,
                    body: "I find this existence challenging",
                    topic: "mitch",
                    created_at: "2020-07-09T20:11:00.000Z",
                    votes: 100
                })
            );
        });
    });

    test('incorrect id inputted', () => {
        return request(app).get('/api/articles/9999').expect(404)
        .then(({body: { msg }}) => {
            expect(msg).toBe('that article id does not exsist')
        })
    });

    test('bad request on path', () => {
        return request(app).get('/api/articles/ONE').expect(400)
        .then(({body: { msg }}) => {
            expect(msg).toBe('incorrect data type used on path')
        })
    });

});

describe('GET/api/users', () => {
    test('returns 200 and array of users', () => {
        return request(app).get('/api/users').expect(200)
        .then(({ body: { users } }) => {
            expect(users).toBeInstanceOf(Array);
            expect(users.length).toBe(4);
            users.forEach(user => {
                expect(user).toEqual(
                    expect.objectContaining({
                        username: expect.any(String),
                        name: expect.any(String),
                        avatar_url: expect.any(String)
                    })
                );
            });
        });
    });
});

describe('api/articles', () => {
    test('returns 200 and all articles', () => {
        return request(app).get('/api/articles').expect(200)
        .then(({ body: { articles } }) => {
            expect(articles).toBeInstanceOf(Array);
            expect(articles.length).toBe(12)
            articles.forEach(article => {
                expect(article).toEqual(expect.objectContaining({
                    author: expect.any(String),
                    title: expect.any(String),
                    article_id: expect.any(Number),
                    body: expect.any(String),
                    topic: expect.any(String),
                    created_at: expect.any(String),
                    votes: expect.any(Number),
                    comment_count: expect.any(Number)
                })
            );
            })

        });
    });
});