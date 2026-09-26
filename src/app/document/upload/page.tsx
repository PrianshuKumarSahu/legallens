'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, ClipboardPaste, Loader2, AlertCircle, X } from 'lucide-react';
import { formatFileSize, isValidFileType, MAX_FILE_SIZE, DOCUMENT_TYPE_LABELS } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function UploadPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // File upload state
  const [file, setFile] = useState<File | null>(null);
  
  // Text paste state
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [docType, setDocType] = useState('contract');

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setError(null);
    if (acceptedFiles.length > 0) {
      const selected = acceptedFiles[0];
      if (selected.size > (MAX_FILE_SIZE || 20 * 1024 * 1024)) {
        setError('File size exceeds 20MB limit');
        return;
      }
      setFile(selected);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt']
    },
    maxFiles: 1
  });

  const handleFileUpload = async () => {
    if (!file) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const formData = new FormData();
      formData.append('file', file);
      
      const res = await fetch('/api/documents/upload', {
        method: 'POST',
        body: formData,
      });
      
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Upload failed');
      }
      
      const data = await res.json();
      router.push(`/document/${data.id || data.document?.id}`);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleTextUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !text.trim()) {
      setError('Title and content are required');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const res = await fetch('/api/documents/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          text,
          document_type: docType
        }),
      });
      
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Upload failed');
      }
      
      const data = await res.json();
      router.push(`/document/${data.id || data.document?.id}`);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Upload Document</h1>
        <p className="text-muted-foreground">Upload a file or paste text to analyze legal documents.</p>
      </div>

      {error && (
        <div className="bg-destructive/15 text-destructive p-4 rounded-md flex items-center">
          <AlertCircle className="w-5 h-5 mr-2" />
          {error}
        </div>
      )}

      <Tabs defaultValue="file" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="file">
            <Upload className="w-4 h-4 mr-2" />
            Upload File
          </TabsTrigger>
          <TabsTrigger value="paste">
            <ClipboardPaste className="w-4 h-4 mr-2" />
            Paste Text
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="file" className="mt-6">
          <Card>
            <CardContent className="pt-6">
              {!file ? (
                <div 
                  {...getRootProps()} 
                  className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${
                    isDragActive ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50 hover:bg-muted/50'
                  }`}
                >
                  <input {...getInputProps()} />
                  <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">
                    {isDragActive ? 'Drop the file here' : 'Drag & drop a file here, or click to select'}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Supports .pdf, .docx, .txt up to 20MB
                  </p>
                  <Button variant="outline" type="button">Select File</Button>
                </div>
              ) : (
                <div className="border rounded-lg p-6 flex flex-col items-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <FileText className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="font-medium text-lg text-center mb-1">{file.name}</h3>
                  <p className="text-sm text-muted-foreground mb-6">
                    {formatFileSize ? formatFileSize(file.size) : `${Math.round(file.size/1024)} KB`}
                  </p>
                  
                  <div className="flex gap-4">
                    <Button variant="outline" onClick={() => setFile(null)} disabled={loading}>
                      <X className="w-4 h-4 mr-2" />
                      Remove
                    </Button>
                    <Button onClick={handleFileUpload} disabled={loading}>
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Upload className="w-4 h-4 mr-2" />
                          Upload File
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="paste" className="mt-6">
          <Card>
            <CardContent className="pt-6">
              <form onSubmit={handleTextUpload} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="title" className="text-sm font-medium">Document Title</label>
                  <input
                    id="title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Non-Disclosure Agreement 2024"
                    className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="docType" className="text-sm font-medium">Document Type</label>
                  <select
                    id="docType"
                    value={docType}
                    onChange={(e) => setDocType(e.target.value)}
                    className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                  >
                    {Object.entries(DOCUMENT_TYPE_LABELS || {
                      contract: 'Contract',
                      nda: 'NDA',
                      tos: 'Terms of Service',
                      privacy_policy: 'Privacy Policy',
                      other: 'Other'
                    }).map(([key, label]) => (
                      <option key={key} value={key}>{String(label)}</option>
                    ))}
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="text" className="text-sm font-medium">Legal Text</label>
                  <textarea
                    id="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Paste your legal document text here..."
                    className="w-full p-3 border rounded-md h-64 focus:outline-none focus:ring-2 focus:ring-primary resize-y"
                    required
                  />
                </div>
                
                <div className="flex justify-end">
                  <Button type="submit" disabled={loading || !title.trim() || !text.trim()}>
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <FileText className="w-4 h-4 mr-2" />
                        Analyze Document
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
