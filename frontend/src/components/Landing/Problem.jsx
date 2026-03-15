import React from "react";
import { Zap, Folder, Target } from "lucide-react";

export default function Problem() {
  return (
    <section className="py-16 md:py-20 px-4 md:px-8 bg-gradient-to-br from-gray-100 via-gray-50 to-gray-100">
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10 md:gap-14 items-center">
        {/* LEFT */}
        <div className="text-center md:text-left">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-light mb-4">
            The Problem
            <span className="block bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
              Students Face Today
            </span>
          </h2>

          <div className="space-y-4 text-gray-700 text-sm sm:text-base">
            <p>
              Students often receive certificates weeks or months after events. Many lose them.
              Recruiters cannot verify authenticity, and achievements remain scattered and
              unrecognized.
            </p>
            <p>
              AchievR digitizes certification and converts verified achievements into a structured,
              trusted portfolio — making student skills visible and credible.
            </p>
          </div>
        </div>

        {/* RIGHT */}
        <div className="bg-white p-6 md:p-8 rounded-2xl border-2 border-orange-200 shadow-xl hover:shadow-2xl hover:border-orange-400 transition">
          <Feature
            icon={<Zap size={20} />}
            title="Instant Certificate Issuance"
            desc="Certificates delivered digitally right after approval."
          />
          <Feature
            icon={<Folder size={20} />}
            title="Auto Portfolio Builder"
            desc="All verified achievements automatically build your professional profile."
          />
          <Feature
            icon={<Target size={20} />}
            title="Recruiter-Ready"
            desc="Share one verified portfolio link — no manual proof needed."
          />
        </div>
      </div>
    </section>
  );
}

function Feature({ icon, title, desc }) {
  return (
    <div className="flex gap-4 mb-6 last:mb-0">
      <div className="mt-1 flex h-9 w-9 items-center justify-center rounded-full bg-orange-50 text-orange-600">
        {icon}
      </div>
      <div>
        <p className="font-medium text-gray-900">{title}</p>
        <p className="text-sm text-gray-600">{desc}</p>
      </div>
    </div>
  );
}