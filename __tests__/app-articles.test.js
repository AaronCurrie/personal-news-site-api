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

    test('no id inputted', () => {
        return request(app).get('/api/articles/').expect(404)
        .then(({body: { msg }}) => {
            expect(msg).toBe('Path not found')
        })
    }); 

    test('bad request on path', () => {
        return request(app).get('/api/articles/ONE').expect(400)
        .then(({body: { msg }}) => {
            expect(msg).toBe('incorrect data type inputted')
        })
    });
});


describe('PATCH/api/articles/:article_id', () => {
    test('returns a 200 and the updated oject when incrementing', () => {
        const update = {inc_votes: 43}

        return request(app).patch('/api/articles/1').send(update).expect(200)
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
                    votes: 143
                })
            );
        })
    })

    test('returns a 200 and the updated oject when decrementing', () => {
        const update = {inc_votes: -1}

        return request(app).patch('/api/articles/1').send(update).expect(200)
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
                    votes: 99
                })
            );
        })
    })

    test('incorrect id inputted', () => {
        const update = {inc_votes: 43}
        return request(app).patch('/api/articles/9999').send(update).expect(404)
        .then(({body: { msg }}) => {
            expect(msg).toBe('that article id does not exsist')
        })
    });

    test('bad request on path', () => {
        const update = {inc_votes: 43}
        return request(app).patch('/api/articles/ONE').send(update).expect(400)
        .then(({body: { msg }}) => {
            expect(msg).toBe('incorrect data type inputted')
        })
    });

    test('returns 400 when inputted patch data is incorrect data type', () => {
        const update = {inc_votes: 'one'}
        return request(app).patch('/api/articles/1').send(update).expect(400)
        .then(({body: { msg }}) => {
            expect(msg).toBe('incorrect data type inputted')
        })
    });

    test('returns 400 when incorrect patch data is inputted', () => {
        const update = {article_name: 'I love coding'}
        return request(app).patch('/api/articles/1').send(update).expect(400)
        .then(({body: { msg }}) => {
            expect(msg).toBe('incorrect data format')
        })
    });
})