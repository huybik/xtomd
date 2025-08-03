import { NextRequest, NextResponse } from 'next/server';
import pdf2md from '@opendocsg/pdf2md';

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const files = formData.getAll('file') as File[];

  if (!files || files.length === 0) {
    return NextResponse.json({ error: 'No files uploaded.' }, { status: 400 });
  }

  const results = await Promise.all(
    files.map(async (file) => {
      try {
        const buffer = Buffer.from(await file.arrayBuffer());
        const markdown = await pdf2md(buffer);
        return {
          fileName: file.name,
          status: 'success',
          markdown,
        };
      } catch (error) {
        console.error(`Conversion error for ${file.name}:`, error);
        return {
          fileName: file.name,
          status: 'error',
          error: `Failed to convert ${file.name}.`,
        };
      }
    })
  );

  return NextResponse.json({ results });
}
