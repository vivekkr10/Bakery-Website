import React from "react";

const DeliverySection = () => {
    return (
        <section className="w-full py-20 bg-[#fff9f4]">
            <div className="max-w-7xl mx-auto px-6 md:px-10 flex flex-col md:flex-row items-center gap-12">

                {/* Text Section (Left) */}
                <div className="flex-1 relative">
                    {/* Large faded background text */}
                    <h1 className="absolute -top-15 left-0 text-[150px] font-extrabold text-[#b75a90]/20 leading-none tracking-wider select-none pointer-events-none">
                        FAST
                    </h1>

                    <h2 className="text-4xl md:text-5xl font-bold text-[#c85a32] leading-snug relative">
                        Fast & Fresh Delivery,
                        <br />
                        right to your doorstep
                    </h2>

                    <p className="mt-5 text-gray-700 text-lg leading-relaxed">
                        Enjoy bakery-fresh cakes, pastries, cupcakes, and more delivered straight to your home.
                        Our delivery partners ensure every order arrives on time, fresh, and handled with care.
                        Taste happiness without stepping out!
                    </p>

                    {/* Learn More */}
                    <button className="mt-6 text-[#c85a32] font-semibold text-lg flex items-center gap-2 hover:gap-3 transition-all duration-300">
                        Learn More
                        <span className="text-xl">→</span>
                    </button>
                </div>

                {/* Image Section (Right) */}
                <div className="flex-1">
                    <div className="overflow-hidden rounded-[2.5rem] shadow-2xl bg-[#b75a90]/60 backdrop-blur-md p-2">
                        <img
                            src="https://i.pinimg.com/736x/97/a9/8f/97a98f8f856e20ed0a23e807133dafa6.jpg"
                            alt="Delivery"
                            className="rounded-[2rem] object-cover w-full h-[340px]"
                        />
                    </div>
                </div>

            </div>
        </section>
    );
};

export default DeliverySection;
