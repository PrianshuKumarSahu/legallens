import { NextResponse } from 'next/server';
import { createServerSupabaseClient, createServiceRoleClient } from '@/lib/supabase/server';
import { parsePDF } from '@/lib/parsers/pdf';
import { parseDOCX } from '@/lib/parsers/docx';
import { hashContent } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const contentType = request.headers.get('content-type') || '';
    const supabaseService = await createServiceRoleClient();

    let title = 'Untitled Document';
    let textContent = '';
    let documentType = 'other';
    let fileName: string | null = null;
    let fileType: 'pdf' | 'docx' | 'txt' | 'text' = 'text';
    let fileSize: number = 0;
    let filePath: string | null = null;

    // Handle 1: JSON body (Paste Text)
    if (contentType.includes('application/json')) {
      const body = await request.json();
      title = (body.title || 'Untitled Document').trim();
      textContent = (body.text || body.content || '').trim();
      documentType = body.document_type || body.documentType || 'other';

      if (!textContent) {
        return NextResponse.json({ error: 'Document text is required' }, { status: 400 });
      }

      fileType = 'text';
      fileName = `${title.replace(/[^a-zA-Z0-9_-]/g, '_')}.txt`;
      fileSize = Buffer.byteLength(textContent, 'utf-8');
    } 
    // Handle 2: FormData (File Upload)
    else {
      const formData = await request.formData();
      const file = formData.get('file') as File | null;
      title = (formData.get('title') as string) || file?.name || 'Untitled Document';
      documentType = (formData.get('documentType') as string) || (formData.get('document_type') as string) || 'other';

      if (!file) {
        return NextResponse.json({ error: 'No file provided' }, { status: 400 });
      }

      const MAX_SIZE = 20 * 1024 * 1024;
      if (file.size > MAX_SIZE) {
        return NextResponse.json({ error: 'File size exceeds 20MB limit' }, { status: 400 });
      }

      const allowedTypes = [
        'application/pdf', 
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain'
      ];
      if (!allowedTypes.includes(file.type)) {
        return NextResponse.json({ error: 'Invalid file type. Only PDF, DOCX, and TXT allowed.' }, { status: 400 });
      }

      const buffer = Buffer.from(await file.arrayBuffer());

      if (file.type === 'application/pdf') {
        textContent = await parsePDF(buffer);
        fileType = 'pdf';
      } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        textContent = await parseDOCX(buffer);
        fileType = 'docx';
      } else {
        textContent = buffer.toString('utf-8');
        fileType = 'txt';
      }

      const fileExt = file.name.split('.').pop() || 'txt';
      filePath = `${user.id}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      fileName = file.name;
      fileSize = file.size;

      // Upload file to Supabase storage bucket
      const { error: uploadError } = await supabaseService.storage
        .from('documents')
        .upload(filePath, buffer, {
          contentType: file.type,
          upsert: true,
        });

      if (uploadError) {
        console.error('Storage upload warning:', uploadError);
        // Continue even if storage fails since original_text is preserved in DB
      }
    }

    const contentHash = await hashContent(textContent);

    const validDocTypes = ['contract', 'agreement', 'policy', 'tos', 'nda', 'lease', 'employment', 'other'];
    const sanitizedDocType = validDocTypes.includes(documentType.toLowerCase())
      ? (documentType.toLowerCase() as any)
      : 'other';

    // Insert into database using service role to prevent any RLS edge cases
    const { data: docData, error: dbError } = await supabaseService
      .from('documents')
      .insert({
        user_id: user.id,
        title,
        document_type: sanitizedDocType,
        original_text: textContent,
        file_path: filePath,
        file_name: fileName,
        file_size: fileSize,
        file_type: fileType,
        metadata: { content_hash: contentHash },
      } as any)
      .select()
      .single();

    if (dbError) {
      console.error('Database insert error:', dbError);
      return NextResponse.json({ error: dbError.message || 'Failed to save document record' }, { status: 500 });
    }

    return NextResponse.json(docData, { status: 201 });
  } catch (error: any) {
    console.error('Upload handler error:', error);
    return NextResponse.json({ error: error?.message || 'Internal server error' }, { status: 500 });
  }
}
