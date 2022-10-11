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

describe('Including comment count to articles', () => {
    test('GET api/articles/id will also return a comment count', () => {
        return request(app).get('/api/articles/1').expect(200)
        .then(({ body: { article } }) => {
            expect(article).toBeInstanceOf(Object);
            expect(article).toEqual(
                expect.objectContaining({
                    comment_count: 11,
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

    test('/still returns object with count of one', () => {
        return request(app).get('/api/articles/2').expect(200)
        .then(({ body: { article } }) => {
            expect(article).toBeInstanceOf(Object);
            expect(article).toEqual(
                expect.objectContaining({
                    votes: 0
                })
            );
        });
    })
});