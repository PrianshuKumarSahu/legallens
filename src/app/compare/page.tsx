'use client';

import React, { useState, useEffect } from 'react';
import { 
  GitCompare, ArrowLeftRight, Loader2, AlertCircle, ChevronDown 
} from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import LegalDisclaimer from '@/components/common/LegalDisclaimer';

import { Document, ComparisonResult } from '@/types/document';
import { LEGAL_DISCLAIMER } from '@/lib/utils';

export default function ComparePage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [docAId, setDocAId] = useState<string>('');
  const [docBId, setDocBId] = useState<string>('');
  
  const [isComparing, setIsComparing] = useState(false);
  const [result, setResult] = useState<ComparisonResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        const res = await fetch('/api/documents');
        if (!res.ok) throw new Error('Failed to fetch documents');
        const data = await res.json();
        setDocuments(Array.isArray(data) ? data : data.documents || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchDocs();
  }, []);

  const handleCompare = async () => {
    if (!docAId || !docBId) return;
    setIsComparing(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch('/api/ai/compare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentAId: docAId, documentBId: docBId }),
      });
      if (!res.ok) throw new Error('Comparison failed');
      const data = await res.json();
      setResult(data.comparison);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsComparing(false);
    }
  };

  const docA = documents.find(d => d.id === docAId);
  const docB = documents.find(d => d.id === docBId);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <GitCompare className="h-8 w-8 text-blue-600" />
          Compare Documents
        </h1>
        <p className="text-muted-foreground mt-2">Select two documents to analyze their differences, similarities, and implications.</p>
      </div>

      <LegalDisclaimer text={LEGAL_DISCLAIMER} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        {/* Document A Selector */}
        <Card className="border-blue-100">
          <CardHeader className="bg-blue-50/50 pb-4">
            <CardTitle className="text-lg">Document A (Baseline)</CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-4">
            <Select value={docAId} onChange={(e) => setDocAId(e.target.value)}>
              <option value="" disabled>Select first document...</option>
              {documents.filter(d => d.id !== docBId).map(doc => (
                <option key={doc.id} value={doc.id}>{doc.title}</option>
              ))}
            </Select>
            {docA && (
              <div className="bg-slate-50 p-3 rounded text-sm text-slate-600 h-32 overflow-hidden relative">
                {(docA.original_text || '').substring(0, 300)}...
                <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-slate-50 to-transparent"></div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Document B Selector */}
        <Card className="border-purple-100">
          <CardHeader className="bg-purple-50/50 pb-4">
            <CardTitle className="text-lg">Document B (Comparison)</CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-4">
            <Select value={docBId} onChange={(e) => setDocBId(e.target.value)}>
              <option value="" disabled>Select second document...</option>
              {documents.filter(d => d.id !== docAId).map(doc => (
                <option key={doc.id} value={doc.id}>{doc.title}</option>
              ))}
            </Select>
            {docB && (
              <div className="bg-slate-50 p-3 rounded text-sm text-slate-600 h-32 overflow-hidden relative">
                {(docB.original_text || '').substring(0, 300)}...
                <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-slate-50 to-transparent"></div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-center">
        <Button 
          size="lg" 
          onClick={handleCompare} 
          disabled={!docAId || !docBId || isComparing}
          className="w-full md:w-auto min-w-[200px]"
        >
          {isComparing ? <LoadingSpinner size="sm" className="mr-2" /> : <ArrowLeftRight className="mr-2 h-5 w-5" />}
          {isComparing ? 'Comparing...' : 'Compare Documents'}
        </Button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-md flex items-center gap-2">
          <AlertCircle className="h-5 w-5" /> {error}
        </div>
      )}

      {result && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <Card>
            <CardHeader>
              <CardTitle>Comparison Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-700 leading-relaxed">{result.summary}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Key Differences</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50 text-slate-700 font-semibold border-b">
                    <tr>
                      <th className="p-4 w-1/5">Category</th>
                      <th className="p-4 w-1/4">Document A</th>
                      <th className="p-4 w-1/4">Document B</th>
                      <th className="p-4">Significance</th>
                      <th className="p-4 w-1/4">Recommendation</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {result.differences.map((diff, i) => (
                      <tr key={i} className="hover:bg-slate-50/50">
                        <td className="p-4 font-medium text-slate-800 align-top">{diff.category}</td>
                        <td className="p-4 text-slate-600 align-top bg-blue-50/30">{diff.documentA}</td>
                        <td className="p-4 text-slate-600 align-top bg-purple-50/30">{diff.documentB}</td>
                        <td className="p-4 align-top">
                          <Badge variant={diff.significance === 'critical' ? 'destructive' : diff.significance === 'important' ? 'default' : 'secondary'}>
                            {diff.significance}
                          </Badge>
                        </td>
                        <td className="p-4 text-slate-600 align-top italic">{diff.recommendation}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-blue-200">
              <CardHeader className="bg-blue-50 pb-3">
                <CardTitle className="text-base text-blue-800">Only in Document A</CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <ul className="list-disc pl-5 space-y-2 text-sm text-slate-700">
                  {result.onlyInA.map((item, i) => <li key={i}>{item}</li>)}
                </ul>
              </CardContent>
            </Card>

            <Card className="border-purple-200">
              <CardHeader className="bg-purple-50 pb-3">
                <CardTitle className="text-base text-purple-800">Only in Document B</CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <ul className="list-disc pl-5 space-y-2 text-sm text-slate-700">
                  {result.onlyInB.map((item, i) => <li key={i}>{item}</li>)}
                </ul>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-slate-800 text-white border-none">
            <CardHeader>
              <CardTitle className="text-xl">Overall Assessment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <span className="text-slate-400 text-sm uppercase tracking-wider font-semibold">Favorability</span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                  <div className="bg-slate-700/50 p-3 rounded">
                    <span className="text-xs text-blue-300 font-semibold uppercase">Document A</span>
                    <p className="text-sm mt-1">{result.favorability?.documentA}</p>
                  </div>
                  <div className="bg-slate-700/50 p-3 rounded">
                    <span className="text-xs text-purple-300 font-semibold uppercase">Document B</span>
                    <p className="text-sm mt-1">{result.favorability?.documentB}</p>
                  </div>
                </div>
              </div>
              <div className="bg-slate-700/50 p-4 rounded-lg">
                <span className="text-slate-300 text-sm font-semibold mb-2 block flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" /> Recommendation
                </span>
                <p className="text-slate-200">{result.favorability?.recommendation}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
