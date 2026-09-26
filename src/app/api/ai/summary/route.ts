export const maxDuration = 120;

import { NextResponse } from 'next/server';
import { generateText } from 'ai';
import { getGeminiModel } from '@/lib/gemini/client';
import { SUMMARY_PROMPT } from '@/lib/gemini/prompts';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { documentId } = await request.json();

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
      .eq('analysis_type', 'summary')
      .single() as any;

    if (cached) {
      return NextResponse.json(cached.result);
    }

    const { text } = await generateText({
      model: getGeminiModel(),
      system: SUMMARY_PROMPT,
      prompt: `Summarize the following document:\n\n${document.original_text || ''}`,
    });

    let parsedResult;
    try {
      const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || text.match(/{[\s\S]*}/);
      parsedResult = jsonMatch ? JSON.parse(jsonMatch[1] || jsonMatch[0]) : JSON.parse(text);
    } catch {
      parsedResult = { text };
    }

    try {
      await (supabase.from('analyses') as any).insert({
        document_id: documentId,
        analysis_type: 'summary',
        result: parsedResult,
        model_used: 'gemini-2.0-flash'
      });
    } catch (e) {
      console.error('Failed to cache summary analysis:', e);
    }

    return NextResponse.json(parsedResult);
  } catch (error) {
    console.error('Summary API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
