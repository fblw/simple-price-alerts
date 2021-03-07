import sqlite3 from 'sqlite3';
import config from '../config.js';

const symbols = ["BTC", "ETH", "BCH", "XRP", "EOS", "LTC", "TRX", "ETC", "LINK", "XLM", "ADA", "XMR", "DASH", "ZEC", "XTZ", "BNB", "ATOM", "ONT", "IOTA", "BAT", "VET", "NEO", "QTUM", "IOST", "THETA", "ALGO", "ZIL", "KNC", "ZRX", "COMP", "OMG", "DOGE", "SXP", "KAVA", "BAND", "RLC", "WAVES", "MKR", "SNX", "DOT", "YFI", "BAL", "CRV", "TRB", "YFII", "RUNE", "SUSHI", "SRM", "BZRX", "EGLD", "SOL", "ICX", "STORJ", "BLZ", "UNI", "AVAX", "FTM", "HNT", "ENJ", "FLM", "TOMO", "REN", "KSM", "NEAR", "AAVE", "FIL", "RSR", "LRC", "MATIC", "OCEAN", "CVC", "BEL", "CTK", "AXS", "ALPHA", "ZEN", "SKL", "GRT", "1INCH", "AKRO", "CHZ", "SAND", "ANKR", "LUNA", "BTS", "LIT", "UNFI", "DODO", "REEF", "RVN", "SFP", "XEM", "BTCST"]

const db = new sqlite3.Database(config.db.name)

db.serialize(() => {
    db
    .run(`create table if not exists ${config.db.table} (symbols text primary key, isBelowThreshold bool);`);

    for (let symbol of symbols) {
        db.run(`insert into ${config.db.table} values("${symbol}", false);`);
    }

    db.close();
});
