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
    <section className="py-20 md:py-28 px-4 md:px-8 bg-white">
      <div className="max-w-6xl mx-auto">

        <div className="text-center mb-14 md:mb-20">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-light mb-3">
            4 Simple Steps
          </h2>
          <p className="text-gray-600">Get your achievement verified in minutes</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {steps.map((step, idx) => (
            <div key={step.num} className="relative group">

              <div className="h-full flex flex-col p-6 md:p-8 rounded-xl border-2 border-gray-200 bg-gradient-to-br from-orange-50 to-white hover:border-orange-400 hover:shadow-lg hover:scale-105 transition">

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