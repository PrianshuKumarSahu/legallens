import { NextResponse } from 'next/server';
import { createServerSupabaseClient, createServiceRoleClient } from '@/lib/supabase/server';
import { parsePDF } from '@/lib/parsers/pdf';
import { parseDOCX } from '@/lib/parsers/docx';
import { hashContent } from '@/lib/utils';

export async function POST(request: Request) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const title = formData.get('title') as string || file?.name || 'Untitled Document';
    const documentType = formData.get('documentType') as string || 'other';

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
    let textContent = '';

    if (file.type === 'application/pdf') {
      textContent = await parsePDF(buffer);
    } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      textContent = await parseDOCX(buffer);
    } else {
      textContent = buffer.toString('utf-8');
    }

    const contentHash = await hashContent(textContent);
    
    // Upload to storage
    const supabaseService = await createServiceRoleClient();
    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    
    const { data: uploadData, error: uploadError } = await supabaseService.storage
      .from('documents')
      .upload(fileName, buffer, {
        contentType: file.type,
      });

    if (uploadError) {
      console.error('Storage upload error:', uploadError);
      return NextResponse.json({ error: 'Failed to upload file to storage' }, { status: 500 });
    }

    const docFileType = (fileExt === 'pdf' ? 'pdf' : fileExt === 'docx' ? 'docx' : 'txt') as 'pdf' | 'docx' | 'txt';
    const validDocType = ['contract', 'agreement', 'policy', 'tos', 'nda', 'lease', 'employment', 'other'].includes(documentType) 
      ? (documentType as any) 
      : 'other';

    // Save to DB
    const { data: docData, error: dbError } = await supabase
      .from('documents')
      .insert({
        user_id: user.id,
        title,
        document_type: validDocType,
        original_text: textContent,
        file_path: fileName,
        file_name: file.name,
        file_size: file.size,
        file_type: docFileType,
        metadata: { content_hash: contentHash },
      } as any)
      .select()
      .single();

    if (dbError) {
      console.error('Database insert error:', dbError);
      // Attempt cleanup
      await supabaseService.storage.from('documents').remove([fileName]);
      return NextResponse.json({ error: 'Failed to save document record' }, { status: 500 });
    }

    return NextResponse.json(docData, { status: 201 });
  } catch (error) {
    console.error('Upload handler error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
