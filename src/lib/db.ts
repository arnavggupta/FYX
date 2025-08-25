import sqlite3 from 'sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'weather.db');
const db = new sqlite3.Database(dbPath);


export const initDB = () => {
  return new Promise<void>((resolve, reject) => {
    db.serialize(() => {
   
      db.run(`
        CREATE TABLE IF NOT EXISTS cities (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          country TEXT NOT NULL,
          lat REAL NOT NULL,
          lon REAL NOT NULL,
          added_at INTEGER DEFAULT (strftime('%s', 'now'))
        )
      `);

 
      db.run(`
        CREATE TABLE IF NOT EXISTS weather_cache (
          city TEXT PRIMARY KEY,
          data TEXT NOT NULL,
          timestamp INTEGER NOT NULL,
          expires_at INTEGER NOT NULL
        )
      `);

     
      db.run(`
        CREATE TABLE IF NOT EXISTS forecast_cache (
          city TEXT PRIMARY KEY,
          data TEXT NOT NULL,
          timestamp INTEGER NOT NULL,
          expires_at INTEGER NOT NULL
        )
      `, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  });
};

export default db;