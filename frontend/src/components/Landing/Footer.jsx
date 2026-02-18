import React from "react";
import achievrLogo from "../../assets/achievr-logo.png";

export default function Footer() {
    return (
        <footer className="border-t-2 border-gray-300 py-14 md:py-16 px-4 md:px-8 bg-white">
            <div className="max-w-6xl mx-auto">


                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 md:gap-12 mb-10 md:mb-12">

                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <img
                                src={achievrLogo}
                                alt="AchievR Logo"
                                className="h-12 md:h-16 w-auto" />
                        </div>

                        <p className="text-xs text-gray-600 font-light"> Your Verified Path to Opportunities </p>

                        {/* Dots */}
                        <div className="flex gap-2 mt-4">
                            <div className="w-2 h-2 rounded-full bg-gradient-to-r from-orange-600 to-orange-500" />
                            <div className="w-2 h-2 rounded-full bg-gradient-to-r from-orange-500 to-orange-400" />
                            <div className="w-2 h-2 rounded-full bg-gradient-to-r from-orange-400 to-orange-500" />
                        </div>
                    </div>

                    <FooterCol
                        title="Product"
                        links={["Features", "Pricing", "API"]} />

                    <FooterCol
                        title="Company"
                        links={["About", "Blog", "Contact"]} />

                    <FooterCol
                        title="Legal"
                        links={["Privacy", "Terms"]} />
                </div>

                <div className="border-t border-gray-200 pt-6 md:pt-8 text-center">
                    <p className="text-xs text-gray-900 font-light">
                        © 2025 AchievR. All rights reserved. Developed by Hack Titans
                        (Shashank & Omkar)
                    </p>
                </div>
            </div>
        </footer>
    );
}

function FooterCol({ title, links }) {
    return (
        <div>
            <p className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-4">
                {title}
            </p>

            <ul className="space-y-2 text-sm text-gray-600 font-light">
                {links.map((link) => (
                    <li key={link}>
                        <a href="#" className="hover:text-orange-600 transition">
                            {link}
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
}