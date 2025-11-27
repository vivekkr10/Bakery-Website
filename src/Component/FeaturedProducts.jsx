import React from "react";
import { motion } from "framer-motion";

const featuredProducts = [
    {
        name: "Chocolate Truffle Cake",
        price: "$25",
        tagline: "Rich • Moist • Melt-in-Your-Mouth",
        description:
            "A premium dark-chocolate layered cake filled with velvety truffle cream, crafted using 100% pure cocoa. Perfect for celebrations and chocolate lovers.",
        specials: [
            "Belgian dark chocolate",
            "Smooth truffle ganache layers",
            "Freshly baked everyday",
            "No preservatives"
        ],
        image:
            "https://i.pinimg.com/1200x/e4/08/f1/e408f15c8b5d5a39a352ae2178c3c3a7.jpg"
    },
    {
        name: "Vanilla Buttercream Cupcake",
        price: "$10",
        tagline: "Soft, Sweet & Simply Irresistible",
        description:
            "A light and fluffy vanilla cupcake topped with silky buttercream frosting. A timeless classic made with pure vanilla extract.",
        specials: [
            "Hand-mixed fluffy batter",
            "Madagascar vanilla",
            "Kid-friendly favorite",
            "Premium buttercream frosting"
        ],
        image:
            "https://i.pinimg.com/1200x/6d/8e/43/6d8e435c6058a421101452aa82214de7.jpg"
    },
    {
        name: "Strawberry Pastry",
        price: "$12",
        tagline: "Fresh Strawberries in Every Bite",
        description:
            "Soft sponge pastry layered with whipped cream and real strawberries. Light, fruity, and perfect for summer cravings.",
        specials: [
            "Real strawberry puree",
            "Light whipped cream",
            "Soft airy sponge",
            "Perfect refreshing treat"
        ],
        image:
            "https://i.pinimg.com/1200x/30/29/3f/30293f670a7fb51be8ad92b05bf0a566.jpg"
    }
];

// Motion variants
const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.7, ease: "easeOut" }
    }
};

const containerStagger = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.25
        }
    }
};

const FeaturedProducts = () => {
    return (
        <section className="py-24 relative bg-gradient-to-br from-[#fff9f4] via-[#f3e0d2] to-[#e8d3c5] overflow-hidden">

            {/* Background Giant Title */}
            {/* <motion.h1
                initial={{ opacity: 0, y: -40 }}
                whileInView={{ opacity: 0.15, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="absolute top-6 left-1/2 -translate-x-1/2 
      text-[65px] sm:text-[110px] md:text-[160px] font-extrabold 
      text-[#b75a90]/20 tracking-wider whitespace-nowrap select-none pointer-events-none"
            >
                Featured Products
            </motion.h1> */}

            {/* Section Heading */}
            <motion.h2
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="text-3xl sm:text-4xl font-bold text-center text-[#8b5e3c] mb-16 drop-shadow-sm relative z-10"
            >
                Featured Products
            </motion.h2>

            {/* Product Grid */}
            <motion.div
                variants={containerStagger}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="relative z-10 max-w-7xl mx-auto px-6 grid sm:grid-cols-2 md:grid-cols-3 gap-10 md:gap-12"
            >
                {featuredProducts.map((item, idx) => (
                    <motion.div
                        variants={fadeUp}
                        key={idx}
                        whileHover={{ scale: 1.03, translateY: -6 }}
                        transition={{ type: "spring", stiffness: 200 }}
                        className="bg-[#fff9f4] rounded-2xl shadow-xl overflow-hidden 
              border border-[#c89f7a]/40 hover:shadow-2xl transition-all duration-300"
                    >
                        {/* Image */}
                        <motion.img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-56 sm:h-64 object-cover rounded-t-2xl"
                            whileHover={{ scale: 1.08 }}
                            transition={{ duration: 0.4 }}
                        />

                        {/* Content */}
                        <div className="p-6">
                            <h3 className="text-xl sm:text-2xl font-bold text-[#8b5e3c]">
                                {item.name}
                            </h3>

                            <p className="text-[#8b5e3c] mt-1 italic">{item.tagline}</p>

                            <p className="mt-3 text-[#6f472b] leading-relaxed text-sm">
                                {item.description}
                            </p>

                            {/* Price + Order Button */}
                            <div className="mt-6 flex justify-between items-center">
                                <span className="text-lg sm:text-xl font-bold text-[#8b5e3c]">
                                    {item.price}
                                </span>

                                <motion.button
                                    whileTap={{ scale: 0.92 }}
                                    className="bg-[#c89f7a] text-white px-4 py-2 rounded-xl 
                hover:bg-[#e6b07c] transition text-sm sm:text-base"
                                >
                                    Order Now
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </motion.div>
        </section>
    );
};

export default FeaturedProducts;
