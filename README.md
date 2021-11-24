A simple script that periodically sends alerts to a Telegram group if an indicator meets a condition on Binance price data. In this specific case the script is only configured to trigger an alert if the RSI falls beneath a certain threshold (50). Binance API is requested for all symbols in /utils/symbols.js.

## Setup

You need to have an _accessToken_ for a Telegram group. Create a `config.js` file in the root directory to make it work:

```js
// config.js

const config = {
    db: {
        name: "MY_SQLITE_DB_NAME",
        table: "TABLE_NAME"
    },
    telegram: {
        baseUrl: "https://api.telegram.org",
        groupId: "GROUP_ID",
        accessToken: "ACCESS_TOKEN"
    }
}

export default config;
```

Then install, run the script and enjoy ~) 

```
npm install && npm run start
```
