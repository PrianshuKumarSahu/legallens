-- LegalLens Database Schema
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/etiougrombgzfikegdpq/sql/new

-- Enable pgvector extension for document embeddings (RAG)
CREATE EXTENSION IF NOT EXISTS vector;

-- ============================================
-- 1. User Profiles (extends Supabase Auth)
-- ============================================
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, avatar_url)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
        NEW.raw_user_meta_data->>'avatar_url'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- 2. Documents
-- ============================================
CREATE TABLE IF NOT EXISTS documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    original_text TEXT,
    simplified_text TEXT,
    document_type TEXT DEFAULT 'other' CHECK (document_type IN ('contract', 'agreement', 'policy', 'tos', 'nda', 'lease', 'employment', 'other')),
    file_path TEXT,
    file_name TEXT,
    file_type TEXT CHECK (file_type IN ('pdf', 'docx', 'txt', 'text')),
    file_size INTEGER,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_documents_user_id ON documents(user_id);
CREATE INDEX IF NOT EXISTS idx_documents_created_at ON documents(created_at DESC);

-- ============================================
-- 3. Document Chunks (for RAG / embeddings)
-- ============================================
CREATE TABLE IF NOT EXISTS document_chunks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID REFERENCES documents(id) ON DELETE CASCADE NOT NULL,
    chunk_index INTEGER NOT NULL,
    content TEXT NOT NULL,
    embedding vector(768),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Index for vector similarity search
CREATE INDEX IF NOT EXISTS idx_document_chunks_embedding ON document_chunks 
    USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
CREATE INDEX IF NOT EXISTS idx_document_chunks_document_id ON document_chunks(document_id);

-- ============================================
-- 4. AI Analysis Results (cached)
-- ============================================
CREATE TABLE IF NOT EXISTS analyses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID REFERENCES documents(id) ON DELETE CASCADE NOT NULL,
    analysis_type TEXT NOT NULL CHECK (analysis_type IN ('simplify', 'risk', 'summary', 'clauses', 'prepare', 'entities')),
    result JSONB NOT NULL,
    content_hash TEXT,
    model_used TEXT DEFAULT 'gemini-2.0-flash',
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_analyses_document_id ON analyses(document_id);
CREATE INDEX IF NOT EXISTS idx_analyses_type ON analyses(analysis_type);
CREATE INDEX IF NOT EXISTS idx_analyses_hash ON analyses(content_hash);

-- ============================================
-- 5. Chat Messages (Document Q&A)
-- ============================================
CREATE TABLE IF NOT EXISTS chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID REFERENCES documents(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_chat_messages_document_id ON chat_messages(document_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_user_id ON chat_messages(user_id);

-- ============================================
-- 6. Document Comparisons
-- ============================================
CREATE TABLE IF NOT EXISTS comparisons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    document_a_id UUID REFERENCES documents(id) ON DELETE CASCADE NOT NULL,
    document_b_id UUID REFERENCES documents(id) ON DELETE CASCADE NOT NULL,
    result JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_comparisons_user_id ON comparisons(user_id);

-- ============================================
-- 7. Row Level Security (RLS)
-- ============================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_chunks ENABLE ROW LEVEL SECURITY;
ALTER TABLE analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE comparisons ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON profiles
    FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

-- Documents policies
CREATE POLICY "Users can view own documents" ON documents
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own documents" ON documents
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own documents" ON documents
    FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own documents" ON documents
    FOR DELETE USING (auth.uid() = user_id);

-- Document chunks policies
CREATE POLICY "Users can view own document chunks" ON document_chunks
    FOR SELECT USING (
        document_id IN (SELECT id FROM documents WHERE user_id = auth.uid())
    );
CREATE POLICY "Users can insert own document chunks" ON document_chunks
    FOR INSERT WITH CHECK (
        document_id IN (SELECT id FROM documents WHERE user_id = auth.uid())
    );

-- Analyses policies
CREATE POLICY "Users can view own analyses" ON analyses
    FOR SELECT USING (
        document_id IN (SELECT id FROM documents WHERE user_id = auth.uid())
    );
CREATE POLICY "Users can insert own analyses" ON analyses
    FOR INSERT WITH CHECK (
        document_id IN (SELECT id FROM documents WHERE user_id = auth.uid())
    );

-- Chat messages policies
CREATE POLICY "Users can view own chats" ON chat_messages
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own chats" ON chat_messages
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Comparisons policies
CREATE POLICY "Users can view own comparisons" ON comparisons
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own comparisons" ON comparisons
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ============================================
-- 8. Storage Bucket for Documents
-- ============================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'documents',
    'documents',
    false,
    52428800, -- 50MB
    ARRAY['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain']
) ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Users can upload own documents" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'documents' AND 
        auth.uid()::text = (storage.foldername(name))[1]
    );
CREATE POLICY "Users can view own documents" ON storage.objects
    FOR SELECT USING (
        bucket_id = 'documents' AND 
        auth.uid()::text = (storage.foldername(name))[1]
    );
CREATE POLICY "Users can delete own documents" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'documents' AND 
        auth.uid()::text = (storage.foldername(name))[1]
    );

-- ============================================
-- 9. Vector Similarity Search Function (RAG)
-- ============================================
CREATE OR REPLACE FUNCTION match_document_chunks(
    query_embedding vector(768),
    match_threshold FLOAT DEFAULT 0.7,
    match_count INT DEFAULT 5,
    p_document_id UUID DEFAULT NULL
)
RETURNS TABLE (
    id UUID,
    document_id UUID,
    chunk_index INTEGER,
    content TEXT,
    similarity FLOAT
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT
        dc.id,
        dc.document_id,
        dc.chunk_index,
        dc.content,
        1 - (dc.embedding <=> query_embedding) AS similarity
    FROM document_chunks dc
    WHERE 
        (p_document_id IS NULL OR dc.document_id = p_document_id)
        AND 1 - (dc.embedding <=> query_embedding) > match_threshold
    ORDER BY dc.embedding <=> query_embedding
    LIMIT match_count;
END;
$$;

-- ============================================
-- 10. Updated_at trigger function
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_documents_updated_at
    BEFORE UPDATE ON documents
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();
