import React from "react";
import { Link } from "react-router-dom";
import {
    FaEnvelope,
    FaLinkedin,
    FaInstagram,
    FaFacebook,
    FaMapMarkerAlt,
    FaArrowRight,
    FaPaperPlane,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

import logo from "../images/logo Black.png";

const Footer = () => {
    return (
        <footer className="bg-[#fff0e5] pt-16 pb-10 shadow-[0_10px_40px_rgba(0,0,0,0.1)] relative overflow-hidden">

            {/* Glow Decoration */}
            <div className="absolute -top-10 -right-10 w-52 h-52 bg-pink-200 rounded-full blur-3xl opacity-40"></div>
            <div className="absolute -bottom-10 -left-10 w-52 h-52 bg-yellow-200 rounded-full blur-3xl opacity-40"></div>

            <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-4 gap-12">

                {/* Logo + About */}
                <div>
                    <img src={logo} alt="Bakery Logo" className="h-14 mb-4 drop-shadow-md" />

                    <p className="text-sm text-gray-700 leading-relaxed mb-6">
                        Freshly baked happiness every day — Cakes, pastries, cookies & more.
                        Made with love for every celebration!
                    </p>

                    {/* Email */}
                    <div className="flex items-center gap-3 mt-4">
                        <div className="bg-[#c85a32] p-3 rounded-full shadow-lg">
                            <FaEnvelope className="text-white" />
                        </div>
                        <p className="text-sm">
                            Email us: <br />
                            <span className="font-semibold text-[#c85a32]"> Official@graphura.in</span>
                        </p>
                    </div>
                </div>

                {/* Quick Links */}
                <div>
                    <h3 className="text-xl font-semibold text-[#4a3f35] mb-4 relative 
                    after:block after:w-14 after:h-[3px] after:bg-[#b75a90] after:mt-1">
                        Quick Links
                    </h3>

                    <ul className="space-y-3 text-gray-700">
                        {[
                            { path: "/home", label: "Home" },
                            { path: "/about", label: "About Us" },
                            { path: "/cakes", label: "Our Cakes" },
                            { path: "/gallery", label: "Gallery" },
                            { path: "/contact", label: "Contact" },
                        ].map((item) => (
                            <li key={item.path}>
                                <Link
                                    to={item.path}
                                    className="flex items-center gap-2 hover:text-[#b75a90] transition"
                                >
                                    <FaArrowRight size={12} /> {item.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Bakery Services */}
                <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-4 relative 
                    after:block after:w-14 after:h-[3px] after:bg-[#b75a90] after:mt-1">
                        Services
                    </h3>

                    <ul className="space-y-3 text-[#4a3f35]">
                        {[
                            { path: "#", label: "Custom Cakes" },
                            { path: "#", label: "Birthday Cakes" },
                            { path: "#", label: "Wedding Cakes" },
                            { path: "#", label: "Party Catering" },
                            { path: "#", label: "Customize Cake" },
                        ].map((item) => (
                            <li key={item.path}>
                                <Link
                                    to={item.path}
                                    className="flex items-center gap-2 hover:text-[#b75a90] transition"
                                >
                                    <FaArrowRight size={12} /> {item.label}
                                </Link>
                            </li>
                        ))}
                    </ul>

                    {/* <ul className="space-y-3 text-gray-700">
                        <li className="flex items-center gap-2 hover:text-pink-500 transition">
                            <FaArrowRight size={12} /> Custom Cakes
                        </li>
                        <li className="flex items-center gap-2 hover:text-pink-500 transition">
                            <FaArrowRight size={12} /> Birthday Cakes
                        </li>
                        <li className="flex items-center gap-2 hover:text-pink-500 transition">
                            <FaArrowRight size={12} /> Wedding Cakes
                        </li>
                        <li className="flex items-center gap-2 hover:text-pink-500 transition">
                            <FaArrowRight size={12} /> Party Catering
                        </li>
                    </ul> */}
                </div>

                {/* Newsletter */}
                <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-4 relative 
                    after:block after:w-14 after:h-[3px] after:bg-[#b75a90] after:mt-1">
                        Newsletter
                    </h3>

                    <p className="text-sm text-gray-700 mb-4">
                        Get offers, bakery updates, and festive cake combos!
                    </p>

                    <div className="bg-white shadow-md rounded-full flex overflow-hidden">
                        <input
                            type="email"
                            className="flex-grow px-4 py-2 text-sm focus:outline-none"
                            placeholder="Enter your email"
                        />
                        <button className="bg-[#c85a32] px-4 py-2 text-white flex items-center justify-center hover:bg-[#b75a90] transition">
                            <FaPaperPlane size={16} />
                        </button>
                    </div>

                    {/* Subscribe Button */}
                    <button className="mt-4 bg-[#dfa26d] text-white hover:bg-[#e6b07c] px-6 py-2 rounded-full text-sm font-semibold shadow-md hover:shadow-lg hover:scale-105 transition">
                        Subscribe
                    </button>

                    {/* Social */}
                    <div className="flex gap-5 mt-6 text-xl text-gray-700">
                        {[FaLinkedin, FaInstagram, FaFacebook, FaXTwitter, FaMapMarkerAlt].map(
                            (Icon, i) => (
                                <a key={i} className="hover:text-[#e6b07c] transition cursor-pointer">
                                    <Icon />
                                </a>
                            )
                        )}
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="mt-10 py-4 bg-white/40 backdrop-blur-md rounded-xl">
                <p className="text-center text-sm text-[#4a3f35]">
                    © 2025 <span className="font-semibold text-[#c85a32]">Graphura India Private Limited</span> — All Rights Reserved.
                </p>
            </div>
        </footer>
    );
};

export default Footer;
