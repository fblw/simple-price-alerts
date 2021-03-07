FROM mhart/alpine-node:latest

WORKDIR /src

COPY package.json yarn.lock ./

RUN yarn install --prod

FROM mhart/alpine-node:slim

WORKDIR /src

COPY --from=0 /src .

COPY . .

CMD "rm -rf ./sqlite.db && node ./utils/init-db && pm2 start index.js --cron '*/5 * * * *' --log ./pm2.log"