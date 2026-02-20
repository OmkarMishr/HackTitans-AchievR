import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import convocationHat from "../../assets/convocation-hat (1).png";

export default function Hero({ user }) {
  const navigate = useNavigate();
  const [scrollOffset, setScrollOffset] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      setScrollOffset(window.scrollY);
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleCTA = () => {
    if (!user) {
      navigate("/register");
      return;
    }

    if (user.role === "student") {
      navigate("/dashboard");
    } else {
      navigate(`/${user.role}`);
    }
  };

  return (
    <section className="relative pt-28 pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden bg-gradient-to-b from-white to-gray-50">

      {/* Soft Glow Background */}
      <div
        className="absolute top-24 right-[-100px] w-80 h-80 bg-orange-200 rounded-full blur-3xl opacity-30"
        style={{ transform: `translateY(${scrollOffset * 0.08}px)` }} />

      <div className="max-w-7xl mx-auto">

        <div className="grid md:grid-cols-3 gap-10 items-center">

          {/* LEFT CONTENT */}
          <div className="md:col-span-2 text-center md:text-left">

            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light leading-tight tracking-tight">
              Verified Achievements
              <br />
              That Recruiters
              <br />
              <span className="bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent font-medium">
                Can Trust Instantly
              </span>
            </h2>

            <p className="mt-6 text-gray-600 text-base sm:text-lg max-w-xl mx-auto md:mx-0">
              Issue instant digital certificates and automatically build a
              verified, recruiter-ready student portfolio.
            </p>

            {/* PREMIUM CTA */}
            <div className="mt-8 flex justify-center md:justify-start">
              <button
                onClick={handleCTA}
                className="group relative inline-flex items-center gap-2 px-8 py-3 rounded-xl
                           bg-gradient-to-r from-orange-600 to-orange-500
                           text-white text-sm sm:text-base font-medium
                           shadow-lg shadow-orange-500/30
                           hover:shadow-orange-500/50
                           transition-all duration-300
                           hover:-translate-y-1" >
                {user ? "Go to Dashboard" : "Get Certified Instantly"}

                <ArrowRight
                  size={18}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </button>
            </div>
          </div>

          {/*RIGHT IMAGE- Hidden on Mobile */}
          <div className="hidden md:flex justify-center">
            <img
              src={convocationHat}
              alt="Graduation Cap"
              className="h-72 lg:h-80 transition-transform duration-500 hover:scale-105"
            />
          </div>

        </div>
      </div>
    </section>
  );
}