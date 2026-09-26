import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Check, Sparkles, Scale, ArrowRight } from "lucide-react";
import DemoLoginButton from "@/components/common/DemoLoginButton";

export default function PricingPage() {
  const tiers = [
    {
      name: "Hackathon Free / Community",
      price: "$0",
      description: "Everything you need to analyze, simplify, and compare legal documents with Google Gemini AI.",
      features: [
        "Google Gemini 2.0 Flash AI processing",
        "Document simplification (Plain English)",
        "Automated risk scoring & clause detection",
        "Interactive document Q&A chatbot",
        "Side-by-side contract comparison",
        "Attorney consultation preparation guides",
        "Upload PDF, DOCX, and TXT up to 20MB",
        "Supabase pgvector semantic search",
      ],
      cta: "Get Started Free",
      href: "/signup",
      highlight: true,
    },
    {
      name: "Professional",
      price: "$29",
      period: "/month",
      description: "For legal professionals, consultants, and growing startups needing bulk analysis and custom models.",
      features: [
        "Everything in Free Tier",
        "Priority Gemini 2.0 Pro model routing",
        "Unlimited document storage",
        "Batch contract comparison (up to 10 docs)",
        "Custom risk policy guidelines",
        "Export to Word, PDF, and Markdown with audit logs",
        "API access for automated intake",
      ],
      cta: "Explore Pro (Demo)",
      href: "/signup",
      highlight: false,
    },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Header />
      <main className="flex-1 container-custom py-16">
        <div className="mx-auto max-w-3xl text-center mb-16">
          <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 border border-indigo-200 px-4 py-1.5 text-xs font-semibold text-indigo-700 mb-4">
            <Sparkles className="h-3.5 w-3.5" />
            100% Free & Open For Hackathon Evaluation
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">
            Transparent, Accessible Pricing
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            LegalLens is designed to democratize legal information. All core AI features are free during the hackathon evaluation.
          </p>
          <div className="mt-6 flex justify-center">
            <DemoLoginButton label="⚡ Instant Demo Access (For Judges)" />
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-2 max-w-4xl mx-auto">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`rounded-2xl bg-white p-8 shadow-sm border transition-all ${
                tier.highlight
                  ? "border-indigo-600 ring-2 ring-indigo-600/20 shadow-md relative"
                  : "border-gray-200"
              }`}
            >
              {tier.highlight && (
                <span className="absolute -top-3 left-8 rounded-full bg-indigo-600 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white shadow">
                  Current Free Tier
                </span>
              )}
              <h2 className="text-2xl font-bold text-gray-900">{tier.name}</h2>
              <p className="mt-2 text-sm text-gray-500">{tier.description}</p>
              <div className="mt-6 flex items-baseline">
                <span className="text-5xl font-extrabold text-gray-900">{tier.price}</span>
                {tier.period && <span className="ml-1 text-sm text-gray-500">{tier.period}</span>}
              </div>

              <ul className="mt-8 space-y-4 text-sm text-gray-600">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-indigo-600 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-8">
                <Link
                  href={tier.href}
                  className={`flex w-full items-center justify-center gap-2 rounded-xl py-3 px-4 font-semibold text-center transition-all ${
                    tier.highlight
                      ? "bg-indigo-600 text-white hover:bg-indigo-700 shadow-md"
                      : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                  }`}
                >
                  {tier.cta}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
