import { useNavigate } from "react-router-dom";
import { ArrowRight, Play, ShieldCheck, CheckCircle2, Clock, Award } from "lucide-react";
import previewImg from "../../assets/preview.png";

export default function AchievRHero({ user }) {
  const navigate = useNavigate();

  const handleCTA = () => {
    if (!user) { navigate("/register"); return; }
    if (user.role === "student") navigate("/dashboard");
    else navigate(`/${user.role}`);
  };

  return (
    <div className="relative min-h-screen bg-[#faf8f5] overflow-hidden font-sans">

      {/* Warm radial glow — centre top */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[420px] rounded-full bg-orange-100/80 blur-[90px] pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-[200px] rounded-full bg-orange-200/60 blur-[60px] pointer-events-none" />

      {/* ── Hero copy — centered ── */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 pt-7 sm:pt-15">

        {/* Badge */}
        <div className="inline-flex items-center gap-1.5 h-6 md:h-10 px-3.5 rounded-full border border-orange-200 bg-orange-50 text-[8px] md:text-[11px] font-medium text-orange-500 mb-9  tracking-wide shadow-sm">
          <ShieldCheck size={11} strokeWidth={2.5} />
          Centralized Student Achievement Platform
        </div>

        {/* Headline */}
        <h1 className="max-w-3xl lg:max-w-4xl leading-[1.08] tracking-[-0.035em]">
          <span className="block text-[46px] sm:text-[58px] lg:text-[68px] font-light text-[#1a1a1a]">
            Take Control of Your
          </span>
          <span className="block text-[46px] sm:text-[58px] lg:text-[68px] font-light text-[#1a1a1a]">
            Achievement{" "}
            <em
              style={{
                fontFamily: "'Georgia', serif",
                fontStyle: "italic",
                fontWeight: 300,
                background: "linear-gradient(110deg, #ea6a0a 20%, #f97316 60%, #fb923c 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Growth
            </em>
          </span>
        </h1>

        {/* Subheading */}
        <p className="mt-5 max-w-[980px] text-[12px] sm:text-[20px] text-gray-800 leading-[1.8] font-normal">
          A centralized platform for students to record, verify, and showcase academic, co-curricular, and extracurricular achievements in one
          secure digital portfolio.
        </p>

        {/* CTAs */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={handleCTA}
            className="h-11 px-7 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-[13px] font-semibold flex items-center gap-2 shadow-[0_4px_24px_rgba(249,115,22,0.35)] hover:shadow-[0_4px_32px_rgba(249,115,22,0.5)] transition-all duration-200"
          >
            {user ? "Go to Dashboard" : "Start Building Your Portfolio"}
            <ArrowRight size={15} strokeWidth={2.5} />
          </button>

          <button
            onClick={() => navigate("/verify")}
            className="h-11 px-7 rounded-xl border border-slate-200 hover:border-slate-300 text-slate-500 hover:text-slate-700 text-[13px] font-light flex items-center gap-2.5 bg-white hover:bg-slate-50 transition-all duration-200 shadow-sm"
          >
            <span className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center">
              <Play size={8} fill="currentColor" className="ml-px text-slate-500" />
            </span>
            Watch Demo
          </button>
        </div>

        {/* Trust strip */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-5 text-[12px] md:text-[18px] font-light text-slate-400">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 size={11} className="text-emerald-800" strokeWidth={2} />
            Faculty-verified certificates
          </span>
          <span className="w-px h-3 bg-slate-200" />
          <span className="flex items-center gap-1.5">
            <Clock size={11} className="text-orange-400" strokeWidth={2} />
            2-second verification
          </span>
          <span className="w-px h-3 bg-slate-200" />
          <span className="flex items-center gap-1.5">
            <ShieldCheck size={11} className="text-indigo-400" strokeWidth={2} />
            Secure digital portfolio
          </span>
        </div>

        {/* ── MacBook Mockup ── */}
        <div className="relative w-full max-w-[860px] mx-auto pt-9 md:mt-14 pb-0">

          {/* Bottom fade */}
          <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-[#faf8f5] to-transparent z-10 pointer-events-none" />

          {/* MacBook shell */}
          <div className="relative">

            {/* Screen bezel */}
            <div className="relative mx-auto w-full rounded-t-[18px] rounded-b-[6px] bg-[#1d1d1f] p-[10px] pb-[8px] shadow-[0_30px_80px_rgba(0,0,0,0.18),0_8px_24px_rgba(0,0,0,0.10)]"
              style={{ boxShadow: "0 32px 80px rgba(0,0,0,0.16), 0 0 0 1px rgba(0,0,0,0.08)" }}
            >
              {/* Camera notch */}
              <div className="absolute top-[5px] left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#3a3a3c]" />

              {/* Screen inner */}
              <div className="relative rounded-[10px] overflow-hidden bg-[#f5f5f7]" style={{ aspectRatio: "16/10" }}>
                {/* Browser chrome inside screen */}
                <div className="flex items-center gap-1.5 h-7 px-3 bg-[#ececec] border-b border-black/[0.06]">
                  <div className="w-2 h-2 rounded-full bg-[#ff5f57]" />
                  <div className="w-2 h-2 rounded-full bg-[#ffbd2e]" />
                  <div className="w-2 h-2 rounded-full bg-[#28c840]" />
                  <div className="ml-2 flex-1 max-w-[200px] h-3.5 rounded-sm bg-white border border-black/[0.08] flex items-center px-2">
                    <span className="text-[8px] text-slate-400 font-mono">achievr.app/dashboard</span>
                  </div>
                </div>

                {/* Dashboard screenshot */}
                <img
                  src={previewImg}
                  alt="AchievR Dashboard"
                  className="w-full h-full object-cover object-top"
                />
              </div>
            </div>

            {/* Hinge */}
            <div className="relative mx-auto h-[6px] rounded-b-sm"
              style={{
                background: "linear-gradient(to bottom, #a1a1a6, #d1d1d6)",
                boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
              }}
            />

            {/* Base / keyboard deck */}
            <div className="relative mx-auto h-[22px] rounded-b-[14px]"
              style={{
                background: "linear-gradient(to bottom, #c8c8cc, #e8e8ed)",
                boxShadow: "0 6px 20px rgba(0,0,0,0.10), inset 0 1px 0 rgba(255,255,255,0.6)",
              }}
            >
              {/* Trackpad hint */}
              <div className="absolute bottom-[4px] left-1/2 -translate-x-1/2 w-16 h-[5px] rounded-sm bg-black/[0.07]" />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}