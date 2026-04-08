import { NextRequest, NextResponse } from 'next/server';
import { uploadToR2 } from '@/lib/r2';
import { v4 as uuidv4 } from 'uuid';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const MAX_FILES = 10;

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const files = formData.getAll('file') as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No files provided' }, { status: 400 });
    }

    if (files.length > MAX_FILES) {
      return NextResponse.json({ error: `Maximum ${MAX_FILES} files allowed per upload` }, { status: 400 });
    }

    for (const file of files) {
      if (!ALLOWED_TYPES.includes(file.type)) {
        return NextResponse.json({ error: `Invalid file type: ${file.type}. Allowed: JPEG, PNG, WebP, GIF` }, { status: 400 });
      }
      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json({ error: `File "${file.name}" exceeds 5 MB limit` }, { status: 400 });
      }
    }

    const uploadPromises = files.map(async (file) => {
      const buffer = Buffer.from(await file.arrayBuffer());
      const extension = file.name.split('.').pop()?.toLowerCase() || 'jpg';
      const filename = `${uuidv4()}.${extension}`;
      const key = `products/${filename}`;

      const url = await uploadToR2(buffer, key, file.type);
      return { url, name: file.name };
    });

    const results = await Promise.all(uploadPromises);

    return NextResponse.json({ success: true, files: results });
  } catch (error: any) {
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
