/**
 * Flashcard Download API
 * 
 * API endpoint for downloading generated flashcard files.
 * Supports multiple formats: JSON, CSV, TXT
 */

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { format, content, filename, mimeType } = body;

    if (!content || !format || !filename || !mimeType) {
      return NextResponse.json(
        { error: 'Missing required fields: content, format, filename, mimeType' },
        { status: 400 }
      );
    }

    // Validate format
    const validFormats = ['json', 'csv'];
    if (!validFormats.includes(format)) {
      return NextResponse.json(
        { error: `Invalid format. Supported formats: ${validFormats.join(', ')}` },
        { status: 400 }
      );
    }

    // Create response with file content
    const response = new NextResponse(content, {
      status: 200,
      headers: {
        'Content-Type': mimeType,
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });

    return response;

  } catch (error) {
    console.error('Flashcard download error:', error);
    return NextResponse.json(
      { error: 'Failed to generate download file' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { 
      message: 'Flashcard download endpoint. Use POST with flashcard data.',
      supportedFormats: ['json', 'csv']
    },
    { status: 200 }
  );
}
