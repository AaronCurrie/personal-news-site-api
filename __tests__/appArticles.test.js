const seed = require('../db/seeds/seed');
const testData = require('../db/data/test-data/index');
const db = require('../db/connection');
const app = require('../server/app');
const request = require('supertest');

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
            expect(articles.length).toBe(10)
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

describe('POST /api/articles', () => {
    test('return 201 and posted article is returned if a valid username and topic is provided', () => {
        const input = {
            author: 'butter_bridge', 
            body: 'this article is about how I become the most powerful coding ledgend on the planet...',
            title: 'power comes power goes',
            topic: 'paper'
        }

        return request(app).post('/api/articles').send(input).expect(201)
        .then(({ body: { article } }) => {
            expect(article).toBeInstanceOf(Object);
            expect(article).toEqual(
                expect.objectContaining({
                    author: 'butter_bridge', 
                    body: 'this article is about how I become the most powerful coding ledgend on the planet...',
                    title: 'power comes power goes',
                    topic: 'paper',
                    article_id: expect.any(Number),
                    created_at: expect.any(String),
                    comment_count: 0,
                    votes: 0
                })
            );
        })
    });

    test('returns 400 when incorrect post data is inputted', () => {
        const input = {article_name: 'I love coding'}
        return request(app).post('/api/articles').send(input).expect(400)
        .then(({body: { msg }}) => {
            expect(msg).toBe('incorrect data format')
        })
    });

    test('returns 404 and fails to post if username does not exist', () => {
        const input = {
            author: 'aaron_currie', 
            body: 'this article is about how I become the most powerful coding ledgend on the planet...',
            title: 'power comes power goes',
            topic: 'paper'
        }
        return request(app).post('/api/articles').send(input).expect(404)
        .then(({body: { msg }}) => {
            expect(msg).toBe('something went wrong, inputted data incorrect')
        })
    })

    test('returns 404 and fails to post if topic does not exist', () => {
        const input = {
            author: 'butter_bridge', 
            body: 'this article is about how I become the most powerful coding ledgend on the planet...',
            title: 'power comes power goes',
            topic: 'POWER'
        }
        return request(app).post('/api/articles').send(input).expect(404)
        .then(({body: { msg }}) => {
            expect(msg).toBe('something went wrong, inputted data incorrect')
        })
    })
});

describe('api/articles limit query', () => {
    test('articles has a default limit of 10 when no limit query is included', () => {
        return request(app).get('/api/articles').expect(200)
        .then(({ body: { articles } }) => {
            expect(articles).toBeInstanceOf(Array);
            expect(articles.length).toBe(10)
        });
    });

    test('if a limit query is included sets limit to that number', () => {
        return request(app).get('/api/articles?limit=5').expect(200)
        .then(({ body: { articles } }) => {
            expect(articles).toBeInstanceOf(Array);
            expect(articles.length).toBe(5)
        });
    });

    test('if inputted query is not a number returns 400', () => {
        return request(app).get('/api/articles?limit=ten').expect(400)
        .then(({body: { msg }}) => {
            expect(msg).toBe('incorrect data type inputted')
        })
    });
});

describe('api/articles p query to set start page', () => {
    test('p query sets the starting page to correct spot depending on the limit', () => {
        return request(app).get('/api/articles?limit=2&p=2&sort_by=article_id').expect(200)
        .then(({ body: { articles } }) => {
            expect(articles).toBeInstanceOf(Array);
            expect(articles.length).toBe(2)
            expect(articles).toEqual( 
            [{
                article_id: 10,
                title: "Seven inspirational thought leaders from Manchester UK",
                topic: "mitch",
                author: "rogersop",
                body: "Who are we kidding, there is only one, and it's Mitch!",
                created_at: 1589433300000,
                votes: 0,
                comment_count: expect.any(Number),
                created_at: expect.any(String)
            },
            {
                article_id: 9,
                title: "They're not exactly dogs, are they?",
                topic: "mitch",
                author: "butter_bridge",
                body: "Well? Think about it.",
                created_at: 1591438200000,
                votes: 0,
                comment_count: expect.any(Number),
                created_at: expect.any(String)
            }])
        });
    });

    test('if p query is higher than the number of pages returns returns 404', () => {
        return request(app).get('/api/articles?limit=5&p=5').expect(404)
        .then(({body: { msg }}) => {
            expect(msg).toBe('that page does not exist')
        });
    });

    test('if inputted query is not a number returns 400', () => {
        return request(app).get('/api/articles?limit=5&p=one').expect(400)
        .then(({body: { msg }}) => {
            expect(msg).toBe('incorrect data type inputted')
        })
    });

    test('page does not exsit returns', () => {
        return request(app).get('/api/articles?limit=5&p=0').expect(404)
        .then(({body: { msg }}) => {
            expect(msg).toBe('that page does not exist')
        })
    });
});

describe('api/articles also returns a total count of articles', () => {
    test('total count shows the correct number of articles discounting the limit', () => {
        return request(app).get('/api/articles').expect(200)
        .then(({ body }) => {
            expect(body.total_count).toBe(12);
            expect(body.articles.length).toBe(10)
        });
    });

    test('total count shows the correct number of articles if a filter is applied', () => {
        return request(app).get('/api/articles?topic=mitch').expect(200)
        .then(({ body }) => {
            expect(body.total_count).toBe(11);
            expect(body.articles.length).toBe(10)
            expect(body.page).toBe(1)
        });
    });

    test('total count shows the correct number of articles when a limit and p number are included', () => {
        return request(app).get('/api/articles?topic=mitch&limit=5&p=2').expect(200)
        .then(({ body }) => {
            expect(body.total_count).toBe(11);
            expect(body.articles.length).toBe(5)
            expect(body.page).toBe(2)
        });
    });
});

describe('DELETE api/article/article_id', () => {
    test('deletes article returns 204 and returns nothing', () => {
        return request(app).delete('/api/articles/2').expect(204)
    });
    test.only('deletes article and its comments returns 204 and returns nothing if article has comments', () => {
        return request(app).delete('/api/articles/1').expect(204)
    });
    test('returns 404 if article_id is does not exist', () => {
        return request(app).delete('/api/articles/9999').expect(404)
        .then(({body: { msg }}) => {
            expect(msg).toBe('article id does not exist, nothing deleted')
        })
    });
    test('returns 400 if article_id is invalid', () => {
        return request(app).delete('/api/articles/apples').expect(400)
        .then(({body: { msg }}) => {
            expect(msg).toBe('incorrect data type inputted')
        })
    });
});