import DatabaseService from '../../../../lib/db';

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await DatabaseService.removeCity(id);
    return Response.json({ success: true });
  } catch (error) {
    console.error('Delete city error:', error);
    return Response.json({ success: false, error: 'Failed to delete city' }, { status: 500 });
  }
}