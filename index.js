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
        
        db.get(`SELECT symbols, isBelowThreshold, timestamp FROM ${config.db.table} WHERE symbols="${symbol}";`, (err, row) => {

            let timeDelta = Math.floor((Math.abs(new Date() - new Date(row.timestamp))/1000)/60);
            
            if (rsiValues[symbol] < THRESHOLD && !row.isBelowThreshold && timeDelta >= 90) {
                
                db.run(`UPDATE ${config.db.table} SET isBelowThreshold = 1, timestamp = "${new Date()}" WHERE symbols="${symbol}";`);

                axios.post(config.telegram.baseUrl + config.telegram.accessToken + '/sendMessage', {
                    chat_id: config.telegram.groupId,
                    text: `Binance Alert [${symbol}USDT/${INTERVAL}]: RSI unter ${THRESHOLD} ${new Date()}`
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
