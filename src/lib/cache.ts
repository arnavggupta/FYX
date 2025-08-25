import db from './db';

const CACHE_DURATION = 10 * 60 * 1000;  // 10 minutes i take 

export class CacheManager {
  static async get(key: string, table: 'weather_cache' | 'forecast_cache'): Promise<any> {
    return new Promise((resolve, reject) => {
      const now = Date.now();
      db.get(
        `SELECT data, expires_at FROM ${table} WHERE city = ? AND expires_at > ?`,
        [key, now],
        (err, row: any) => {
          if (err) {
            reject(err);
          } else if (row) {
            resolve(JSON.parse(row.data));
          } else {
            resolve(null);
          }
        }
      );
    });
  }

  static async set(
    key: string, 
    data: any, 
    table: 'weather_cache' | 'forecast_cache'
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const now = Date.now();
      const expiresAt = now + CACHE_DURATION;
      
      db.run(
        `INSERT OR REPLACE INTO ${table} (city, data, timestamp, expires_at) VALUES (?, ?, ?, ?)`,
        [key, JSON.stringify(data), now, expiresAt],
        (err) => {
          if (err) reject(err);
          else resolve();
        }
      );
    });
  }

  static async clear(): Promise<void> {
    return new Promise((resolve, reject) => {
      db.run('DELETE FROM weather_cache', (err) => {
        if (err) {
          reject(err);
        } else {
          db.run('DELETE FROM forecast_cache', (err) => {
            if (err) reject(err);
            else resolve();
          });
        }
      });
    });
  }
}