import { NextResponse } from 'next/server';
import { getFileContent, deleteFile, renameFile } from '@/lib/git';
import { cookies } from 'next/headers';
import path from 'node:path';

async function isAuthenticated() {
  const cookieStore = await cookies();
  return !!cookieStore.get('pan_session');
}

export async function GET(
  request: Request,
  props: { params: Promise<{ name: string }> }
) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { name } = await props.params;
    const decodedName = decodeURIComponent(name);
    const content = await getFileContent(decodedName);
    
    if (!content) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    const ext = path.extname(decodedName).toLowerCase();
    const mimeTypes: Record<string, string> = {
      '.txt': 'text/plain',
      '.html': 'text/html',
      '.css': 'text/css',
      '.js': 'application/javascript',
      '.json': 'application/json',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.gif': 'image/gif',
      '.svg': 'image/svg+xml',
      '.webp': 'image/webp',
      '.pdf': 'application/pdf',
      '.zip': 'application/zip',
      '.mp4': 'video/mp4',
      '.webm': 'video/webm',
      '.mp3': 'audio/mpeg',
      '.wav': 'audio/wav',
    };

    const contentType = mimeTypes[ext] || 'application/octet-stream';
    const { searchParams } = new URL(request.url);
    const forceDownload = searchParams.has('download');

    return new NextResponse(content, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `${forceDownload ? 'attachment' : 'inline'}; filename="${encodeURIComponent(decodedName)}"`,
        'Cache-Control': 'no-cache',
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  props: { params: Promise<{ name: string }> }
) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { name } = await props.params;
    const decodedName = decodeURIComponent(name);
    await deleteFile(decodedName);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  props: { params: Promise<{ name: string }> }
) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { name } = await props.params;
    const oldPath = decodeURIComponent(name);
    const { newPath } = await request.json();

    if (!newPath) {
      return NextResponse.json({ error: 'New path is required' }, { status: 400 });
    }

    await renameFile(oldPath, newPath);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
