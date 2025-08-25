import { NextResponse } from 'next/server';
import db, { initDB } from '../../../../lib/db'; 


type DBParams = (string | number | null)[];

function runQuery(query: string, params: DBParams = []): Promise<{ lastID: number; changes: number }> {
  return new Promise((resolve, reject) => {
    db.run(query, params, function (err) {
      if (err) {
        return reject(err);
      }
  
      resolve({ lastID: this.lastID, changes: this.changes });
    });
  });
}


export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await initDB();
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'City ID parameter is required' },
        { status: 400 }
      );
    }

    const result = await runQuery('DELETE FROM cities WHERE id = ?', [decodeURIComponent(id)]);

    if (result.changes === 0) {
        return NextResponse.json(
            { success: false, error: 'City not found' },
            { status: 404 }
        );
    }

    return NextResponse.json({ success: true });

  } catch (error ) {
    console.error('Delete city error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
