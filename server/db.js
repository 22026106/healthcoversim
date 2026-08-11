const path = require('path');
const fs = require('fs');
const Database = require('better-sqlite3');

const DB_PATH = path.join(__dirname, 'healthcoversim.db');
const INIT_SQL_PATH = path.join(__dirname, '..', 'init.sql');

const db = new Database(DB_PATH);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

const initSql = fs.readFileSync(INIT_SQL_PATH, 'utf8');
db.exec(initSql);

module.exports = db;