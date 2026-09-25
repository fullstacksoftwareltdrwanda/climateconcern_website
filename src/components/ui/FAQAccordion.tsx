import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import type { FAQ } from '../../data/faqs';

interface FAQAccordionProps {
  faqs: FAQ[];
}

export const FAQAccordion: React.FC<FAQAccordionProps> = ({ faqs }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="flex flex-col gap-3 w-full max-w-4xl mx-auto">
      {faqs.map((faq, idx) => {
        const isOpen = openIndex === idx;
        return (
          <div
            key={idx}
            className={`rounded-xl border transition-all duration-200 overflow-hidden ${
              isOpen
                ? 'bg-white border-emerald-200 shadow-sm'
                : 'bg-white/80 border-gray-200/80 hover:border-gray-300'
            }`}
          >
            <button
              className="w-full flex items-center justify-between p-5 text-left transition-colors"
              onClick={() => setOpenIndex(isOpen ? null : idx)}
              aria-expanded={isOpen}
            >
              <span className="text-base sm:text-lg font-semibold text-gray-900 pr-4">
                {faq.question}
              </span>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 ${
                  isOpen ? 'bg-emerald-100 text-emerald-800 rotate-180' : 'bg-gray-100 text-gray-600'
                }`}
              >
                <ChevronDown className="w-4 h-4" />
              </div>
            </button>
            {isOpen && (
              <div className="px-5 pb-5 text-gray-600 text-sm sm:text-base leading-relaxed border-t border-gray-100 pt-4">
                {faq.answer}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
