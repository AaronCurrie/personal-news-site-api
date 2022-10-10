const seed = require('../db/seeds/seed');
const {
    articleData,
    commentData,
    topicData,
    userData
} = require('../db/data/test-data/index');
const db = require('../db/connection');
const app = require('../server/app');
const request = require('supertest');

beforeEach(() => seed({     
    articleData,
    commentData,
    topicData,
    userData }));

afterAll(() => {
    db.end();
});

describe(`GET/api/topics`, () => {
    test('status 200 returns topics', () => {
    });
});