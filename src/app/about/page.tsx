import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Scale, Heart, Users, Target, BookOpen } from "lucide-react";
import DemoLoginButton from "@/components/common/DemoLoginButton";

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Header />
      <main className="flex-1 container-custom py-16">
        <div className="mx-auto max-w-3xl text-center mb-16">
          <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 border border-indigo-200 px-4 py-1.5 text-xs font-semibold text-indigo-700 mb-4">
            <Scale className="h-3.5 w-3.5" />
            Our Mission & Story
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">
            Democratizing Legal Understanding
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Legal contracts govern our employment, software, housing, and partnerships—yet most people sign them without understanding what they say.
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-12">
          <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
              <Target className="h-6 w-6 text-indigo-600" />
              The Problem We Are Solving
            </h2>
            <p className="text-gray-600 leading-relaxed text-base">
              Hiring an attorney for simple document review often costs upwards of \$350–\$600 an hour. As a result, freelancers, small business owners, tenants, and consumers are forced to take uncalculated risks on unread agreements.
            </p>
            <p className="mt-4 text-gray-600 leading-relaxed text-base">
              <strong>LegalLens</strong> bridges this critical gap. Powered by Google Gemini AI, LegalLens doesn’t replace licensed attorneys—it empowers everyday people to navigate agreements, pinpoint hidden liabilities, and prepare targeted questions for consultations.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 mb-4">
                <BookOpen className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Plain-English Translations</h3>
              <p className="text-sm text-gray-600">
                Complex covenants and indemnification clauses broken down into transparent, bite-sized summaries.
              </p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 mb-4">
                <Heart className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Ethical AI Standards</h3>
              <p className="text-sm text-gray-600">
                Clear disclaimers, objective risk assessments, and zero hallucinations with verified text extraction.
              </p>
            </div>
          </div>

          <div className="rounded-2xl bg-indigo-900 text-white p-8 text-center shadow-lg">
            <h3 className="text-2xl font-bold mb-3">Experience LegalLens in Action</h3>
            <p className="text-indigo-200 text-sm max-w-lg mx-auto mb-6">
              Test out our document simplification, risk evaluation, and contract comparison features right now without signing up.
            </p>
            <div className="flex justify-center">
              <DemoLoginButton label="⚡ Instant Demo Access (For Judges)" />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
