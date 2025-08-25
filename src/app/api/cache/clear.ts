import { CacheManager } from "@/lib/cache";

export async function POST() {
  try {
    await CacheManager.clear();
    return Response.json({ success: true, message: 'Cache cleared successfully' });
  } catch (error) {
    console.error('Cache clear error:', error);
    return Response.json({ success: false, error: 'Failed to clear cache' }, { status: 500 });
  }
}