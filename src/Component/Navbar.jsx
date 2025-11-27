import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import logo from "../images/logo Black.png"

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    // Detect scroll for shadow and background intensity
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const menuItems = ["Home", "Menu", "About", "Gallery", "Contact"];

    return (
        <nav
            className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 
        ${scrolled
                    ? "backdrop-blur-xl shadow-xl bg-white/30 border-white/40"
                    : "bg-[#fff0e5]"
                }
`}
        >
            <div className="max-w-7xl mx-auto px-6 md:px-10 flex justify-between items-center h-20">

                {/* Logo */}
                <div className="flex items-center cursor-pointer select-none transition-transform duration-300 hover:scale-110">
                    <img
                        src={logo}
                        alt="Bakery Logo"
                        className="h-14 w-auto object-contain drop-shadow-md"
                    />
                </div>

                {/* Desktop Menu */}
                <ul className="hidden md:flex space-x-10 text-[#c85a32] font-semibold">
                    {menuItems.map((item) => (
                        <li
                            key={item}
                            className="relative group cursor-pointer tracking-wide"
                        >
                            <span className="group-hover:text-[#dfa26d] transition-colors duration-300">
                                {item}
                            </span>

                            {/* underline animation */}
                            <span
                                className="absolute left-0 -bottom-1 w-0 h-0.5 bg-[#dfa26d] rounded-full 
                       group-hover:w-full transition-all duration-300"
                            />
                        </li>
                    ))}
                </ul>

                {/* Order Button */}
                <div className="hidden md:flex items-center gap-4">
                    <button
                        className="bg-[#dfa26d] 
          text-white px-6 py-2 rounded-full shadow-lg font-semibold hover:bg-[#e8b67b] hover:text-white 
          hover:shadow-xl hover:scale-105 transition-all duration-300"
                    >
                        Order Now
                    </button>

                    <button
                        className="bg-white text-[#dfa26d] border-2 border-[#dfa26d] 
          px-6 py-2 rounded-full shadow-lg font-semibold
          hover:bg-[#e8b67b] hover:text-white hover:scale-105 transition-all duration-300"
                    >
                        Login Now
                    </button>
                </div>

                {/* Mobile Toggle */}
                <div className="md:hidden cursor-pointer text-gray-800" onClick={() => setIsOpen(!isOpen)}>
                    {isOpen ? <X size={28} /> : <Menu size={28} />}
                </div>
            </div>

            {/* Mobile Menu */}
            <div className={`md:hidden transition-all duration-500 overflow-hidden 
            ${isOpen ? "max-h-96 py-4" : "max-h-0"}`}>
                <ul className="flex flex-col space-y-4 px-6 text-gray-700 font-semibold">
                    {menuItems.map((item) => (
                        <li
                            key={item}
                            className="hover:text-pink-600 cursor-pointer transition-colors duration-300"
                        >
                            {item}
                        </li>
                    ))}

                    <button
                        className="bg-white text-[#dfa26d] border-2 border-[#dfa26d]  hover:bg-[#e8b67b]  px-6 py-2 rounded-full shadow-lg transition-transform hover:scale-105 duration-300"
                    >
                        Order Now
                    </button>
                    <button
                        className="bg-white text-[#dfa26d] border-2 border-[#dfa26d]  hover:bg-[#e8b67b] 
                 px-6 py-2 rounded-full shadow-lg
                   transition-transform hover:scale-105 duration-300"
                    >
                        Login Now
                    </button>
                </ul>
            </div>
        </nav>


    );
};

export default Navbar;
