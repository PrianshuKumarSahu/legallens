export const maxDuration = 120;

import { NextResponse } from 'next/server';
import { streamText } from 'ai';
import { getGeminiModel } from '@/lib/gemini/client';
import { CHAT_SYSTEM_PROMPT } from '@/lib/gemini/prompts';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { documentId, message, history = [] } = await request.json();

    if (!documentId || !message) {
      return NextResponse.json({ error: 'Document ID and message are required' }, { status: 400 });
    }

    const { data: document, error: docError } = await supabase
      .from('documents')
      .select('*')
      .eq('id', documentId)
      .single() as any;

    if (docError || !document) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    try {
      await (supabase.from('chat_messages') as any).insert({
        document_id: documentId,
        user_id: user.id,
        role: 'user',
        content: message
      });
    } catch (e) {
      console.error('Failed to log user chat message:', e);
    }

    const messages = [
      ...history,
      { role: 'user', content: message }
    ];

    const result = streamText({
      model: getGeminiModel(),
      system: `${CHAT_SYSTEM_PROMPT}\n\nDocument Context:\n${document.original_text || ''}`,
      messages,
      onFinish: async ({ text }) => {
        try {
          const supabase = await createServerSupabaseClient();
          await (supabase.from('chat_messages') as any).insert({
            document_id: documentId,
            user_id: user.id,
            role: 'assistant',
            content: text
          });
        } catch (e) {
          console.error('Failed to log assistant chat message:', e);
        }
      }
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
