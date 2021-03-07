import getBinanceData from './utils/klines.js';
import computeRsi from './utils/compute.js';
import config from './config.js';
import sqlite3 from 'sqlite3';
import axios from 'axios';

const THRESHOLD = 50.0

const INTERVAL = '4h'

const db = new sqlite3.Database(config.db.name)

const binanceData = await getBinanceData(INTERVAL)

const rsiValues = computeRsi(binanceData)

for (let symbol in rsiValues){
    
    db.serialize(() => {
        
        db.get(`SELECT symbols, isBelowThreshold FROM ${config.db.table} WHERE symbols="${symbol}";`, (err, row) => { 
            
            if (rsiValues[symbol] < THRESHOLD && !row.isBelowThreshold) {
                
                db.run(`UPDATE ${config.db.table} SET isBelowThreshold = 1 WHERE symbols="${symbol}";`);

                axios.post(config.telegram.baseUrl + config.telegram.accessToken + '/sendMessage', {
                    chat_id: config.telegram.groupId,
                    text: `${new Date()} Binance Alert [${symbol}USDT/${INTERVAL}]: RSI unter ${THRESHOLD}`
                })
                .then(function (response) {
                    console.log(response);
                })
                .catch(function (error) {
                    console.log(error);
                });

            } else if (rsiValues[symbol] >= THRESHOLD) {

                db.run(`UPDATE ${config.db.table} SET isBelowThreshold = 0 WHERE symbols="${symbol}";`);
            }
        });
    });
}
