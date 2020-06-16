# Founders of Antioch

Founders of Antioch (FoA) is an open source alternative to the board game Settler of Catan.

## Setup

Simply run

`./setup.sh`

to install all of the dependencies. If this fails for some reason, you can install the dependencies manually just as easy with

`cd front-end && npm i`

`cd server && npm i`

Then you'll need to run 

```tsc```
 
to build the server

You should only need to run this once.

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

See each of the README's in the two folers (`server` and `front-end`) for more details.
