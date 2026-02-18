import React from "react";

export default function Testimonials() {
    return (
        <section className="py-20 md:py-28 px-4 md:px-8 bg-gradient-to-br from-gray-100 via-white to-gray-50">
            <div className="max-w-6xl mx-auto">

                <h2 className="text-3xl sm:text-4xl md:text-5xl font-light mb-12 md:mb-16">
                    Trusted by
                    <span className="block bg-gradient-to-r from-orange-700 to-orange-600 bg-clip-text text-transparent">
                        Leading Institutions
                    </span>
                </h2>

                <div className="grid md:grid-cols-2 gap-6 md:gap-12">

                    <Testimonial text="Certificate distribution that once took weeks is now completed within minutes. AchievR made our process fully digital and seamless." role="Academic Administrator" />

                    <Testimonial text="Students no longer wait for certificates after events. Their achievements are instantly verified and added to a professional portfolio." role="Event Coordinator" />

                </div>
            </div>
        </section>
    );
}

function Testimonial({ text, role }) {
    return (
        <div className="bg-white p-6 md:p-8 border-2 border-gray-300 rounded-xl hover:border-orange-400 shadow-lg hover:shadow-xl transition hover:scale-105">
            <p className="text-gray-700 italic mb-6">{text}</p>
            <p className="text-xs font-semibold text-orange-600 uppercase">~ {role}</p>
        </div>
    );
}