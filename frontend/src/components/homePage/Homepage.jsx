import React, { useEffect, useState } from "react";
import cake from "../../assets/homePage/HeroCake3.png";
import { motion } from "framer-motion";
import Category from "./Category";
import ChefSection from "./ChefSection";
import DeliverySection from "./DeliverySection";
import Testimonial from "./Testimonials";
import WhyChooseUs from "./WhyChooseUs";
import FeaturedProducts from "./FeaturedProducts";
import { Link } from "react-router-dom";
import CakeCustomize from "./CakeCustomize";
import WhatsappButton from "./WhatsappButton";

const Homepage = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreen = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreen();
    window.addEventListener("resize", checkScreen);

    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  return (
    <div>
      {/* ================= HERO SECTION ================= */}

      {/* 📱 MOBILE VIEW */}
      {isMobile && (
        <section className="w-full bg-[#e2bf9d] pt-24 pb-10 min-h-[80vh]">
          <div className="px-4 text-center space-y-6">
            {/* HEADING */}
            <motion.h1
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl font-extrabold text-[#c85a32] leading-tight"
            >
              Bringing You Happiness <br />
              Through a Piece of Cake, <br />
              <span className="text-[#b75a90]">Delivered Daily!</span>
            </motion.h1>

            {/* CAKE IMAGE */}
            <motion.img
              src={cake}
              alt="Cake"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mx-auto w-full max-w-xs drop-shadow-2xl"
            />

            {/* DESCRIPTION */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-base text-[#4a3f35]"
            >
              Explore our delicious cupcakes, pastries, cakes & custom bakery
              treats made fresh with love every single day.
            </motion.p>

            {/* BUTTONS */}
            <div className="flex justify-center gap-4">
              <Link to="/order">
                <button className="px-6 py-2 rounded-full bg-gradient-to-r from-[#dda56a] to-[#e8b381] text-white font-semibold shadow-lg">
                  Order
                </button>
              </Link>

              <Link to="/menu">
                <button className="px-6 py-2 rounded-full bg-white text-[#8b5e3c] font-semibold shadow-lg">
                  Explore Menu
                </button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* 💻 DESKTOP VIEW (UNCHANGED) */}
      {!isMobile && (
        <section className="w-full bg-[#e2bf9d] pt-24 md:pt-32 pb-10 min-h-[80vh] flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 flex flex-row items-center justify-between gap-10">
            {/* LEFT TEXT */}
            <div className="flex-1 text-left">
              <motion.h1
                initial={{ opacity: 0, y: -40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
                className="text-5xl lg:text-6xl font-extrabold text-[#c85a32]"
              >
                Bringing You Happiness <br />
                Through a Piece of Cake, <br />
                <span className="text-[#b75a90]">Delivered Daily!</span>
              </motion.h1>

              <p className="mt-4 text-xl text-[#4a3f35] max-w-xl">
                Explore our delicious cupcakes, pastries, cakes & custom bakery
                treats made fresh with love every single day.
              </p>

              <div className="mt-6 flex gap-4">
                <Link to="/order">
                  <button className="px-6 py-2 rounded-full bg-gradient-to-r from-[#dda56a] to-[#e8b381] text-white font-semibold shadow-lg">
                    Order
                  </button>
                </Link>

                <Link to="/menu">
                  <button className="px-6 py-2 rounded-full bg-white text-[#8b5e3c] font-semibold shadow-lg">
                    Explore Menu
                  </button>
                </Link>
              </div>
            </div>

            {/* RIGHT IMAGE */}
            <div className="flex-1 flex justify-center">
              <motion.img
                src={cake}
                alt="Cake"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1 }}
                className="w-full max-w-lg drop-shadow-2xl"
              />
            </div>
          </div>
        </section>
      )}

      {/* ================= OTHER SECTIONS ================= */}
      <WhatsappButton />
      <WhyChooseUs />
      <Category />
      <ChefSection />
      <FeaturedProducts />
      <DeliverySection />
      <Testimonial />
      <CakeCustomize />
    </div>
  );
};

export default Homepage;
