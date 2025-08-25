import db from './db';

const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

// Define a type for the structure of a cache row in the database
interface CacheRow {
  data: string; // The data is stored as a JSON string
  expires_at: number;
}

export class CacheManager {

  /**
   * Retrieves an item from the cache.
   * Uses generics <T> to allow the caller to specify the expected return type.
   * @param key The key of the item to retrieve.
   * @param table The cache table to query.
   * @returns A promise that resolves to the parsed data of type T, or null if not found.
   */
  static async get<T>(key: string, table: 'weather_cache' | 'forecast_cache'): Promise<T | null> {
    return new Promise((resolve, reject) => {
      const now = Date.now();
      db.get(
        `SELECT data, expires_at FROM ${table} WHERE city = ? AND expires_at > ?`,
        [key, now],
        (err, row: CacheRow | undefined) => {
          if (err) {
            reject(err);
          } else if (row) {
            // Parse the JSON string and cast it to the expected type T
            resolve(JSON.parse(row.data) as T);
          } else {
            resolve(null);
          }
        }
      );
    });
  }

  /**
   * Stores an item in the cache.
   * Uses generics <T> to accept any data type for storage.
   * @param key The key to store the data under.
   * @param data The data to be stored. It will be stringified.
   * @param table The cache table to store the data in.
   * @returns A promise that resolves when the operation is complete.
   */
  static async set<T>(
    key: string, 
    data: T, 
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

  /**
   * Clears both cache tables.
   * @returns A promise that resolves when both tables are cleared.
   */
  static async clear(): Promise<void> {
    return new Promise((resolve, reject) => {
      db.run('DELETE FROM weather_cache', (err) => {
        if (err) {
          return reject(err);
        }
        db.run('DELETE FROM forecast_cache', (err) => {
          if (err) return reject(err);
          resolve();
        });
      });
    });
  }
}
