import axios from 'axios';
import symbols from "./symbols.js";

export default function getBinanceData (interval, limitSymbols = 98) {
    
    function getKlines(symbol, interval) {
        return axios.get(
            'https://api.binance.com/api/v3/klines?limit=140&symbol=' 
            + symbol 
            + '&interval=' 
            + interval
            )
    }

    let requests = Array.from(symbols.slice(0,limitSymbols), s => getKlines(s + 'USDT', interval))
    
    return Promise.all(requests)
        .then(function (results) {
            let data = results.map(result => {
                if (result.status == 200) {
                    return result.data
                }
            });
            return data
    });
}
