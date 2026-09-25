import React, { useState, useEffect } from 'react';
import { Shield, ArrowLeft } from 'lucide-react';
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

export const PrivacyPage: React.FC = () => {
  const [legalDoc, setLegalDoc] = useState<LegalDoc | null>(null);
  const [contact, setContact] = useState<ContactDoc>({
    email: staticContactHandles.email,
    physicalAddress: staticContactHandles.physicalAddress,
  });

  useEffect(() => {
    api.get<LegalDoc>('/legal/privacy').then(setLegalDoc).catch(() => {});
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
            <Shield className="w-8 h-8 text-[#00e074]" />
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
              {legalDoc?.title || 'Privacy Policy'}
            </h1>
          </div>
          <p className="text-gray-300 text-sm">
            Effective Date: <strong>{staticLegalContent.privacy.effectiveDate}</strong> | Last Updated: <strong>{staticLegalContent.privacy.lastUpdated}</strong>
          </p>
        </div>
      </section>

      <section className="py-16 px-layout bg-white">
        <div className="max-w-4xl mx-auto prose prose-emerald text-gray-700 text-sm sm:text-base leading-relaxed space-y-8">
          {legalDoc ? (
            // Live content from DB
            <div className="p-6 rounded-2xl bg-gray-50 border border-gray-200">
              <p className="font-medium text-gray-900 whitespace-pre-line">{legalDoc.content}</p>
            </div>
          ) : (
            // Static fallback
            <>
              <div className="p-6 rounded-2xl bg-gray-50 border border-gray-200">
                <p className="font-medium text-gray-900">{staticLegalContent.privacy.intro}</p>
              </div>

              {staticLegalContent.privacy.sections.map((sec) => (
                <div key={sec.num}>
                  <h2 className="font-display text-xl font-bold text-gray-900 mb-3">
                    {sec.num}. {sec.title}
                  </h2>
                  <div className="whitespace-pre-line text-gray-700">
                    {sec.content}
                  </div>
                </div>
              ))}
            </>
          )}

          <div className="pt-6 border-t border-gray-200">
            <h2 className="font-display text-xl font-bold text-gray-900 mb-3">Contact Us</h2>
            <p className="mb-2">If you have questions or concerns about this Privacy Policy or your personal data, please contact us at:</p>
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
