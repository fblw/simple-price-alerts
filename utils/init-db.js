import sqlite3 from 'sqlite3';
import config from '../config.js';
import symbols from "./symbols.js";

const db = new sqlite3.Database(config.db.name)

db.serialize(() => {
    db
    .run(`create table if not exists ${config.db.table} (symbols text primary key, isBelowThreshold bool);`);

    for (let symbol of symbols) {
        db.run(`insert into ${config.db.table} values("${symbol}", false);`);
    }

    db.close();
});
