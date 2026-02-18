import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function CTA({ user }) {
    const navigate = useNavigate();


    return (
        <section className="py-20 md:py-28 px-4 md:px-8 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden">

            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 right-0 w-72 md:w-96 h-72 md:h-96 bg-orange-600 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-0 left-0 w-72 md:w-96 h-72 md:h-96 bg-orange-500 rounded-full blur-3xl animate-pulse" />
            </div>

            <div className="max-w-4xl mx-auto text-center relative z-10">

                <h2 className="text-3xl sm:text-4xl md:text-5xl font-light text-white mb-6"> Ready to Go Digital with Event Certification </h2>

                <p className="text-gray-300 mb-8"> Join us for instant event certification and recruiter-ready portfolios. </p>

                <button onClick={() => navigate(
                    user ? user.role === "student"
                        ? "/dashboard"
                        : `/${user.role}`
                        : "/register"
                )}
                    className="inline-flex items-center gap-2 px-6 md:px-10 py-3 md:py-4 bg-gradient-to-r from-orange-600 to-orange-500 text-white shadow-xl hover:scale-105 transition" >
                    {user ? "Go to Dashboard" : "Start Digital Certification"}
                    <ArrowRight size={16} />
                </button>
            </div>
        </section>
    );
}