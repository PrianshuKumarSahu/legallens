export const maxDuration = 120;

import { NextResponse } from 'next/server';
import { generateText } from 'ai';
import { getGeminiModel } from '@/lib/gemini/client';
import { COMPARISON_PROMPT } from '@/lib/gemini/prompts';
import { createServerSupabaseClient, createServiceRoleClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { documentAId, documentBId } = await request.json();

    if (!documentAId || !documentBId) {
      return NextResponse.json({ error: 'Both documentAId and documentBId are required' }, { status: 400 });
    }

    const { data: docs, error: docError } = await supabase
      .from('documents')
      .select('id, original_text, title')
      .in('id', [documentAId, documentBId]) as any;

    if (docError || !docs || docs.length !== 2) {
      return NextResponse.json({ error: 'One or both documents not found' }, { status: 404 });
    }

    const docA = docs.find((d: any) => d.id === documentAId);
    const docB = docs.find((d: any) => d.id === documentBId);

    const { text } = await generateText({
      model: getGeminiModel(),
      system: COMPARISON_PROMPT,
      prompt: `Compare the following two documents:\n\nDocument A (${docA?.title}):\n${docA?.original_text}\n\nDocument B (${docB?.title}):\n${docB?.original_text}`,
    });

    let parsedResult;
    try {
      const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || text.match(/{[\s\S]*}/);
      parsedResult = jsonMatch ? JSON.parse(jsonMatch[1] || jsonMatch[0]) : JSON.parse(text);
    } catch {
      parsedResult = { text };
    }

    try {
      const supabaseService = await createServiceRoleClient();
      await (supabaseService.from('comparisons') as any).insert({
        document_a_id: documentAId,
        document_b_id: documentBId,
        user_id: user.id,
        result: parsedResult
      });
    } catch (e) {
      console.error('Failed to log comparison:', e);
    }

    return NextResponse.json(parsedResult);
  } catch (error: any) {
    console.error('Compare API error:', error);
    return NextResponse.json({ error: error?.message || 'Internal server error' }, { status: 500 });
  }
}
