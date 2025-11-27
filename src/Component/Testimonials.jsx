import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const Testimonial = () => {
    const testimonials = [
        {
            name: "Aarav Sharma",
            message:
                "The cakes are unbelievably soft and fresh! Delivery was on time and the packaging was perfect. Highly recommended!",
            image:
                "https://i.pinimg.com/1200x/e8/09/8a/e8098a3d487b4fd7b8d591d7d9db32bb.jpg",
        },
        {
            name: "Priya Mehta",
            message:
                "Best bakery in town! Their cupcakes melt in your mouth. The staff is super friendly and helpful.",
            image:
                "https://i.pinimg.com/1200x/1c/85/2e/1c852ea928150dfcf54c5457dbca0a35.jpg",
        },
        {
            name: "Rohan Verma",
            message:
                "Ordered a birthday cake and everyone loved it! Beautiful design and great taste. Will order again!",
            image:
                "https://i.pinimg.com/736x/fc/af/7a/fcaf7aec4b7be05a0d062eff7851d2aa.jpg",
        },
        {
            name: "Aarav Sharma",
            message:
                "The cakes are unbelievably soft and fresh! Delivery was on time and the packaging was perfect. Highly recommended!",
            image:
                "https://i.pinimg.com/1200x/e8/09/8a/e8098a3d487b4fd7b8d591d7d9db32bb.jpg",
        },
        {
            name: "Priya Mehta",
            message:
                "Best bakery in town! Their cupcakes melt in your mouth. The staff is super friendly and helpful.",
            image:
                "https://i.pinimg.com/1200x/1c/85/2e/1c852ea928150dfcf54c5457dbca0a35.jpg",
        },
        {
            name: "Rohan Verma",
            message:
                "Ordered a birthday cake and everyone loved it! Beautiful design and great taste. Will order again!",
            image:
                "https://i.pinimg.com/736x/fc/af/7a/fcaf7aec4b7be05a0d062eff7851d2aa.jpg",
        },
    ];

    return (
        <section className="w-full py-20 bg-gradient-to-br from-[#fff9f4] via-[#f3e0d2] to-[#e8d3c5]">

            <div className="max-w-7xl mx-auto px-6 md:px-10 relative">

                {/* Faded Big Title */}
                <h1 className="absolute -top-[80px] left-1/2 -translate-x-1/2 
                text-[120px] md:text-[160px] font-extrabold 
                text-[#b75a90]/20 leading-none tracking-wider 
                select-none pointer-events-none ">
                    CLIENTS
                </h1>

                <h2 className="text-4xl md:text-5xl font-extrabold text-[#c85a32] mb-14 text-center">
                    Our Happy Clients
                </h2>

                <Swiper
                    modules={[Navigation, Pagination, Autoplay]}
                    autoplay={{ delay: 3000 }}
                    spaceBetween={40}
                    slidesPerView={1}
                    breakpoints={{
                        640: { slidesPerView: 1 },
                        768: { slidesPerView: 2 },
                        1024: { slidesPerView: 3 },
                    }}
                >
                    {testimonials.map((t, index) => (
                        <SwiperSlide key={index}>
                            <div className="bg-white backdrop-blur-lg 
                            p-8 border border-white/40 hover:shadow-2xl transition-all duration-300">

                                <div className="flex items-center gap-4 mb-4">
                                    <img
                                        src={t.image}
                                        alt={t.name}
                                        className="w-14 h-14 rounded-full object-cover shadow-md"
                                    />
                                    <h3 className="text-lg font-bold text-[#c85a32]">{t.name}</h3>
                                </div>

                                <p className="text-[#4a3f35] leading-relaxed">
                                    “{t.message}”
                                </p>

                                {/* Stars */}
                                <div className="flex gap-1 mt-4">
                                    {[1, 2, 3, 4, 5].map((s) => (
                                        <span key={s} className="text-yellow-400 text-xl">★</span>
                                    ))}
                                </div>

                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>

            </div>
        </section>
    );
};

export default Testimonial;
