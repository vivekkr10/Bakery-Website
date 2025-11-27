import { OrbitControls } from '@react-three/drei'
import React from 'react'
import Navbar from './Navbar'
import cake from "../images/HeroCake3.png"
import { motion } from "framer-motion";
import Category from './Category';
import Footer from './Footer';
import ChefSection from './ChefSection';
import DeliverySection from './DeliverySection';
import Testimonial from './Testimonials';
import WhyChooseUs from './WhyChooseUs';
import FeaturedProducts from './FeaturedProducts';

const Homepage = () => {
    return (
        <div className=''>
            <Navbar />

            <section className="w-full bg-gradient-to-br from-[#fff9f4] via-[#f3e0d2] to-[#e8d3c5]
 pt-15 min-h-[90vh] flex items-center">
                <div className="max-w-7xl mx-auto px-6 md:px-10 flex flex-col md:flex-row items-center justify-between gap-10">

                    {/* Left Text Section */}
                    <div className="flex-1 text-center md:text-left">
                        <motion.h1
                            initial={{ opacity: 0, y: -40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className="text-4xl md:text-6xl font-extrabold text-[#c85a32] leading-tight drop-shadow-lg "
                        >
                            Bring you Happiness
                            through a piece of cake
                            <span className="text-[#b75a90]"> Delivered Daily!</span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1.2, ease: "easeOut" }}
                            className="mt-4 text-lg md:text-xl text-[#4a3f35]"
                        >
                            Explore our delicious cupcakes, pastries, cakes & custom bakery treats
                            made fresh with love.
                        </motion.p>

                        <div className="mt-6 flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start">
                            {/* Primary Button */}
                            <button className="px-6 py-3 bg-[#dfa26d] text-white hover:bg-[#e6b07c] font-semibold rounded-full shadow-lg  hover:scale-105 transition-all">
                                Order Now
                            </button>


                            {/* Secondary Button */}
                            <button className="px-6 py-3 bg-[#dfa26d] text-white font-semibold rounded-full hover:scale-105 transition-all">
                                View Menu
                            </button>
                        </div>
                    </div>

                    {/* Right Image Section */}
                    <div className="flex-1">
                        <motion.img
                            src={cake}
                            alt="Cake"
                            className="w-full max-w-md mx-auto drop-shadow-2xl"
                        />
                    </div>
                </div>
            </section>
            <WhyChooseUs />
            <Category />
            <ChefSection />
            <FeaturedProducts />
            <DeliverySection />
            <Testimonial />
            <Footer />
        </div>
    )
}

export default Homepage