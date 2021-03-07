import symbols from "./symbols.js";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const talib = require('talib');

export default function computeRsi(data) {

    // console.dir(talib.explain("RSI"))

    const computedValues = {}
    
    data.forEach((symbol, i) => {
        
        let reduced = symbol.reduce((acc, c) => {
            acc.open.push(c[1])
            acc.high.push(c[2])
            acc.low.push(c[3])
            acc.close.push(c[4])
            return acc
        }, { open: [], high: [], low: [], close: [] })

        let rsi = talib.execute({
            name: "RSI",
            startIdx: 0,
            endIdx: reduced.close.length - 1,
            inReal: reduced.close,
            optInTimePeriod: 14
        });

        computedValues[symbols[i]] = rsi.result.outReal.slice(-1,rsi.length)[0]
    });

    return computedValues
}