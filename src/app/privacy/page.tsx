import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function PrivacyPolicyPage() {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Header />
      <main className="flex-1 container-custom py-16">
        <div className="max-w-3xl mx-auto bg-white p-8 md:p-12 rounded-2xl border border-gray-200 shadow-sm">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Privacy Policy</h1>
          <p className="text-sm text-gray-500 mb-8">Last Updated: September 2026</p>

          <div className="space-y-6 text-gray-700 text-sm leading-relaxed">
            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-2">1. Information We Collect</h2>
              <p>
                When you create an account or upload documents, we collect your email address, document contents, and metadata (such as file names and document types). This data is strictly stored within your private Supabase tenant instance.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-2">2. How We Use Artificial Intelligence</h2>
              <p>
                We use Google Gemini API to analyze, simplify, and summarize legal agreements. Document contents transmitted to the Gemini API are processed in real-time under enterprise privacy controls and are not used by Google to train public generative models.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-2">3. Data Security and Access Controls</h2>
              <p>
                All uploaded documents and chat histories are protected by PostgreSQL Row-Level Security (RLS). Only your authenticated session possesses authorization to retrieve, search, or delete your documents.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-2">4. Document Deletion & Retention</h2>
              <p>
                You retain full ownership of all data. When you delete a document from your dashboard, the source file, cached analyses, and associated vector embeddings are permanently wiped from our storage and databases.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-2">5. Contact Us</h2>
              <p>
                For questions regarding this privacy policy or to submit a data deletion request, contact us at <code>privacy@legallens.app</code>.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
