export const maxDuration = 120;

import { NextResponse } from 'next/server';
import { streamText } from 'ai';
import { getGeminiModel } from '@/lib/gemini/client';
import { SIMPLIFY_PROMPT } from '@/lib/gemini/prompts';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { documentId, level = 'basic' } = await request.json();

    if (!documentId) {
      return NextResponse.json({ error: 'Document ID is required' }, { status: 400 });
    }

    const { data: document, error: docError } = await supabase
      .from('documents')
      .select('*')
      .eq('id', documentId)
      .single() as any;

    if (docError || !document) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    const { data: cached } = await supabase
      .from('analyses')
      .select('result')
      .eq('document_id', documentId)
      .eq('analysis_type', 'simplify')
      .single() as any;

    if (cached) {
      return NextResponse.json(cached.result);
    }

    const result = streamText({
      model: getGeminiModel(),
      system: SIMPLIFY_PROMPT,
      prompt: `Simplify the following legal text for a ${level} reading level:\n\n${document.original_text || ''}`,
      onFinish: async ({ text }) => {
        try {
          const supabase = await createServerSupabaseClient();
          await (supabase.from('analyses') as any).insert({
            document_id: documentId,
            analysis_type: 'simplify',
            result: { text, level },
            model_used: 'gemini-2.0-flash',
          });
        } catch (e) {
          console.error('Failed to cache simplify analysis:', e);
        }
      }
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error('Simplify API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
