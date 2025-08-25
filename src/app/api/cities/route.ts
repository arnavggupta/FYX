import { NextResponse } from 'next/server';
import { WeatherService } from '../../../lib/weather';
import db, { initDB } from '../../../lib/db';


function runQuery(query: string, params: any[] = []): Promise<any> {
  return new Promise((resolve, reject) => {
    db.run(query, params, function (err) {
      if (err) {
        return reject(err);
      }
      
      resolve({ lastID: this.lastID, changes: this.changes });
    });
  });
}


function getQuery(query: string, params: any[] = []): Promise<any[]> {
    return new Promise((resolve, reject) => {
        db.all(query, params, (err, rows) => {
            if (err) {
                return reject(err);
            }
            resolve(rows);
        });
    });
}



export async function GET(req: Request) {
  try {
    await initDB();
    const rows = await getQuery('SELECT * FROM cities ORDER BY added_at DESC');
    return NextResponse.json({ success: true, data: rows });
  } catch (error: any) {
    console.error('Cities GET Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}


export async function POST(req: Request) {
  try {
    const { query } = await req.json();

    if (!query) {
      return NextResponse.json(
        { success: false, error: 'Query required' },
        { status: 400 }
      );
    }

   
    const cities = await WeatherService.searchCities(query);
    return NextResponse.json({ success: true, data: cities });
  } catch (error: any) {
    console.error('Cities POST Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}


export async function PUT(req: Request) {
  try {
    await initDB();
    const { name, country, lat, lon } = await req.json();
    const id = `${lat}-${lon}`;

    if (!name || !country || lat === undefined || lon === undefined) {
        return NextResponse.json(
            { success: false, error: 'Missing required city data' },
            { status: 400 }
        );
    }

    await runQuery(
      'INSERT OR REPLACE INTO cities (id, name, country, lat, lon) VALUES (?, ?, ?, ?, ?)',
      [id, name, country, lat, lon]
    );

    return NextResponse.json({ success: true, data: { id, name, country, lat, lon } });
  } catch (error: any) {
    console.error('Cities PUT Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save city' },
      { status: 500 }
    );
  }
}
