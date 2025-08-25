import { NextRequest } from 'next/server';
import { WeatherService } from '../../../lib/weather';
import DatabaseService from '../../../lib/db';

export async function GET() {
  try {
    const cities = await DatabaseService.getCities();
    return Response.json({ success: true, data: cities });
  } catch (error) {
    console.error('Get cities error:', error);
    return Response.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json();
    
    if (!query) {
      return Response.json({ success: false, error: 'Query required' }, { status: 400 });
    }

    const cities = await WeatherService.searchCities(query);
    return Response.json({ success: true, data: cities });
  } catch (error) {
    console.error('Search cities error:', error);
    return Response.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { name, country, lat, lon } = await request.json();
    const id = `${lat}-${lon}`;
    
    const city = {
      id,
      name,
      country,
      lat,
      lon,
      addedAt: Date.now()
    };

    await DatabaseService.addCity(city);
    return Response.json({ success: true, data: city });
  } catch (error) {
    console.error('Add city error:', error);
    return Response.json({ success: false, error: 'Failed to save city' }, { status: 500 });
  }
}