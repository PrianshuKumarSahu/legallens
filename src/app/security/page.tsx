import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Shield, Lock, EyeOff, Server, Database, CheckCircle } from "lucide-react";
import DemoLoginButton from "@/components/common/DemoLoginButton";

export default function SecurityPage() {
  const securityPillars = [
    {
      icon: Lock,
      title: "Row-Level Security (RLS)",
      description:
        "Every single database table in Supabase enforces strict PostgreSQL Row-Level Security. Users and organizations can only access their own uploaded documents and generated insights.",
    },
    {
      icon: EyeOff,
      title: "Zero Model Training on User Data",
      description:
        "LegalLens utilizes Google Gemini API Enterprise endpoints where client prompts and uploaded legal agreements are never used to train public foundational AI models.",
    },
    {
      icon: Server,
      title: "In-Transit & At-Rest Encryption",
      description:
        "All file uploads, text parsing streams, and vector similarity queries are encrypted via TLS 1.3 in transit and AES-256 at rest within Supabase Storage and database clusters.",
    },
    {
      icon: Database,
      title: "Vector Data Isolation",
      description:
        "Document chunks embedded with Gemini text-embedding-004 are indexed using pgvector with strict tenant foreign keys, ensuring queries only match chunks owned by the verified session.",
    },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Header />
      <main className="flex-1 container-custom py-16">
        <div className="mx-auto max-w-3xl text-center mb-16">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 border border-blue-200 px-4 py-1.5 text-xs font-semibold text-blue-700 mb-4">
            <Shield className="h-3.5 w-3.5" />
            Security & Data Protection Architecture
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">
            Enterprise-Grade Confidentiality
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Legal documents contain your most sensitive covenants, finances, and intellectual property. Here is how LegalLens keeps your data safe.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 max-w-4xl mx-auto mb-16">
          {securityPillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div key={pillar.title} className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 mb-5">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{pillar.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{pillar.description}</p>
              </div>
            );
          })}
        </div>

        <div className="max-w-4xl mx-auto bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            Security Checklist & Standards
          </h3>
          <ul className="space-y-3 text-sm text-gray-600">
            <li className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-green-500" />
              Environment variables and API secrets are never exposed on client browsers.
            </li>
            <li className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-green-500" />
              Automated SHA-256 content hashing to verify integrity and prevent duplicate reprocessing.
            </li>
            <li className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-green-500" />
              Configurable document deletion removes files from Supabase storage and vector chunks simultaneously.
            </li>
          </ul>

          <div className="mt-8 pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-sm text-gray-500">Want to test the platform safely?</span>
            <DemoLoginButton variant="primary" label="⚡ Test with Demo Account" />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
