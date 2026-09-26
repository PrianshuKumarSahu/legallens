export const maxDuration = 120;

import { NextResponse } from 'next/server';
import { generateText } from 'ai';
import { getGeminiModel } from '@/lib/gemini/client';
import { TRANSLATION_PROMPT } from '@/lib/gemini/prompts';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { text, targetLanguage } = await request.json();

    if (!text || !targetLanguage) {
      return NextResponse.json({ error: 'Text and targetLanguage are required' }, { status: 400 });
    }

    const { text: generatedText } = await generateText({
      model: getGeminiModel(),
      system: TRANSLATION_PROMPT,
      prompt: `Translate the following legal text into ${targetLanguage}:\n\n${text}`,
    });

    return NextResponse.json({
      translatedText: generatedText,
      sourceLanguage: 'auto',
      targetLanguage
    });
  } catch (error) {
    console.error('Translate API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
