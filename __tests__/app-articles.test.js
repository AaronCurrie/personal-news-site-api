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

    test('accepts topic Query and returns all the articles related to the query', () => {
        return request(app).get('/api/articles?topic=cats').expect(200)
        .then(({ body: { articles } }) => {
            expect(articles).toBeInstanceOf(Array);
            expect(articles.length).toBe(1)
        });
    })

    test('articles are ordered in desc date order', () => {
        return request(app).get('/api/articles').expect(200)
        .then(({ body: { articles } }) => {
            expect(articles).toBeSortedBy('created_at', {descending: true})
        })
    })

    test('returns 200 and an empty array if topic exisits but has no articles', () => {
        return request(app).get('/api/articles?topic=paper').expect(200)
        .then(({ body: { articles } }) => {
            expect(articles).toBeInstanceOf(Array);
            expect(articles.length).toBe(0)
        })
    });

    test('returns 404 and error if query is incorrect', () => {
        return request(app).get('/api/articles?topic=cheese').expect(404)
        .then(({body: { msg }}) => {
            expect(msg).toBe('invalid topic')
        })
    });

});


describe('sort Query for api/articles', () => {
    test('orders articles by the inputted column', () => {
        return request(app).get('/api/articles?sort_by=votes').expect(200)
        .then(({ body: { articles } }) => {
            expect(articles).toBeSortedBy('votes', {descending: true})
        })
    });

    test('returns 400 when column does not exist', () => {
        return request(app).get('/api/articles?sort_by=dateMade').expect(400)
        .then(({ body: { msg } }) => {
            expect(msg).toBe('invalid sort by query')
        })
    })

    test('returns 400 if sql injection is attempted', () => {
        return request(app).get('/api/articles?sort_by=votes ASC; SELECT * FROM topics ORDER BY topic;').expect(400)
        .then(({ body: { msg } }) => {
            expect(msg).toBe('invalid sort by query')
        })
    })
});

describe('order query changes the sort to asc or desc', () => {
    test('asc input changes the order to ascending', () => {
        return request(app).get('/api/articles?order=asc').expect(200)
        .then(({ body: { articles } }) => {
            expect(articles).toBeSortedBy('created_at')
        })
    });

    test('desc input changes the order to descending', () => {
        return request(app).get('/api/articles?order=desc').expect(200)
        .then(({ body: { articles } }) => {
            expect(articles).toBeSortedBy('created_at' ,{descending: true})
        })
    });

    test('order query works with a sort by query to order buy the corect column', () => {
        return request(app).get('/api/articles?order=asc&sort_by=votes').expect(200)
        .then(({ body: { articles } }) => {
            expect(articles).toBeSortedBy('votes')
        })
    });

    test('returns 404 when order order is not asc or desc', () => {
        return request(app).get('/api/articles?order=bigFirst').expect(400)
        .then(({ body: { msg } }) => {
            expect(msg).toBe('invalid order query')
        })
    })
});