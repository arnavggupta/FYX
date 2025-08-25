import { NextResponse } from 'next/server';
import { CacheManager } from '@/lib/cache';
import { initDB } from '@/lib/db';


export async function POST(req: Request) {
  try {
    await initDB();
    await CacheManager.clear();
    
    return NextResponse.json({ success: true, message: 'Cache cleared successfully' });
  } catch (error) {
    console.error('Cache clear error:', error);
    return NextResponse.json(
        { success: false, error: 'Failed to clear cache' },
        { status: 500 }
    );
  }
}
