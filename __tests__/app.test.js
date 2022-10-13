const seed = require('../db/seeds/seed');
const testData = require('../db/data/test-data/index');
const db = require('../db/connection');
const app = require('../server/app');
const request = require('supertest');

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

describe('GET/api/users/:username', () => {
    test('returns 200 and a user object', () => {
        return request(app).get('/api/users/butter_bridge').expect(200)
        .then(({ body: { user } }) => {
            expect(user).toBeInstanceOf(Object);
            expect(user).toEqual(
                expect.objectContaining({
                    username: 'butter_bridge',
                    name: 'jonny',
                    avatar_url: 'https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg'
                })
            );
        });
    });

    test('incorrect id inputted', () => {
        return request(app).get('/api/users/harry-pothead').expect(404)
        .then(({body: { msg }}) => {
            expect(msg).toBe('that username does not exsist')
        })
    });
});

describe('GET /api', () => {
    test('returns the json of instruction', () => {
        return request(app).get('/api').expect(200)
        .expect(({body: {apiData}}) => {
            const expectedData = require('../endpoints.json')
            expect(apiData).toEqual(expectedData)
        })
    })
});



