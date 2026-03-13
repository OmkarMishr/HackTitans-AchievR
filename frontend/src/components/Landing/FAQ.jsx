import React, { useState } from "react";

const faqs = [
  {
    question: "Is AchievR free for students?",
    answer:
      "Yes. Students can receive, store, and share their verified certificates on AchievR at no cost. Pricing applies only to institutions using the issuing dashboard.",
  },
  {
    question: "How secure are the certificates?",
    answer:
      "Every certificate has a unique ID and verification link. Data is stored securely, and any change to a credential invalidates the original link, preventing tampering.",
  },
  {
    question: "Can recruiters verify without an AchievR account?",
    answer:
      "Yes. Recruiters just click the public verification link or scan the QR on the certificate to see an instant validity check and key achievement details.",
  },
  {
    question: "Who can issue certificates on AchievR?",
    answer:
      "Only authorized faculty, administrators, or event organizers with verified institutional accounts can issue certificates through the admin dashboard.",
  },
  {
    question: "Can AchievR integrate with our existing systems?",
    answer:
      "Yes. AchievR provides APIs and bulk upload options so colleges can sync participants, events, and results from their existing ERPs or spreadsheets.",
  },
  {
    question: "What happens if a certificate is issued with a mistake?",
    answer:
      "Admins can revoke or reissue certificates. The old verification link shows that the credential has been updated, so recruiters always see the latest, correct data.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0); // first open by default

  const toggle = (index) => {
    setOpenIndex((current) => (current === index ? -1 : index));
  };

  return (
    <section className="py-16 md:py-20 px-4 md:px-8 bg-white">
      <div className="max-w-5xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-10 md:mb-14">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-light">
            Frequently Asked
            <span className="block bg-gradient-to-r from-orange-700 to-orange-500 bg-clip-text text-transparent">
              Questions
            </span>
          </h2>
          <p className="mt-3 text-gray-600 text-sm sm:text-base">
            Everything you need to know before issuing certificates with AchievR.
          </p>
        </div>

        {/* Accordions */}
        <div className="space-y-3">
          {faqs.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={item.question}
                className="border border-gray-200 rounded-xl bg-gray-50/60 hover:border-orange-300 transition"
              >
                <button
                  type="button"
                  onClick={() => toggle(index)}
                  className="w-full flex items-center justify-between gap-3 px-4 sm:px-5 py-3 sm:py-4 text-left"
                >
                  <span className="text-sm sm:text-base font-medium text-gray-900">
                    {item.question}
                  </span>
                  <span
                    className={`flex h-6 w-6 items-center justify-center rounded-full border text-xs font-bold transition
                      ${
                        isOpen
                          ? "bg-orange-500 border-orange-500 text-white"
                          : "bg-white border-gray-300 text-gray-600"
                      }`}
                  >
                    {isOpen ? "−" : "+"}
                  </span>
                </button>

                {isOpen && (
                  <div className="px-4 sm:px-5 pb-4 sm:pb-5 text-xs sm:text-sm text-gray-600 border-t border-gray-200">
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}