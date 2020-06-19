# FoAPI

This is the backend/API for Founders of Antioch. It uses Express.JS (except with Typescript), TypeORM, and a postgresql database.

## Setup

`cd` into this directory (`server`) and run

`npm i`

to get all of the dependencies.

## Running

To run the dev server with hot reloading (recommended) use

`npm run start:watch`

This will reload the server anytime you make changes in this directory. If you want to run a prod or CI type server where changes won't cause a reload, just run

`npm start`

### DB

Make sure you have `psql` installed for postgres. Pgadmin is also recommended for monitoring/setting up the DB. DB runs on port 5432
