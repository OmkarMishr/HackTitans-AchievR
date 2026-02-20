import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import convocationHat from "../../assets/convocation-hat (1).png";

export default function Hero({ user }) {
  const navigate = useNavigate();
  const [scrollOffset, setScrollOffset] = useState(0);

  // Handle floating background animation on scroll
  useEffect(() => {
    const onScroll = () => {
      setScrollOffset(window.scrollY);
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // CTA navigation logic
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
    <section className="pt-28 pb-20 px-4 md:px-8 relative bg-white overflow-hidden">

      <div
        className="absolute top-20 right-0 w-72 md:w-96 h-72 md:h-96 bg-orange-100 rounded-full blur-3xl opacity-40"
        style={{
          transform: `translateY(${scrollOffset * 0.1}px)`
        }} />

      <div className="max-w-7xl mx-auto">

       <div className="grid md:grid-cols-3 gap-8 items-center md:items-center md:justify-items-center">

          {/* Left Text */}
         <div className="md:col-span-2 text-center md:text-left md:pr-10">
          <h2 className="text-4xl sm:text-5xl md:text-7xl leading-tight font-light tracking-tight max-w-3xl mx-auto md:mx-0">
              Verified Achievements
              <br />
              That Recruiters
              <br />
              <span className="bg-gradient-to-r from-orange-700 to-orange-500 bg-clip-text text-transparent">
                Can Trust 
                <br/>
                Instantly
              </span>
            </h2>
          </div>

          {/* Right Image */}
          <div className="flex justify-center">
            <img
              src={convocationHat}
              alt="Graduation Cap"
              className="h-56 sm:h-72 md:h-80 transition-transform duration-300 hover:scale-110" />
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-10 space-y-6">

          <button onClick={handleCTA} className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-600 to-orange-500 text-white shadow-lg transition-transform duration-200 hover:scale-105">
            {user ? "Go to Dashboard" : "Get Certified Instantly"}
            <ArrowRight size={16} />
          </button>

          <p className="text-gray-600 max-w-2xl mx-auto">
            AchievR eliminates slow offline certificate distribution by issuing
            instant digital certificates and automatically building a verified
            student portfolio.
          </p>
        </div>

      </div>
    </section>
  );
}