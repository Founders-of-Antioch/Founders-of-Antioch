# Founders of Antioch

Founders of Antioch (FoA) is an open source alternative to the board game Settler of Catan.

## Setup

NOTE: Dockerfile does not work yet

Simply run

`./setup.sh`

to install all of the dependencies. If this fails for some reason, you can install the dependencies manually just as easy with

`cd front-end && npm i`

`cd server && npm i`

Then you'll need to run

`cd server && tsc`

to build the server.

## Running

To dev-run the whole application in one terminal, just use

`./start-dev.sh`

and to prod-run the app in one terminal us

`./start.sh`

If you want to run them separately, use

`cd front-end && yarn start`

for the front-end and

`npm run start:watch`

for the back-end.

#### Making Changes

For the front-end, it should automatically reload anytime you save a change. The server will do this too, but sometimes when you make changes that reference another file, you have to stop and run

`cd server && tsc`

to build again. However, the start-dev script will automatically build for you, so you can restart that as well. If anyone knows a way around this, feel free to make an issue and a PR =).

See each of the README's in the two folers (`server` and `front-end`) for more details.
