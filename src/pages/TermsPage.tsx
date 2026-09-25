import React, { useState, useEffect } from 'react';
import { FileText, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { legalContent as staticLegalContent, contactHandles as staticContactHandles } from '../data/bossContent';
import { api } from '../lib/api';

interface LegalDoc {
  id: string;
  type: string;
  title: string;
  content: string;
}

interface ContactDoc {
  email: string;
  physicalAddress: string;
}

export const TermsPage: React.FC = () => {
  const [legalDoc, setLegalDoc] = useState<LegalDoc | null>(null);
  const [contact, setContact] = useState<ContactDoc>({
    email: staticContactHandles.email,
    physicalAddress: staticContactHandles.physicalAddress,
  });

  useEffect(() => {
    api.get<LegalDoc>('/legal/terms').then(setLegalDoc).catch(() => {});
    api.get<any>('/contact').then((data) => {
      if (data) {
        setContact({
          email: data.email || staticContactHandles.email,
          physicalAddress: data.physicalAddress || staticContactHandles.physicalAddress,
        });
      }
    }).catch(() => {});
  }, []);

  return (
    <div className="w-full">
      <section className="relative text-white pt-32 pb-16 px-layout bg-[#031d12]">
        <div className="max-w-4xl mx-auto">
          <Link to="/" className="inline-flex items-center gap-1.5 text-xs text-emerald-300 hover:text-white mb-6">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
          <div className="flex items-center gap-3 mb-3">
            <FileText className="w-8 h-8 text-[#00e074]" />
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
              {legalDoc?.title || 'Terms & Conditions'}
            </h1>
          </div>
          <p className="text-gray-300 text-sm">
            Effective for all users of www.climateconcern.rw
          </p>
        </div>
      </section>

      <section className="py-16 px-layout bg-white">
        <div className="max-w-4xl mx-auto prose prose-emerald text-gray-700 text-sm sm:text-base leading-relaxed space-y-8">
          {legalDoc ? (
            // Live content from DB: render as whitespace-preserved text blocks
            <div>
              <div className="p-6 rounded-2xl bg-gray-50 border border-gray-200 mb-8">
                <p className="font-medium text-gray-900 whitespace-pre-line">{legalDoc.content}</p>
              </div>
            </div>
          ) : (
            // Static fallback with structured rendering
            <>
              <div className="p-6 rounded-2xl bg-gray-50 border border-gray-200">
                <p className="font-medium text-gray-900">{staticLegalContent.terms.intro}</p>
              </div>

              <div>
                <h2 className="font-display text-xl font-bold text-gray-900 mb-3">Use of the Website</h2>
                <p className="mb-2">By using this Website, you agree that you will:</p>
                <ul className="list-disc pl-5 space-y-1.5 text-gray-700">
                  {staticLegalContent.terms.useOfWebsite.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h2 className="font-display text-xl font-bold text-gray-900 mb-3">Intellectual Property</h2>
                <p className="whitespace-pre-line">{staticLegalContent.terms.intellectualProperty}</p>
              </div>

              <div>
                <h2 className="font-display text-xl font-bold text-gray-900 mb-3">User Submissions</h2>
                <p className="whitespace-pre-line">{staticLegalContent.terms.userSubmissions}</p>
              </div>

              <div>
                <h2 className="font-display text-xl font-bold text-gray-900 mb-3">Disclaimer</h2>
                <p>{staticLegalContent.terms.disclaimer}</p>
              </div>

              <div>
                <h2 className="font-display text-xl font-bold text-gray-900 mb-3">Limitation of Liability</h2>
                <p>{staticLegalContent.terms.limitationOfLiability}</p>
              </div>

              <div>
                <h2 className="font-display text-xl font-bold text-gray-900 mb-3">Modifications to the Terms</h2>
                <p>{staticLegalContent.terms.modifications}</p>
              </div>

              <div>
                <h2 className="font-display text-xl font-bold text-gray-900 mb-3">Governing Law</h2>
                <p>{staticLegalContent.terms.governingLaw}</p>
              </div>
            </>
          )}

          <div className="pt-6 border-t border-gray-200">
            <h2 className="font-display text-xl font-bold text-gray-900 mb-3">Contact Us</h2>
            <p className="mb-2">If you have any questions about these Terms, please contact us at:</p>
            <div className="space-y-1 text-sm font-medium text-gray-800">
              <div>Email: <a href={`mailto:${contact.email}`} className="text-[#00652c] underline">{contact.email}</a></div>
              <div>Physical Address: {contact.physicalAddress}</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
