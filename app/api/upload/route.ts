import { NextRequest, NextResponse } from 'next/server';
import { uploadToR2 } from '@/lib/r2';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const files = formData.getAll('file') as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No files provided' }, { status: 400 });
    }

    const uploadPromises = files.map(async (file) => {
      const buffer = Buffer.from(await file.arrayBuffer());
      const extension = file.name.split('.').pop();
      const filename = `${uuidv4()}.${extension}`;
      const key = `products/${filename}`;
      
      const url = await uploadToR2(buffer, key, file.type);
      return { url, name: file.name };
    });

    const results = await Promise.all(uploadPromises);

    return NextResponse.json({ success: true, files: results });
  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: error.message || 'Upload failed' }, { status: 500 });
  }
}
