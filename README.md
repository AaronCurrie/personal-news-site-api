# News API

## Background

I will be building an API for the purpose of accessing application data programmatically. The intention here is to mimic the building of a real world backend service (such as reddit) which should provide this information to the front end architecture.

The database will be PSQL, and you will interact with it using [node-postgres](https://node-postgres.com/).

## Development Info


### Running the project locally

This project provides and database and a seed file to populate the database. 
To run this project locally and access the data base follow these steps:

1. Install all dependencies by running **npm i** in your terminal.
2. create a two **.env** files **.env.development** and **.env.test**
3. add **PGDATABASE=nc_news** and **PGDATABASE=nc_news_test** to these files respectively
4. use the scripts **npm run setup-dbs** and **npm run seed** to create and seed the data bases
5. run the script **npm run test** to run the test suites or **npm run run-dev** to run the server with the development data



