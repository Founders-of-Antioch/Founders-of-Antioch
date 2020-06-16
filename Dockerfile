FROM node:13.14.0

WORKDIR /usr/src/founders

COPY . .

RUN cd front-end && npm i
# RUN cd server && npm i
# RUN cd front-end && npm i
# RUN npm install --global typescript
# RUN cd server && tsc app.ts --jsx react --experimentalDecorators

EXPOSE 3001
EXPOSE 3000

CMD cd front-end && yarn start