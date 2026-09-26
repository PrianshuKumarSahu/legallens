import Link from "next/link";
import {
  Scale,
  FileText,
  Shield,
  MessageSquare,
  GitCompare,
  CheckSquare,
  Zap,
  Globe,
  ArrowRight,
  Star,
} from "lucide-react";
import DemoLoginButton from "@/components/common/DemoLoginButton";
import Footer from "@/components/layout/Footer";

const features = [
  {
    icon: FileText,
    title: "Document Simplification",
    description:
      "Transform complex legal jargon into plain, easy-to-understand English with AI-powered analysis.",
    color: "bg-blue-100 text-blue-600",
  },
  {
    icon: Shield,
    title: "Risk Analysis",
    description:
      "Identify potential risks, obligations, and red flags in your contracts with color-coded severity levels.",
    color: "bg-red-100 text-red-600",
  },
  {
    icon: MessageSquare,
    title: "Document Q&A",
    description:
      "Ask questions about your legal documents and get instant, context-aware answers powered by AI.",
    color: "bg-green-100 text-green-600",
  },
  {
    icon: GitCompare,
    title: "Contract Comparison",
    description:
      "Compare two contracts side-by-side and identify differences, conflicts, and missing clauses.",
    color: "bg-purple-100 text-purple-600",
  },
  {
    icon: CheckSquare,
    title: "Summary & Checklists",
    description:
      "Generate executive summaries, key dates, action items, and checklists from any legal document.",
    color: "bg-orange-100 text-orange-600",
  },
  {
    icon: Globe,
    title: "Multi-Language Support",
    description:
      "Translate simplified legal documents into 20+ languages for broader accessibility.",
    color: "bg-teal-100 text-teal-600",
  },
];

const steps = [
  {
    step: "01",
    title: "Upload Your Document",
    description: "Upload a PDF, DOCX, or paste your legal text directly.",
  },
  {
    step: "02",
    title: "AI Analyzes It",
    description:
      "Google Gemini AI processes and understands your document in seconds.",
  },
  {
    step: "03",
    title: "Get Clear Insights",
    description:
      "Receive simplified text, risk analysis, summaries, and actionable advice.",
  },
];

export default function LandingPage() {
  return (
    <main className="min-h-screen">
      {/* Skip to content - Accessibility */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      {/* Hero Section */}
      <section className="gradient-bg relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: "radial-gradient(circle at 25% 50%, white 1px, transparent 1px), radial-gradient(circle at 75% 50%, white 1px, transparent 1px)",
            backgroundSize: "60px 60px"
          }} />
        </div>

        <nav className="relative z-10 container-custom flex items-center justify-between py-6" aria-label="Main navigation">
          <div className="flex items-center gap-2">
            <Scale className="h-8 w-8 text-indigo-300" aria-hidden="true" />
            <span className="text-2xl font-bold text-white">LegalLens</span>
          </div>
          <div className="flex items-center gap-3">
            <DemoLoginButton variant="nav" label="⚡ Judge / Demo Access" />
            <Link
              href="/login"
              className="text-indigo-200 transition-colors hover:text-white text-sm"
            >
              Log In
            </Link>
            <Link
              href="/signup"
              className="rounded-lg bg-white px-4 py-2 font-semibold text-indigo-600 shadow-md transition-all hover:bg-indigo-50 text-sm hidden sm:inline-block"
            >
              Get Started
            </Link>
          </div>
        </nav>

        <div className="relative z-10 container-custom pb-24 pt-16 text-center" id="main-content">
          <div className="mx-auto max-w-4xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-indigo-500/20 px-4 py-2 text-sm text-indigo-200">
              <Zap className="h-4 w-4" aria-hidden="true" />
              Powered by Google Gemini AI
            </div>
            <h1 className="mb-6 text-5xl font-extrabold leading-tight tracking-tight text-white md:text-6xl lg:text-7xl">
              Legal Documents,{" "}
              <span className="text-indigo-300">Made Simple</span>
            </h1>
            <p className="mb-10 text-xl text-indigo-200 md:text-2xl">
              Upload any legal document and get instant AI-powered
              simplification, risk analysis, contract comparison, and
              actionable insights — all in plain English.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <DemoLoginButton className="w-full sm:w-auto" label="⚡ Instant Demo Access (For Judges)" />
              <Link
                href="/signup"
                className="group flex items-center justify-center gap-2 rounded-xl bg-white px-8 py-3.5 text-base font-bold text-indigo-600 shadow-xl transition-all hover:bg-indigo-50 hover:shadow-2xl w-full sm:w-auto"
              >
                Sign Up Free
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </Link>
              <Link
                href="#features"
                className="flex items-center justify-center gap-2 rounded-xl border-2 border-indigo-400/30 px-6 py-3.5 text-base font-semibold text-white transition-all hover:border-white/50 hover:bg-white/10 w-full sm:w-auto"
              >
                See Features
              </Link>
            </div>

            {/* Trust bar */}
            <div className="mt-16 flex flex-wrap items-center justify-center gap-6 text-sm text-indigo-300">
              <div className="flex items-center gap-1">
                <Shield className="h-4 w-4" aria-hidden="true" />
                Enterprise-grade Security
              </div>
              <div className="h-4 w-px bg-indigo-500/30" />
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4" aria-hidden="true" />
                AI-Powered Analysis
              </div>
              <div className="h-4 w-px bg-indigo-500/30" />
              <div className="flex items-center gap-1">
                <Globe className="h-4 w-4" aria-hidden="true" />
                20+ Languages
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24" aria-labelledby="features-heading">
        <div className="container-custom">
          <div className="mb-16 text-center">
            <h2 id="features-heading" className="mb-4 text-4xl font-bold text-gray-900">
              Everything You Need to Understand Legal Documents
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-gray-600">
              From simplification to risk analysis, LegalLens provides
              comprehensive tools to make legal documents accessible.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group rounded-2xl border border-gray-100 bg-white p-8 shadow-sm transition-all hover:border-indigo-100 hover:shadow-lg"
              >
                <div
                  className={`mb-4 inline-flex rounded-xl p-3 ${feature.color}`}
                >
                  <feature.icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <h3 className="mb-2 text-xl font-bold text-gray-900">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-gray-100 py-24" aria-labelledby="how-it-works-heading">
        <div className="container-custom">
          <div className="mb-16 text-center">
            <h2 id="how-it-works-heading" className="mb-4 text-4xl font-bold text-gray-900">
              How It Works
            </h2>
            <p className="text-lg text-gray-600">
              Three simple steps to understand any legal document
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {steps.map((item) => (
              <div key={item.step} className="text-center">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-600 text-2xl font-bold text-white shadow-lg">
                  {item.step}
                </div>
                <h3 className="mb-2 text-xl font-bold text-gray-900">
                  {item.title}
                </h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="gradient-bg py-24" aria-labelledby="cta-heading">
        <div className="container-custom text-center">
          <h2 id="cta-heading" className="mb-6 text-4xl font-bold text-white">
            Ready to Simplify Legal Documents?
          </h2>
          <p className="mx-auto mb-10 max-w-2xl text-xl text-indigo-200">
            Join thousands of users who trust LegalLens to make legal
            information accessible and understandable.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 rounded-xl bg-white px-10 py-4 text-lg font-bold text-indigo-600 shadow-xl transition-all hover:bg-indigo-50 hover:shadow-2xl"
          >
            Get Started Free
            <ArrowRight className="h-5 w-5" aria-hidden="true" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </main>
  );
}
