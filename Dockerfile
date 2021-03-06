FROM mhart/alpine-node:latest

WORKDIR /src
COPY . .

RUN yarn install --prod

CMD ["node", "index.js"]