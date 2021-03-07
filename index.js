import SNS from 'aws-sdk/clients/sns.js';
import getBinanceData from './utils/klines.js';
import computeRsi from './utils/compute.js';
import config from './config.js';
import sqlite3 from 'sqlite3';

const THRESHOLD = 45.0

const INTERVAL = '1h'

const db = new sqlite3.Database(config.db.name)

const sns = new SNS({
    endpoint: `https://sns.${config.aws.region}.amazonaws.com`,
    accessKeyId: config.aws.accessKeyId,
    secretAccessKey: config.aws.secretAccessKey,
    region: config.aws.region,
    sslEnabled: true
});

const binanceData = await getBinanceData(INTERVAL)

const rsiValues = computeRsi(binanceData)

for (let symbol in rsiValues){
    
    db.serialize(() => {
        
        db.get(`SELECT symbols, isBelowThreshold FROM ${config.db.table} WHERE symbols="${symbol}";`, (err, row) => { 
            
            if (rsiValues[symbol] < THRESHOLD && !row.isBelowThreshold) {
                
                console.log(symbol);

                db.run(`UPDATE ${config.db.table} SET isBelowThreshold = 1 WHERE symbols="${symbol}";`);

                const alert = {
                    Subject: 'RSI Alert',
                    Message: `Binance Alert [${symbol}USDT/${INTERVAL}]: RSI unter ${THRESHOLD}`,
                    TopicArn: `arn:aws:sns:${config.aws.region}:${config.aws.userId}:BinanceAlerts`
                };
        
                sns.publish(alert, (e, res) => {
                    if (e) console.log(e, e.stack);
                    else console.log('MessageId: ' + res.MessageId);
                });

            } else {
                
                db.run(`UPDATE ${config.db.table} SET isBelowThreshold = 0 WHERE symbols="${symbol}";`);
            }
        });
    });
}
