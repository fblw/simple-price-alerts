import SNS from 'aws-sdk/clients/sns.js';
import getBinanceData from './utils/klines.js';
import computeRsi from './utils/compute.js';
import config from './config.js';

const sns = new SNS({
    endpoint: `https://sns.${config.aws.region}.amazonaws.com`,
    accessKeyId: config.aws.accessKeyId,
    secretAccessKey: config.aws.secretAccessKey,
    region: config.aws.region,
    sslEnabled: true
});

const binanceData = await getBinanceData('1h')

const rsiValues = computeRsi(binanceData)

for (let symbol in rsiValues){
    if (rsiValues[symbol] < 30.0) {
        const alert = {
            Subject: 'RSI Alert',
            Message: `Binance Alert [${symbol}USDT/1h]: RSI unter 30`, /* required */
            TopicArn: 'arn:aws:sns:eu-central-1:276386742905:BinanceAlerts'
        };
        sns.publish(alert, (e, res) => {
            if (e) console.log(e, e.stack);
            else console.log('MessageId: ' + res.MessageId);
        });
    }
}
