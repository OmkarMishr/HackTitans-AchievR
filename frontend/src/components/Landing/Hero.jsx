import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, ShieldCheck, Users, Clock } from "lucide-react";
import heroGraduate from "../../assets/Cert-Vedika.png";

export default function Hero({ user }) {
  const navigate = useNavigate();
  const [scrollOffset, setScrollOffset] = useState(0);
  const [mobileSlide, setMobileSlide] = useState("content"); // "content" | "image"

  useEffect(() => {
    const onScroll = () => setScrollOffset(window.scrollY);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // auto-slide on mobile only
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    if (!mq.matches) return;

    const interval = setInterval(() => {
      setMobileSlide((prev) => (prev === "content" ? "image" : "content"));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleCTA = () => {
    if (!user) {
      navigate("/register");
      return;
    }
    if (user.role === "student") navigate("/dashboard");
    else navigate(`/${user.role}`);
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white via-orange-50/10 to-gray-50 pt-8 pb-14">
      {/* background glows */}
      <div
        className="pointer-events-none absolute -right-40 top-0 h-80 w-80 rounded-full bg-orange-300 blur-3xl opacity-30"
        style={{ transform: `translateY(${scrollOffset * 0.05}px)` }}
      />
      <div
        className="pointer-events-none absolute -left-40 bottom-0 h-72 w-72 rounded-full bg-orange-100 blur-3xl opacity-40"
        style={{ transform: `translateY(${scrollOffset * -0.03}px)` }}
      />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* DESKTOP/TABLET (>= md) */}
        <div className="hidden md:grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          <ContentBlock handleCTA={handleCTA} user={user} />
          <ImageBlock scrollOffset={scrollOffset} />
        </div>

        {/* MOBILE (< md) slider */}
        <div className="md:hidden">
          <div className="flex justify-center gap-2 mb-4">
            <span
              className={`h-1.5 w-6 rounded-full transition-all ${
                mobileSlide === "content" ? "bg-orange-500" : "bg-orange-200"
              }`}
            />
            <span
              className={`h-1.5 w-6 rounded-full transition-all ${
                mobileSlide === "image" ? "bg-orange-500" : "bg-orange-200"
              }`}
            />
          </div>

          <div className="relative h-[430px] overflow-hidden">
            <div
              className={`absolute inset-0 px-1 transition-transform duration-500 ${
                mobileSlide === "content" ? "translate-x-0" : "-translate-x-full"
              }`}
            >
              <ContentBlock handleCTA={handleCTA} user={user} mobile />
            </div>

            <div
              className={`absolute inset-0 px-1 transition-transform duration-500 ${
                mobileSlide === "image" ? "translate-x-0" : "translate-x-full"
              }`}
            >
              <ImageBlock scrollOffset={scrollOffset} mobile />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ContentBlock({ handleCTA, user, mobile = false }) {
  return (
    <div
      className={
        mobile
          ? "text-center"
          : "order-2 lg:order-1 text-center lg:text-left"
      }
    >
      <h1 className="text-3xl sm:text-4xl md:text-6xl font-light leading-tight tracking-tight text-gray-900">
        Verified Achievements
        <br />
        That Recruiters
        <br />
        <span className="bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent font-semibold">
          Can Trust Instantly
        </span>
      </h1>

      <p className="mt-4 text-gray-600 text-sm sm:text-base md:text-lg max-w-xl mx-auto lg:mx-0">
        Issue instant digital certificates & automatically build a
        recruiter-ready portfolio that can be verified in single click 
        {/* — for every
        hackathon, project, and achievement that matters. */}
      </p>

      <div
        className={
          "mt-6 flex flex-col sm:flex-row gap-4 " +
          (mobile ? "items-center justify-center" : "items-start")
        }
      >
        <button
          onClick={handleCTA}
          className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r
                     from-orange-600 to-orange-500 px-7 sm:px-8 py-3 text-sm sm:text-base
                     font-medium text-white shadow-lg shadow-orange-500/30
                     hover:shadow-orange-500/50 transition-all duration-300 hover:-translate-y-0.5"
        >
          {user ? "Go to Dashboard" : "Get Certified Instantly"}
          <ArrowRight
            size={18}
            className="transition-transform duration-300 group-hover:translate-x-1"
          />
        </button>
      </div>

      <div
        className={
          "mt-5 flex flex-wrap items-center gap-3 text-sm text-gray-500 " +
          (mobile ? "justify-center" : "")
        }
      >
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center">
            <Users className="w-4 h-4 text-orange-600" />
          </div>
          <span>Built for colleges, clubs, events & hackathons</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center">
            <Clock className="w-4 h-4 text-orange-600" />
          </div>
          <span>Issue certificates in under 60 seconds.</span>
        </div>
      </div>
    </div>
  );
}

function ImageBlock({ scrollOffset, mobile = false }) {
  return (
    <div
      className={
        mobile
          ? "flex justify-center items-center h-full"
          : "order-1 lg:order-2 flex justify-center"
      }
    >
      <div className="relative w-full max-w-md">
        <div
          className="relative rounded-3xl overflow-hidden shadow-2xl border border-orange-100 bg-white"
          style={{
            transform: `translateY(${Math.sin(scrollOffset * 0.004) * 6}px)`,
            transition: "transform 400ms ease-out",
          }}
        >
          <img
            src={heroGraduate}
            alt="Graduate holding AchievR certificate"
            className="w-full h-full object-cover"
          />

          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />

          <div className="absolute left-5 bottom-4 text-white">
            <p className="text-[11px] uppercase tracking-[0.16em] opacity-80">
              Official AchievR Credential
            </p>
            <p className="text-sm sm:text-base font-semibold">
              CODESTORM Hackathon (2025)
            </p>
          </div>
        </div>

        <div
          className="absolute -top-5 -left-3 sm:-top-6 sm:-left-4 rounded-2xl bg-white shadow-xl px-3 py-2 border border-orange-100 flex items-center gap-2"
          style={{
            transform: `translateY(${Math.cos(scrollOffset * 0.004) * 4}px)`,
            transition: "transform 400ms ease-out",
          }}
        >
          <span className="h-6 w-6 rounded-full bg-orange-100 flex items-center justify-center">
            <ShieldCheck className="w-3.5 h-3.5 text-orange-600" />
          </span>
          <span className="text-[11px] font-semibold text-gray-800">
            Verified by AchievR
          </span>
        </div>
      </div>
    </div>
  );
}