import { NextResponse } from 'next/server';
import { renameFile, createFolder, deleteFile } from '@/lib/git';

export async function POST(request: Request) {
  try {
    const { action, oldPath, newPath, folderPath, filePath } = await request.json();
    
    if (action === 'rename') {
      await renameFile(oldPath, newPath);
      return NextResponse.json({ success: true });
    }
    
    if (action === 'createFolder') {
      await createFolder(folderPath);
      return NextResponse.json({ success: true });
    }

    if (action === 'delete') {
      await deleteFile(filePath);
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

