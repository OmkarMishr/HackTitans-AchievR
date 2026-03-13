import React from "react";
import { ArrowRight } from "lucide-react";

export default function Steps() {
  const steps = [
    {
      num: "01",
      title: "Submit Achievement",
      desc: "Upload your event participation or achievement details",
    },
    {
      num: "02",
      title: "Faculty Approval",
      desc: "Authorized faculty verifies and approves authenticity",
    },
    {
      num: "03",
      title: "Instant Digital Certificate",
      desc: "Receive your certificate immediately after approval.",
    },
    {
      num: "04",
      title: "Share Portfolio",
      desc: "Your verified achievements are added to your professional portfolio — shareable with recruiters.",
    },
  ];

  return (
    <section className="py-16 md:py-20 px-4 md:px-8 bg-white">
      <div className="max-w-5xl mx-auto">
        {/* heading */}
        <div className="text-center mb-10 md:mb-14">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-light mb-3">
            4 Simple Steps
          </h2>
          <p className="text-gray-600 text-sm sm:text-base">
            Get your achievement verified in minutes
          </p>
        </div>

        {/* mobile: vertical timeline */}
        <div className="space-y-4 sm:hidden">
          {steps.map((step, idx) => (
            <div
              key={step.num}
              className="relative flex gap-3 items-start"
            >
              {/* timeline bullet */}
              <div className="flex flex-col items-center">
                <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center text-xs font-bold text-orange-600">
                  {step.num}
                </div>
                {idx !== steps.length - 1 && (
                  <div className="flex-1 w-px bg-orange-100 mt-1" />
                )}
              </div>

              {/* card */}
              <div className="flex-1 rounded-xl border border-gray-200 bg-gradient-to-br from-orange-50 to-white p-4 shadow-sm">
                <h3 className="text-base font-semibold mb-1 text-gray-900">
                  {step.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* tablet/desktop: original grid */}
        <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-7 items-stretch justify-items-center">
          {steps.map((step, idx) => (
            <div key={step.num} className="relative group w-full max-w-xs">
              <div className="h-full flex flex-col p-6 md:p-7 rounded-xl border-2 border-gray-200 bg-gradient-to-br from-orange-50 to-white hover:border-orange-400 hover:shadow-lg hover:scale-105 transition">
                <div className="text-4xl md:text-5xl font-bold text-orange-200 mb-4 group-hover:text-orange-400">
                  {step.num}
                </div>
                <h3 className="text-lg md:text-xl font-semibold mb-2 group-hover:text-orange-600">
                  {step.title}
                </h3>
                <p className="text-gray-600 text-sm md:text-base flex-grow">
                  {step.desc}
                </p>
              </div>

              {idx !== steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 -translate-y-1/2">
                  <ArrowRight size={22} className="text-orange-300" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}