import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, ShieldCheck, Users, Clock, Award, TrendingUp } from "lucide-react";

export default function Hero({ user }) {
  const navigate = useNavigate();

  const handleCTA = () => {
    if (!user) {
      navigate("/register");
      return;
    }
    if (user.role === "student") navigate("/dashboard");
    else navigate(`/${user.role}`);
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white via-orange-50/10 to-gray-50 pt-12 pb-16">
      {/* background glows */}
      <div className="pointer-events-none absolute -right-40 top-0 h-80 w-80 rounded-full bg-orange-300 blur-3xl opacity-20" />
      <div className="pointer-events-none absolute -left-40 bottom-0 h-72 w-72 rounded-full bg-orange-100 blur-3xl opacity-30" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Hero Text */}
        <div className="text-center max-w-3xl mx-auto">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-orange-50 border border-orange-200 text-orange-600 text-xs font-normal px-4 py-1.5 rounded-full mb-6">
            <ShieldCheck size={13} />
            <span>Trusted by students across colleges & hackathons</span>
          </div>

          {/* Heading */}
          <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl font-light leading-tight tracking-tight text-gray-900">
            Verified Achievements
            <br className="hidden xs:block" />
            {" "}That Recruiters{" "}
            <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent font-semibold">
              Can Trust Instantly
            </span>
          </h1>

          {/* Subtext */}
          <p className="mt-5 text-gray-500 text-sm sm:text-base md:text-lg max-w-xl mx-auto font-light leading-relaxed px-2">
            Issue instant digital certificates and automatically build a
            recruiter-ready portfolio that can be verified in a single click.
          </p>

          {/* CTAs */}
          <div className="mt-8 flex flex-col xs:flex-row items-center justify-center gap-3">
            <button
              onClick={handleCTA}
              className="w-full xs:w-auto group inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-600 to-orange-500 px-7 py-3 text-sm sm:text-base font-medium text-white shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 transition-all duration-300 hover:-translate-y-0.5"
            >
              {user ? "Go to Dashboard" : "Get Certified Instantly"}
              <ArrowRight
                size={17}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </button>

            <button
              onClick={() => navigate("/verify")}
              className="w-full xs:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 text-sm text-gray-600 hover:text-gray-900 border border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50 rounded-xl transition-all shadow-sm"
            >
              <ShieldCheck size={15} />
              Verify a Certificate
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="mt-14 grid grid-cols-3 gap-3 sm:gap-4 max-w-3xl mx-auto">
          <div className="bg-white border border-gray-200 rounded-2xl px-4 sm:px-6 py-4 sm:py-5 shadow-sm text-center">
            <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center mx-auto mb-3">
              <Award className="w-4 h-4 text-orange-600" />
            </div>
            <p className="text-lg sm:text-xl font-semibold text-gray-900">Instant</p>
            <p className="text-xs text-gray-400 font-light mt-1 leading-snug">Certificate issuance</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl px-4 sm:px-6 py-4 sm:py-5 shadow-sm text-center">
            <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center mx-auto mb-3">
              <ShieldCheck className="w-4 h-4 text-orange-600" />
            </div>
            <p className="text-lg sm:text-xl font-semibold text-gray-900">1-Click</p>
            <p className="text-xs text-gray-400 font-light mt-1 leading-snug">Recruiter verification</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl px-4 sm:px-6 py-4 sm:py-5 shadow-sm text-center">
            <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center mx-auto mb-3">
              <TrendingUp className="w-4 h-4 text-orange-600" />
            </div>
            <p className="text-lg sm:text-xl font-semibold text-gray-900">Auto</p>
            <p className="text-xs text-gray-400 font-light mt-1 leading-snug">Portfolio generation</p>
          </div>
        </div>

        {/* Trust line */}
        <div className="mt-6 flex flex-col xs:flex-row flex-wrap items-center justify-center gap-3 xs:gap-x-6 text-xs text-gray-400 font-light">
          <div className="flex items-center gap-1.5">
            <Users size={13} className="text-orange-400 flex-shrink-0" />
            Built for colleges, clubs, events & hackathons
          </div>
          <div className="flex items-center gap-1.5">
            <Clock size={13} className="text-orange-400 flex-shrink-0" />
            Issue certificates in under 60 seconds
          </div>
        </div>

      </div>
    </section>
  );
}