# News API

## Background

I have built an API for the purpose of accessing application data programmatically. The intention was is to mimic the building of a real world backend service (such as reddit) which should provide information to the front end architecture.

The database is PSQL, and you interact with it using [node-postgres](https://node-postgres.com/).

## Hosted Version

The app is currently hosted at https://ac-nc-news-server.herokuapp.com/ *

The current end points are listed below:

GET /api                                    -> returns a list of endpoints and how to use them

GET /api/topics                         -> returns a list of topics

POST /api/topics                        -> adds a new topic and returns the comment

GET /api/articles                       -> returns a list of the articles

POST /api/articles                      -> adds a new article and returns the comment

GET /api/articles/:article_id           -> returns an article with the specified id

PATCH /api/articles/:article_id         -> updates the votes of the article with the specified id and returns the article

DELETE /api/articles/:article_id        -> deletes article with the specified id

GET /api/articles/:article_id/comments  -> returns all the comments of the specified article

POST /api/articles/:article_id/comments -> adds a new comment to the specified article and returns the comment

PATCH /api/comments/:comment_id         -> updates the votes of the comment with the specified id and returns the comment

DELETE /api/comments/:comment_id        -> deletes comment with the specified id

GET /api/users                          -> returns a list of users

GET /api/users/:username                -> returns a user

*Heroku is changing its policy on the 22nd Nov 2022 to no longer include postgresql becasue of this the app may be down for some time while a alternative hosting provider is found. 

## Development Info

### Running the project locally

Feel free to clone this project and run in your own dev enviroment.

This project provides a database and a seed file to populate the database. 
To run this project locally and access the data base follow these steps:

1. Install all dependencies by running **npm i** in your terminal.
2. create two **.env** files **.env.development** and **.env.test**
3. add **PGDATABASE=nc_news** and **PGDATABASE=nc_news_test** to these files respectively
4. use the scripts **npm run setup-dbs** and **npm run seed** to create and seed the data bases
5. run the script **npm run test** to run the test suites or **npm run start** to run the server with the development data
6. use an application like **insomnia** on port **9090** to see the end point responses.

node version 18.9.0 is recommended
postgres version 8.7.3 is recommended


