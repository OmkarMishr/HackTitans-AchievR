import React from "react";
import { Zap, Folder, Target } from "lucide-react";

export default function Problem() {
  return (
    <section className="py-20 md:py-28 px-6 md:px-10 bg-[#faf8f5]">
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 md:gap-20 items-start">

        {/* ── LEFT ── */}
        <div className="space-y-6">
          <div>
            <h2 className="text-[36px] sm:text-[44px] font-light tracking-[-0.02em] text-[#1a1a1a] leading-[1.1]">
              The Problem
            </h2>
            <h2 className="text-[36px] sm:text-[44px] font-light tracking-[-0.02em] leading-[1.1]"
              style={{
                background: "linear-gradient(110deg, #dc2626, #f97316)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Students Face Today
            </h2>
          </div>

          {/* Highlight line */}
          <p className="text-[15px] font-medium text-[#1a1a1a] leading-relaxed border-l-2 border-orange-400 pl-4">
            Achievements are scattered. Certificates are delayed.
            Verification is broken.
          </p>

          {/* Body */}
          <div className="space-y-3 text-[14px] text-slate-800 font-normal leading-[1.8]">
            <p>
              Students receive certificates weeks after events — many get lost
              or remain unused. Recruiters struggle to verify authenticity, and
              achievements stay fragmented across platforms.
            </p>
            <p>
              AchievR solves this by creating a centralized, verified achievement
              portfolio — making every accomplishment structured, accessible,
              and credible.
            </p>
          </div>
        </div>

        {/* ── RIGHT ── */}
        <div className="bg-white rounded-2xl border border-orange-100 shadow-[0_8px_40px_rgba(249,115,22,0.08)] p-7 md:p-8 space-y-0 divide-y divide-slate-100">
          <Feature
            icon={<Zap size={16} strokeWidth={2} />}
            title="Instant Certificate Issuance"
            desc="Certificates are generated and delivered digitally — no delays, no manual handling."
          />
          <Feature
            icon={<Folder size={16} strokeWidth={2} />}
            title="Auto Portfolio Builder"
            desc="Every verified achievement is automatically added to a structured digital profile."
          />
          <Feature
            icon={<Target size={16} strokeWidth={2} />}
            title="Recruiter-Ready"
            desc="Share a single verified portfolio link — no PDFs, no manual proof."
          />
        </div>

      </div>
    </section>
  );
}

function Feature({ icon, title, desc }) {
  return (
    <div className="flex gap-4 py-5 first:pt-0 last:pb-0">
      <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-lg bg-orange-50 text-orange-500 flex-shrink-0 border border-orange-100">
        {icon}
      </div>
      <div className="space-y-1">
        <p className="text-[13px] font-medium text-[#1a1a1a]">{title}</p>
        <p className="text-[13px] text-slate-400 font-light leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}
