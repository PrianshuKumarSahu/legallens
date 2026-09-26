'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  FileText, Plus, Search, Trash2, Clock, File, AlertCircle 
} from 'lucide-react';
import { formatFileSize, formatRelativeTime, truncateText, DOCUMENT_TYPE_LABELS } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function DashboardPage() {
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/documents');
      if (!res.ok) throw new Error('Failed to fetch documents');
      const data = await res.json();
      setDocuments(Array.isArray(data) ? data : data.documents || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    if (!confirm('Are you sure you want to delete this document?')) return;
    
    try {
      const res = await fetch(`/api/documents/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete document');
      setDocuments(docs => docs.filter(doc => doc.id !== id));
    } catch (err: any) {
      alert(err.message);
    }
  };

  const filteredDocs = documents.filter(doc => 
    doc.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    doc.original_text?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight">My Documents</h1>
        <Link href="/document/upload">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Upload Document
          </Button>
        </Link>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <input 
          type="text" 
          placeholder="Search documents..." 
          className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {error && (
        <div className="bg-destructive/15 text-destructive p-4 rounded-md flex items-center">
          <AlertCircle className="w-5 h-5 mr-2" />
          {error}
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => (
            <Card key={i} className="animate-pulse h-48 bg-muted" />
          ))}
        </div>
      ) : filteredDocs.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed rounded-lg bg-muted/50">
          <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium">No documents found</h3>
          <p className="text-muted-foreground mb-4">
            {searchQuery ? 'Try a different search term' : 'Upload your first legal document to get started'}
          </p>
          {!searchQuery && (
            <Link href="/document/upload">
              <Button variant="outline">Upload Document</Button>
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDocs.map(doc => (
            <Link key={doc.id} href={`/document/${doc.id}`} className="block group">
              <Card className="h-full hover:border-primary transition-colors hover:shadow-md">
                <CardContent className="p-5 flex flex-col h-full">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2">
                      <File className="w-5 h-5 text-primary" />
                      <h3 className="font-semibold text-lg line-clamp-1" title={doc.title || 'Untitled'}>
                        {doc.title || 'Untitled'}
                      </h3>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-muted-foreground hover:text-destructive -mt-2 -mr-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => handleDelete(e, doc.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <div className="mb-4">
                    <Badge variant="secondary">
                      {DOCUMENT_TYPE_LABELS?.[doc.document_type as keyof typeof DOCUMENT_TYPE_LABELS] || doc.document_type || 'Unknown'}
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-muted-foreground line-clamp-3 mb-4 flex-1">
                    {doc.original_text ? truncateText(doc.original_text, 150) : 'No content preview available.'}
                  </p>
                  
                  <div className="flex items-center justify-between text-xs text-muted-foreground pt-4 border-t mt-auto">
                    <div className="flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      {formatRelativeTime ? formatRelativeTime(doc.created_at) : new Date(doc.created_at).toLocaleDateString()}
                    </div>
                    {doc.file_size && (
                      <div>{formatFileSize ? formatFileSize(doc.file_size) : `${Math.round(doc.file_size/1024)} KB`}</div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
