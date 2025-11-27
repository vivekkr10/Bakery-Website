import React from "react";
import { motion } from "framer-motion";
import { Cake, Heart, ThumbsUp, Timer } from "lucide-react";

const WhyChooseUs = () => {
    const features = [
        {
            title: "Freshly Baked Everyday",
            desc: "We bake everything daily using premium ingredients for the best taste.",
            icon: <Cake size={36} className="text-[#c85a32]" />,
        },
        {
            title: "Loved by Customers",
            desc: "Our customers trust us for quality, taste, and consistency.",
            icon: <Heart size={36} className="text-[#c85a32]" />,
        },
        {
            title: "Top Quality Ingredients",
            desc: "Only the finest chocolates, creams, and dairy products are used.",
            icon: <ThumbsUp size={36} className="text-[#c85a32]" />,
        },
        {
            title: "On-Time Delivery",
            desc: "We deliver your cakes fresh and right on time for your celebrations.",
            icon: <Timer size={36} className="text-[#c85a32]" />,
        },
    ];

    return (
        <section className="bg-[#fff9f4]">
            <div className="py-20 px-6 md:px-10 max-w-7xl mx-auto">
                <motion.h2
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="text-4xl font-bold text-center text-[#c85a32] mb-12"
                >
                    Why Choose Us?
                </motion.h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{
                                duration: 0.6,
                                delay: index * 0.2,
                            }}
                            viewport={{ once: true }}
                            className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-2xl hover:-translate-y-2 transition-all"
                        >
                            <div className="flex justify-center mb-4">{item.icon}</div>
                            <h3 className="text-xl font-semibold text-[#b75a90] mb-2">
                                {item.title}
                            </h3>
                            <p className="text[#4a3f35]">{item.desc}</p>
                        </motion.div>
                    ))}
                </div>

                {/* Subtle floating decorative shapes */}
                <motion.div
                    className="absolute w-24 h-24 bg-pink-200 rounded-full blur-2xl opacity-40 -z-10 top-[200px] left-10"
                    animate={{ y: [0, -20, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                />
                <motion.div
                    className="absolute w-32 h-32 bg-yellow-200 rounded-full blur-2xl opacity-40 -z-10 top-[400px] right-12"
                    animate={{ y: [0, 25, 0] }}
                    transition={{ duration: 4, repeat: Infinity }}
                />
            </div>
        </section>
    );
};

export default WhyChooseUs;
