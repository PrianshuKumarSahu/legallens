'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  ArrowLeft, Brain, Shield, FileText, MessageSquare, Briefcase, 
  Send, Loader2, AlertTriangle, ChevronRight, Calendar, Users, 
  CheckCircle2, XCircle, AlertCircle, BookOpen 
} from 'lucide-react';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import LegalDisclaimer from '@/components/common/LegalDisclaimer';

import { RISK_COLORS, LEGAL_DISCLAIMER, DOCUMENT_TYPE_LABELS, formatDate } from '@/lib/utils';
import { Document, SummaryResult, RiskAnalysisResult, LawyerPrepResult, Message } from '@/types/document';

export default function DocumentAnalysisPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [document, setDocument] = useState<Document | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Tab States
  const [activeTab, setActiveTab] = useState('original');
  
  // Simplify State
  const [isSimplifying, setIsSimplifying] = useState(false);
  const [simplifiedText, setSimplifiedText] = useState('');
  
  // Risk State
  const [isAnalyzingRisk, setIsAnalyzingRisk] = useState(false);
  const [riskAnalysis, setRiskAnalysis] = useState<RiskAnalysisResult | null>(null);
  
  // Summary State
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [summary, setSummary] = useState<SummaryResult | null>(null);
  
  // Chat State
  const [chatMessages, setChatMessages] = useState<Message[]>([
    { id: '1', role: 'assistant', content: 'Hi! I can help you understand this document. What would you like to know?' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isChatting, setIsChatting] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  
  // Lawyer Prep State
  const [isPreparingLawyer, setIsPreparingLawyer] = useState(false);
  const [lawyerPrep, setLawyerPrep] = useState<LawyerPrepResult | null>(null);

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/documents/${id}`);
        if (!res.ok) throw new Error('Failed to fetch document');
        const data = await res.json();
        const doc = data.document || data;
        setDocument(doc);
        if (doc?.analysis?.riskAnalysis) setRiskAnalysis(doc.analysis.riskAnalysis);
        if (doc?.analysis?.summary) setSummary(doc.analysis.summary);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchDocument();
  }, [id]);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const handleSimplify = async () => {
    setIsSimplifying(true);
    setSimplifiedText('');
    try {
      const res = await fetch('/api/ai/simplify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentId: id }),
      });
      if (!res.ok) throw new Error('Failed to simplify');
      
      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      if (!reader) return;

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        setSimplifiedText(prev => prev + chunk);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSimplifying(false);
    }
  };

  const handleAnalyzeRisk = async () => {
    setIsAnalyzingRisk(true);
    try {
      const res = await fetch('/api/ai/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentId: id }),
      });
      if (!res.ok) throw new Error('Failed to analyze');
      const data = await res.json();
      setRiskAnalysis(data.result || data.riskAnalysis || data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzingRisk(false);
    }
  };

  const handleSummarize = async () => {
    setIsSummarizing(true);
    try {
      const res = await fetch('/api/ai/summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentId: id }),
      });
      if (!res.ok) throw new Error('Failed to summarize');
      const data = await res.json();
      setSummary(data.result || data.summary || data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSummarizing(false);
    }
  };

  const handleChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const newMsg: Message = { id: Date.now().toString(), role: 'user', content: chatInput };
    setChatMessages(prev => [...prev, newMsg]);
    setChatInput('');
    setIsChatting(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentId: id, messages: [...chatMessages, newMsg] }),
      });
      if (!res.ok) throw new Error('Failed to chat');
      
      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      if (!reader) return;

      const asstMsg: Message = { id: (Date.now() + 1).toString(), role: 'assistant', content: '' };
      setChatMessages(prev => [...prev, asstMsg]);

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        setChatMessages(prev => prev.map(m => m.id === asstMsg.id ? { ...m, content: m.content + chunk } : m));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsChatting(false);
    }
  };

  const handleLawyerPrep = async () => {
    setIsPreparingLawyer(true);
    try {
      const res = await fetch('/api/ai/prepare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentId: id }),
      });
      if (!res.ok) throw new Error('Failed to prepare for lawyer');
      const data = await res.json();
      setLawyerPrep(data.result || data.prep || data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsPreparingLawyer(false);
    }
  };

  if (loading) return <div className="flex h-[50vh] items-center justify-center"><LoadingSpinner /></div>;
  if (error || !document) return <div className="text-center text-red-500 py-12">Error: {error || 'Document not found'}</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.push('/dashboard')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">{document.title}</h1>
          <div className="text-muted-foreground flex items-center gap-2 text-sm mt-1">
            <Badge variant="secondary">{DOCUMENT_TYPE_LABELS[document.document_type as keyof typeof DOCUMENT_TYPE_LABELS] || document.document_type}</Badge>
            <span>•</span>
            <span>Uploaded {formatDate(document.created_at)}</span>
          </div>
        </div>
      </div>

      <LegalDisclaimer text={LEGAL_DISCLAIMER} />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full justify-start overflow-x-auto">
          <TabsTrigger value="original" className="flex gap-2 items-center"><FileText className="h-4 w-4" /> Original</TabsTrigger>
          <TabsTrigger value="simplified" className="flex gap-2 items-center"><BookOpen className="h-4 w-4" /> Simplified</TabsTrigger>
          <TabsTrigger value="risk" className="flex gap-2 items-center"><Shield className="h-4 w-4" /> Risk Analysis</TabsTrigger>
          <TabsTrigger value="summary" className="flex gap-2 items-center"><Brain className="h-4 w-4" /> Summary</TabsTrigger>
          <TabsTrigger value="chat" className="flex gap-2 items-center"><MessageSquare className="h-4 w-4" /> Chat Q&A</TabsTrigger>
          <TabsTrigger value="lawyer" className="flex gap-2 items-center"><Briefcase className="h-4 w-4" /> Lawyer Prep</TabsTrigger>
        </TabsList>

        <Card className="mt-6">
          <CardContent className="p-6 h-[600px] overflow-hidden flex flex-col">
            
            {/* ORIGINAL TAB */}
            <TabsContent value="original" className="h-full m-0">
              <ScrollArea className="h-full w-full rounded-md border p-4 bg-slate-50">
                <pre className="text-sm whitespace-pre-wrap font-mono text-slate-800">{document.original_text}</pre>
              </ScrollArea>
            </TabsContent>

            {/* SIMPLIFIED TAB */}
            <TabsContent value="simplified" className="h-full m-0 flex flex-col">
              {!simplifiedText && !isSimplifying ? (
                <div className="flex-1 flex flex-col items-center justify-center space-y-4">
                  <BookOpen className="h-12 w-12 text-slate-300" />
                  <p className="text-slate-500">Generate a plain-english version of this document.</p>
                  <Button onClick={handleSimplify}>Simplify Document</Button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4 h-full">
                  <ScrollArea className="h-full rounded-md border p-4 bg-slate-50">
                    <h3 className="font-semibold mb-4 text-slate-700 sticky top-0 bg-slate-50 pb-2">Original Text</h3>
                    <pre className="text-sm whitespace-pre-wrap font-mono text-slate-600">{document.content}</pre>
                  </ScrollArea>
                  <ScrollArea className="h-full rounded-md border p-4 bg-blue-50">
                    <h3 className="font-semibold mb-4 text-blue-800 sticky top-0 bg-blue-50 pb-2">Simplified Text</h3>
                    <div className="text-sm whitespace-pre-wrap text-slate-800">
                      {simplifiedText}
                      {isSimplifying && <span className="animate-pulse">...</span>}
                    </div>
                  </ScrollArea>
                </div>
              )}
            </TabsContent>

            {/* RISK ANALYSIS TAB */}
            <TabsContent value="risk" className="h-full m-0 flex flex-col">
              {!riskAnalysis && !isAnalyzingRisk ? (
                <div className="flex-1 flex flex-col items-center justify-center space-y-4">
                  <Shield className="h-12 w-12 text-slate-300" />
                  <p className="text-slate-500">Scan document for potential risks and red flags.</p>
                  <Button onClick={handleAnalyzeRisk}>Analyze Risks</Button>
                </div>
              ) : isAnalyzingRisk ? (
                <div className="flex-1 flex items-center justify-center"><LoadingSpinner text="Analyzing risks..." /></div>
              ) : riskAnalysis ? (
                <ScrollArea className="h-full pr-4">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border">
                      <div>
                        <h3 className="text-lg font-semibold">Overall Risk Score</h3>
                        <p className="text-sm text-muted-foreground">Based on AI analysis</p>
                      </div>
                      <div className={`text-3xl font-bold ${RISK_COLORS[(riskAnalysis.riskScore ?? 5) > 7 ? 'high' : (riskAnalysis.riskScore ?? 5) > 4 ? 'medium' : 'low'].text}`}>
                        {riskAnalysis.riskScore ?? 'N/A'}/10
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2"><AlertTriangle className="h-5 w-5 text-red-500" /> Key Risks Identified</h3>
                      <div className="space-y-3">
                        {riskAnalysis.risks?.map((risk, i) => (
                          <Card key={i} className={`border-l-4 ${RISK_COLORS[risk.riskLevel || 'medium'].border}`}>
                            <CardContent className="p-4 flex gap-4">
                              <AlertCircle className={`h-5 w-5 flex-shrink-0 ${RISK_COLORS[risk.riskLevel || 'medium'].text}`} />
                              <div>
                                <h4 className="font-semibold text-slate-800">{risk.clause}</h4>
                                <p className="text-sm text-slate-600 mt-1">{risk.explanation}</p>
                                {risk.recommendation && (
                                  <p className="text-xs text-indigo-700 mt-2 font-medium">💡 Recommendation: {risk.recommendation}</p>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2"><CheckCircle2 className="h-5 w-5 text-blue-500" /> Key Obligations</h3>
                      <ul className="space-y-2">
                        {riskAnalysis.obligations?.map((obs, i) => (
                          <li key={i} className="flex gap-2 items-start text-sm p-3 bg-slate-50 rounded border">
                            <ChevronRight className="h-4 w-4 mt-0.5 text-blue-500 flex-shrink-0" />
                            <div className="flex-1">
                              <span className="font-medium text-slate-800">{typeof obs === 'string' ? obs : obs.description}</span>
                              {typeof obs !== 'string' && obs.party && (
                                <span className="text-xs bg-slate-200 text-slate-700 px-2 py-0.5 rounded ml-2 font-semibold">{obs.party}</span>
                              )}
                              {typeof obs !== 'string' && obs.deadline && (
                                <span className="text-xs text-amber-700 ml-2 font-semibold">📅 Deadline: {obs.deadline}</span>
                              )}
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </ScrollArea>
              ) : null}
            </TabsContent>

            {/* SUMMARY TAB */}
            <TabsContent value="summary" className="h-full m-0 flex flex-col">
              {!summary && !isSummarizing ? (
                <div className="flex-1 flex flex-col items-center justify-center space-y-4">
                  <Brain className="h-12 w-12 text-slate-300" />
                  <p className="text-slate-500">Extract key points, dates, and parties.</p>
                  <Button onClick={handleSummarize}>Generate Summary</Button>
                </div>
              ) : isSummarizing ? (
                <div className="flex-1 flex items-center justify-center"><LoadingSpinner text="Summarizing..." /></div>
              ) : summary ? (
                <ScrollArea className="h-full pr-4">
                  <div className="space-y-8">
                    <section>
                      <h3 className="text-xl font-bold mb-2">Executive Summary</h3>
                      <p className="text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-lg border">{summary.executiveSummary}</p>
                    </section>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <section>
                        <h4 className="font-semibold text-lg flex items-center gap-2 mb-3"><Users className="h-5 w-5 text-blue-500" /> Parties Involved</h4>
                        <ul className="space-y-2 border rounded-lg p-4 bg-white">
                          {(summary.parties || []).map((p: any, i: number) => (
                            <li key={i} className="flex flex-col">
                              <span className="font-medium text-slate-800">{typeof p === 'string' ? p : p.name}</span>
                              {typeof p !== 'string' && p.role && <span className="text-xs text-slate-500">{p.role}</span>}
                            </li>
                          ))}
                        </ul>
                      </section>
                      
                      <section>
                        <h4 className="font-semibold text-lg flex items-center gap-2 mb-3"><Calendar className="h-5 w-5 text-purple-500" /> Key Dates</h4>
                        <ul className="space-y-2 border rounded-lg p-4 bg-white">
                          {(summary.keyDates || (summary as any).dates || []).map((d: any, i: number) => (
                            <li key={i} className="flex justify-between items-center text-sm border-b last:border-0 pb-2 last:pb-0">
                              <span className="text-slate-700">{d.description || d.event}</span>
                              <Badge variant="outline">{d.date}</Badge>
                            </li>
                          ))}
                        </ul>
                      </section>
                    </div>

                    <section>
                      <h4 className="font-semibold text-lg flex items-center gap-2 mb-3"><FileText className="h-5 w-5 text-green-500" /> Key Provisions</h4>
                      <ul className="space-y-2">
                        {summary.keyPoints.map((point, i) => (
                          <li key={i} className="flex gap-2 items-start p-3 bg-slate-50 rounded border">
                            <CheckCircle2 className="h-4 w-4 mt-0.5 text-green-500 flex-shrink-0" />
                            <span className="text-sm text-slate-700">{point}</span>
                          </li>
                        ))}
                      </ul>
                    </section>
                  </div>
                </ScrollArea>
              ) : null}
            </TabsContent>

            {/* CHAT TAB */}
            <TabsContent value="chat" className="h-full m-0 flex flex-col">
              <ScrollArea ref={scrollAreaRef} className="flex-1 pr-4 mb-4">
                <div className="space-y-4">
                  {chatMessages.map(msg => (
                    <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-slate-100 text-slate-800 rounded-bl-none border'}`}>
                        <p className="whitespace-pre-wrap">{msg.content}</p>
                      </div>
                    </div>
                  ))}
                  {isChatting && chatMessages[chatMessages.length - 1].role === 'user' && (
                    <div className="flex justify-start">
                      <div className="bg-slate-100 border rounded-2xl rounded-bl-none px-4 py-3 flex items-center gap-2">
                        <span className="animate-pulse h-2 w-2 bg-slate-400 rounded-full"></span>
                        <span className="animate-pulse h-2 w-2 bg-slate-400 rounded-full animation-delay-200"></span>
                        <span className="animate-pulse h-2 w-2 bg-slate-400 rounded-full animation-delay-400"></span>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>
              <form onSubmit={handleChat} className="flex gap-2 mt-auto">
                <Input 
                  placeholder="Ask a question about this document..." 
                  value={chatInput} 
                  onChange={e => setChatInput(e.target.value)}
                  disabled={isChatting}
                />
                <Button type="submit" disabled={isChatting || !chatInput.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </TabsContent>

            {/* LAWYER PREP TAB */}
            <TabsContent value="lawyer" className="h-full m-0 flex flex-col">
              {!lawyerPrep && !isPreparingLawyer ? (
                <div className="flex-1 flex flex-col items-center justify-center space-y-4">
                  <Briefcase className="h-12 w-12 text-slate-300" />
                  <p className="text-slate-500 text-center max-w-md">Generate a targeted list of questions and concerns to discuss with your actual attorney to save billable hours.</p>
                  <Button onClick={handleLawyerPrep}>Prepare for Lawyer</Button>
                </div>
              ) : isPreparingLawyer ? (
                <div className="flex-1 flex items-center justify-center"><LoadingSpinner text="Compiling preparation guide..." /></div>
              ) : lawyerPrep ? (
                <ScrollArea className="h-full pr-4">
                  <div className="space-y-8">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h3 className="font-semibold text-blue-900 flex items-center gap-2 mb-2"><Briefcase className="h-5 w-5" /> Attorney Consultation Guide</h3>
                      <p className="text-sm text-blue-800">Print or share this guide with your attorney to make your consultation more efficient.</p>
                    </div>

                    <section>
                      <h4 className="text-lg font-semibold mb-3 border-b pb-2">Questions to Ask Your Lawyer</h4>
                      <ul className="space-y-3">
                        {(lawyerPrep.questionsToAsk || (lawyerPrep as any).questions || []).map((q: string, i: number) => (
                          <li key={i} className="flex gap-3 items-start bg-slate-50 p-3 rounded">
                            <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded flex-shrink-0">Q{i+1}</span>
                            <span className="text-slate-700 text-sm">{q}</span>
                          </li>
                        ))}
                      </ul>
                    </section>

                    <section>
                      <h4 className="text-lg font-semibold mb-3 border-b pb-2">Areas Requiring Legal Review</h4>
                      <div className="grid gap-3">
                        {(lawyerPrep.areasNeedingReview || (lawyerPrep as any).areas || []).map((area: any, i: number) => (
                          <Card key={i}>
                            <CardContent className="p-4 flex gap-3 items-center">
                              <AlertCircle className="h-5 w-5 text-amber-500 flex-shrink-0" />
                              <div>
                                <span className="text-sm font-medium text-slate-800">{typeof area === 'string' ? area : area.area}</span>
                                {typeof area !== 'string' && area.reason && (
                                  <p className="text-xs text-slate-500 mt-1">{area.reason}</p>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </section>
                    
                    <section>
                      <h4 className="text-lg font-semibold mb-3 border-b pb-2">Documents to Gather Before Meeting</h4>
                      <ul className="list-disc pl-5 space-y-1">
                        {(lawyerPrep.documentsToGather || (lawyerPrep as any).docs || []).map((doc: string, i: number) => (
                          <li key={i} className="text-sm text-slate-600">{doc}</li>
                        ))}
                      </ul>
                    </section>
                  </div>
                </ScrollArea>
              ) : null}
            </TabsContent>
          </CardContent>
        </Card>
      </Tabs>
    </div>
  );
}
