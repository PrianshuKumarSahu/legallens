import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { FileText, Shield, MessageSquare, GitCompare, Briefcase, Zap, ArrowRight } from "lucide-react";
import DemoLoginButton from "@/components/common/DemoLoginButton";

export default function FeaturesPage() {
  const allFeatures = [
    {
      icon: FileText,
      title: "Plain-English Simplification",
      description: "Transforms convoluted legalese, Latin maxims, and dense paragraphs into clear, conversational English while preserving all legal intent.",
      badge: "Real-time AI Stream",
    },
    {
      icon: Shield,
      title: "Automated Risk Analysis & Scoring",
      description: "Calculates an objective 1–10 risk score and flags unilateral indemnity, non-competes, hidden auto-renewals, and non-disclosure obligations.",
      badge: "Severity Badges",
    },
    {
      icon: GitCompare,
      title: "Side-by-Side Contract Comparison",
      description: "Upload two versions of an agreement (e.g., standard vs counter-proposal). LegalLens highlights key differences and ranks favorability.",
      badge: "Diff Matrix",
    },
    {
      icon: MessageSquare,
      title: "Interactive Document Q&A Chatbot",
      description: "Ask questions like 'What happens if I terminate early?' or 'Who pays for legal fees?' and get instant, cited answers from your document.",
      badge: "Context Aware",
    },
    {
      icon: Briefcase,
      title: "Attorney Consultation Guide",
      description: "Auto-generates high-leverage questions to ask your actual lawyer, highlighting areas where customized human legal advice is essential.",
      badge: "Save Billable Hours",
    },
    {
      icon: Zap,
      title: "Executive Summaries & Timelines",
      description: "Pulls out parties involved, effective dates, renewal deadlines, and obligations checklists into an actionable dashboard.",
      badge: "Action Checklists",
    },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Header />
      <main className="flex-1 container-custom py-16">
        <div className="mx-auto max-w-3xl text-center mb-16">
          <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 border border-indigo-200 px-4 py-1.5 text-xs font-semibold text-indigo-700 mb-4">
            <Zap className="h-3.5 w-3.5" />
            AI-Powered Legal Assistant Suite
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">
            Everything You Need to Understand Legal Contracts
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Powered by Google Gemini 2.0 Flash AI and Supabase pgvector semantic search.
          </p>
          <div className="mt-6 flex justify-center">
            <DemoLoginButton label="⚡ Try All Features with Demo Account" />
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
          {allFeatures.map((f) => {
            const Icon = f.icon;
            return (
              <div key={f.title} className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm hover:shadow-md transition-shadow flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-100">
                    {f.badge}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed flex-1">{f.description}</p>
                <div className="mt-6 pt-4 border-t">
                  <Link
                    href="/dashboard"
                    className="inline-flex items-center text-sm font-semibold text-indigo-600 hover:text-indigo-800"
                  >
                    Open in Dashboard <ArrowRight className="h-4 w-4 ml-1" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </main>
      <Footer />
    </div>
  );
}
