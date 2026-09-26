export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          updated_at?: string;
        };
      };
      documents: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          original_text: string | null;
          simplified_text: string | null;
          document_type: 'contract' | 'agreement' | 'policy' | 'tos' | 'nda' | 'lease' | 'employment' | 'other';
          file_path: string | null;
          file_name: string | null;
          file_type: 'pdf' | 'docx' | 'txt' | 'text' | null;
          file_size: number | null;
          metadata: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          original_text?: string | null;
          simplified_text?: string | null;
          document_type?: 'contract' | 'agreement' | 'policy' | 'tos' | 'nda' | 'lease' | 'employment' | 'other';
          file_path?: string | null;
          file_name?: string | null;
          file_type?: 'pdf' | 'docx' | 'txt' | 'text' | null;
          file_size?: number | null;
          metadata?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          title?: string;
          original_text?: string | null;
          simplified_text?: string | null;
          document_type?: 'contract' | 'agreement' | 'policy' | 'tos' | 'nda' | 'lease' | 'employment' | 'other';
          file_path?: string | null;
          file_name?: string | null;
          file_type?: 'pdf' | 'docx' | 'txt' | 'text' | null;
          file_size?: number | null;
          metadata?: Json;
          updated_at?: string;
        };
      };
      document_chunks: {
        Row: {
          id: string;
          document_id: string;
          chunk_index: number;
          content: string;
          embedding: number[] | null;
          metadata: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          document_id: string;
          chunk_index: number;
          content: string;
          embedding?: number[] | null;
          metadata?: Json;
          created_at?: string;
        };
        Update: {
          content?: string;
          embedding?: number[] | null;
          metadata?: Json;
        };
      };
      analyses: {
        Row: {
          id: string;
          document_id: string;
          analysis_type: 'simplify' | 'risk' | 'summary' | 'clauses' | 'prepare' | 'entities';
          result: Json;
          content_hash: string | null;
          model_used: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          document_id: string;
          analysis_type: 'simplify' | 'risk' | 'summary' | 'clauses' | 'prepare' | 'entities';
          result: Json;
          content_hash?: string | null;
          model_used?: string;
          created_at?: string;
        };
        Update: {
          result?: Json;
          content_hash?: string | null;
        };
      };
      chat_messages: {
        Row: {
          id: string;
          document_id: string;
          user_id: string;
          role: 'user' | 'assistant';
          content: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          document_id: string;
          user_id: string;
          role: 'user' | 'assistant';
          content: string;
          created_at?: string;
        };
        Update: {
          content?: string;
        };
      };
      comparisons: {
        Row: {
          id: string;
          user_id: string;
          document_a_id: string;
          document_b_id: string;
          result: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          document_a_id: string;
          document_b_id: string;
          result: Json;
          created_at?: string;
        };
        Update: {
          result?: Json;
        };
      };
    };
    Functions: {
      match_document_chunks: {
        Args: {
          query_embedding: number[];
          match_threshold?: number;
          match_count?: number;
          p_document_id?: string;
        };
        Returns: {
          id: string;
          document_id: string;
          chunk_index: number;
          content: string;
          similarity: number;
        }[];
      };
    };
  };
}
