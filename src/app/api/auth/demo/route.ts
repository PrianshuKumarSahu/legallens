import { NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

const DEMO_EMAIL = 'judge.demo@legallens.app';
const DEMO_PASSWORD = 'LegalLensJudgeDemo2026!';

const SAMPLE_NDA_TEXT = `MUTUAL NON-DISCLOSURE AGREEMENT

This Mutual Non-Disclosure Agreement ("Agreement") is entered into as of January 15, 2026 ("Effective Date"), by and between Acme Innovations Inc., a Delaware corporation ("Party A"), and Vertex Tech Solutions LLC, a California limited liability company ("Party B").

1. Purpose. The parties wish to explore a potential business relationship in connection with collaborative artificial intelligence development and confidential data processing ("Purpose").

2. Confidential Information. "Confidential Information" refers to any proprietary information, technical data, trade secrets, source code, financial projections, or business plans disclosed by either party to the other, whether orally or in writing.

3. Obligations of Receiving Party.
   (a) The Receiving Party agrees to hold Confidential Information in strict confidence and take all reasonable precautions to prevent unauthorized disclosure.
   (b) The Receiving Party shall not use Confidential Information for any purpose outside the scope of the Purpose.
   (c) The Receiving Party shall limit dissemination of Confidential Information strictly to employees and contractors with a need to know.

4. Exclusions. Confidential Information does not include information that: (i) is or becomes publicly known through no breach of this Agreement; (ii) was already known prior to disclosure; (iii) is independently developed without reference to the Disclosing Party's Confidential Information.

5. Term and Termination. This Agreement shall remain in effect for a period of two (2) years from the Effective Date. Either party may terminate discussions at any time with thirty (30) days written notice. Obligations of confidentiality shall survive termination for an additional period of five (5) years.

6. Non-Compete and Non-Solicitation. During the term of this Agreement and for twelve (12) months thereafter, neither party shall solicit for employment any employee or contractor of the other party who was directly involved in discussions under this Agreement.

7. Governing Law and Dispute Resolution. This Agreement shall be governed by and construed in accordance with the laws of the State of Delaware, without giving effect to conflict of laws principles. Any legal suit or proceeding shall be instituted exclusively in the state or federal courts located in New Castle County, Delaware.

8. Injunctive Relief and Limitation of Liability. The parties acknowledge that unauthorized disclosure of Confidential Information will cause irreparable harm for which monetary damages alone would be inadequate. Disclosing Party shall be entitled to seek injunctive relief without posting a bond. In no event shall either party's aggregate liability exceed $500,000 USD.`;

const SAMPLE_SAAS_TEXT = `MASTER SERVICES & CLOUD SOFTWARE AGREEMENT

This Master Services Agreement ("Agreement") is made between CloudScale Systems Inc. ("Provider") and Enterprise Client Corp. ("Customer").

1. Cloud Services. Provider grants Customer a non-exclusive, worldwide, subscription-based license to access and use the CloudScale Enterprise Analytics Platform during the Subscription Term.

2. Service Level Agreement (SLA). Provider guarantees 99.9% monthly uptime. If Provider fails to meet the SLA, Customer's sole and exclusive remedy shall be service credits equal to 5% of monthly fees for every 1% of downtime below the threshold, capped at 30% of monthly fees.

3. Payment Terms. Subscription fees are billed annually in advance. Invoices are payable net thirty (30) days from invoice date. Late payments incur interest at 1.5% per month or the highest rate permitted by law.

4. Intellectual Property & Data Ownership. Customer retains sole and exclusive ownership of all Customer Data uploaded to the platform. Provider retains all intellectual property rights in the software, algorithms, and models.

5. Limitation of Liability. TO THE MAXIMUM EXTENT PERMITTED BY LAW, NEITHER PARTY SHALL BE LIABLE FOR ANY INDIRECT, INCIDENTAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES. PROVIDER'S TOTAL AGGREGATE LIABILITY ARISING OUT OF THIS AGREEMENT SHALL BE LIMITED TO THE TOTAL FEES PAID BY CUSTOMER IN THE TWELVE (12) MONTHS PRECEDING THE CLAIM.

6. Term and Automatic Renewal. This Agreement commences on the Order Date for an initial term of one (1) year and shall automatically renew for successive one-year periods unless either party provides written notice of non-renewal at least sixty (60) days prior to the expiration of the then-current term.`;

export async function POST() {
  try {
    const supabaseService = await createServiceRoleClient();

    // 1. Check if demo user already exists
    const { data: usersData, error: listError } = await supabaseService.auth.admin.listUsers();
    
    let demoUserId: string | null = null;
    if (!listError && usersData?.users) {
      const existingUser = usersData.users.find(u => u.email === DEMO_EMAIL);
      if (existingUser) {
        demoUserId = existingUser.id;
      }
    }

    // 2. Create demo user if not found
    if (!demoUserId) {
      const { data: newUser, error: createError } = await supabaseService.auth.admin.createUser({
        email: DEMO_EMAIL,
        password: DEMO_PASSWORD,
        email_confirm: true,
        user_metadata: {
          full_name: 'Hackathon Judge (Demo)',
        },
      });

      if (createError || !newUser?.user) {
        console.error('Failed to create demo user:', createError);
        return NextResponse.json({ error: 'Failed to initialize demo account' }, { status: 500 });
      }

      demoUserId = newUser.user.id;

      // Ensure profile exists
      await (supabaseService.from('profiles') as any).upsert({
        id: demoUserId,
        full_name: 'Hackathon Judge (Demo)',
      });
    }

    // 3. Ensure demo documents exist for instant exploration
    const { data: existingDocs } = await (supabaseService
      .from('documents') as any)
      .select('id')
      .eq('user_id', demoUserId);

    if (!existingDocs || existingDocs.length === 0) {
      // Seed sample documents
      const docsToInsert = [
        {
          user_id: demoUserId,
          title: 'Mutual Non-Disclosure Agreement (Acme vs Vertex)',
          document_type: 'nda',
          original_text: SAMPLE_NDA_TEXT,
          file_name: 'Mutual_NDA_Acme_Vertex.txt',
          file_type: 'txt',
          file_size: Buffer.byteLength(SAMPLE_NDA_TEXT, 'utf-8'),
        },
        {
          user_id: demoUserId,
          title: 'CloudScale SaaS Master Services Agreement',
          document_type: 'contract',
          original_text: SAMPLE_SAAS_TEXT,
          file_name: 'CloudScale_SaaS_MSA.txt',
          file_type: 'txt',
          file_size: Buffer.byteLength(SAMPLE_SAAS_TEXT, 'utf-8'),
        },
      ];

      const { data: insertedDocs } = await (supabaseService
        .from('documents') as any)
        .insert(docsToInsert)
        .select();

      // Pre-seed sample analysis for the first document so judges immediately see rich insights
      if (insertedDocs && insertedDocs.length > 0) {
        const ndaDocId = insertedDocs[0].id;

        await (supabaseService.from('analyses') as any).insert([
          {
            document_id: ndaDocId,
            analysis_type: 'risk',
            model_used: 'gemini-2.0-flash',
            result: {
              overallRiskLevel: 'medium',
              riskScore: 6,
              risks: [
                {
                  clause: 'Section 6: Non-Compete and Non-Solicitation (12 Months)',
                  riskLevel: 'high',
                  explanation: 'Restricts hiring employees/contractors involved in discussions for a full year after discussions end, which could hinder your recruitment capabilities.',
                  recommendation: 'Negotiate to exclude general public job solicitations or limit strictly to key executive personnel.',
                  location: 'Section 6',
                },
                {
                  clause: 'Section 5: 5-Year Survival Period of Confidentiality',
                  riskLevel: 'medium',
                  explanation: '5 years is longer than standard tech NDAs (typically 2-3 years) for non-trade secret material.',
                  recommendation: 'Request standard 2-year survival period, preserving indefinite protection solely for trade secrets.',
                  location: 'Section 5',
                },
                {
                  clause: 'Section 8: Liability Cap of $500,000 USD',
                  riskLevel: 'low',
                  explanation: 'Having an explicit liability cap provides predictable exposure limit for unauthorized disclosures.',
                  recommendation: 'Acceptable clause, standard for mid-sized commercial partnerships.',
                  location: 'Section 8',
                }
              ],
              obligations: [
                {
                  description: 'Maintain strict confidentiality precautions matching internal security policies',
                  party: 'Both Parties',
                  priority: 'high',
                },
                {
                  description: 'Provide thirty (30) days written notice prior to terminating discussions',
                  party: 'Terminating Party',
                  deadline: '30 days before termination',
                  priority: 'medium',
                },
                {
                  description: 'Refrain from soliciting participating employees or contractors for 12 months',
                  party: 'Both Parties',
                  deadline: '12 months post-agreement',
                  priority: 'high',
                }
              ]
            }
          },
          {
            document_id: ndaDocId,
            analysis_type: 'summary',
            model_used: 'gemini-2.0-flash',
            result: {
              executiveSummary: 'This is a bilateral Mutual Non-Disclosure Agreement between Acme Innovations and Vertex Tech Solutions to evaluate collaborative AI development. Both parties agree to protect proprietary information for 2 years, with surviving confidentiality duties for 5 years.',
              parties: [
                'Acme Innovations Inc. (Party A, Delaware Corp)',
                'Vertex Tech Solutions LLC (Party B, California LLC)'
              ],
              effectiveDate: 'January 15, 2026',
              expirationDate: 'January 15, 2028',
              keyDates: [
                { date: '2026-01-15', description: 'Agreement Effective Date' },
                { date: '2028-01-15', description: 'Discussion Term Expiration (2 Years)' },
                { date: '2033-01-15', description: 'Confidentiality Obligations Expiration (5 Years Post-Term)' }
              ],
              keyPoints: [
                'Covers mutual exchange of proprietary technical data and source code for AI collaboration',
                'Includes a 12-month post-term employee non-solicitation restriction',
                'Enforces Delaware jurisdiction and New Castle County court venue',
                'Sets an aggregate mutual liability ceiling of $500,000 USD'
              ],
              actionItems: [
                { item: 'Mark all shared technical documentation as "CONFIDENTIAL"', priority: 'high' },
                { item: 'Maintain an internal log of individuals granted access to Acme disclosures', priority: 'medium' }
              ]
            }
          }
        ]);
      }
    }

    return NextResponse.json({
      email: DEMO_EMAIL,
      password: DEMO_PASSWORD,
    });
  } catch (error: any) {
    console.error('Demo auth error:', error);
    return NextResponse.json({ error: error.message || 'Demo initialization failed' }, { status: 500 });
  }
}
