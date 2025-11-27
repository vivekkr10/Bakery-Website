import React from "react";

/* ------------------------------------
   MOST SELLING
------------------------------------ */
const mostSelling = [
    { name: "Chocolate Cake", image: "https://i.pinimg.com/736x/b4/84/95/b48495be28db56f015219bce5e043cbd.jpg" },
    { name: "Vanilla Cupcake", image: "https://i.pinimg.com/736x/d2/68/76/d268767e9fe329d7bea9bfb3da683a54.jpg" },
    { name: "Strawberry Pastry", image: "https://i.pinimg.com/736x/01/44/94/014494156f6c67fd57b47865b26e6f40.jpg" },
    { name: "Cold Coffee", image: "https://i.pinimg.com/1200x/1c/3e/33/1c3e336092ab4163db42571058aeefde.jpg" },
    { name: "Bread", image: "https://i.pinimg.com/736x/92/ea/6a/92ea6aadb018259547f9c939dfb1c9fb.jpg" },
];

/* ------------------------------------
   CATEGORY
------------------------------------ */
const categories = [
    { name: "Cakes", image: "https://i.pinimg.com/736x/fb/27/bc/fb27bc586c367fa23697850231e7d5ba.jpg" },
    { name: "Cupcakes", image: "https://i.pinimg.com/1200x/3e/58/c0/3e58c0e0e7da2edb2e8c877be1cf38d8.jpg" },
    { name: "Pastries", image: "https://i.pinimg.com/736x/ed/8a/57/ed8a571f46cc8631eec0dc20a62aa40b.jpg" },
    { name: "Breads", image: "https://i.pinimg.com/736x/11/16/fc/1116fc34ce3a03bdd0eaac01a2c981e0.jpg" },
    { name: "Beverages", image: "https://i.pinimg.com/736x/e8/5f/74/e85f74d7ded0bb6a0539072d82de1b0f.jpg" },
    { name: "Cookies", image: "https://i.pinimg.com/1200x/d4/21/65/d4216552edd56870fa5b0889ec2e51d4.jpg" },
    { name: "Donuts", image: "https://i.pinimg.com/1200x/ce/61/f0/ce61f06047443a9ad3f1263bfd548357.jpg" },
    { name: "Customize Orders", image: "https://i.pinimg.com/736x/fc/d6/3b/fcd63b206337c0ae63ced801cc81b675.jpg" },

];

const Category = () => {
    return (
        <section className="w-full pt-28 pb-20 bg-gradient-to-br from-[#fff9f4] via-[#f3e0d2] to-[#e8d3c5]"
        >
            <div className="max-w-7xl mx-auto px-6 md:px-10">

                {/* Most Selling ------------------------------------ */}
                <h2 className="text-4xl font-bold text-center text-[#8b5e3c] mb-12 drop-shadow-sm">
                    Most Selling Items
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-8 mb-20">
                    {mostSelling.map((item) => (
                        <div
                            key={item.name}
                            className="bg-white border border-[#e8d3c5] rounded-2xl p-5 shadow-md hover:shadow-xl transition duration-300"
                        >
                            <div className="w-full h-48 overflow-hidden rounded-xl">
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-full h-48 object-cover object-center"
                                />
                            </div>

                            <h3 className="font-semibold text-[#4a3f35] text-lg mt-3">
                                {item.name}
                            </h3>
                            <p className="text-[#8b5e3c] font-bold text-lg">{item.price}</p>
                        </div>
                    ))}
                </div>

                {/* Categories ------------------------------------ */}
                <h2 className="text-4xl font-bold text-center text-[#8b5e3c] mb-12 drop-shadow-sm">
                    Categories
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-8 mb-20">
                    {categories.map((cat) => (
                        <a
                            key={cat.name}
                            href=""
                            className="text-center bg-white  border border-[#e8d3c5] rounded-2xl p-4 shadow-md hover:shadow-xl transition duration-300"
                        >
                            <div className="w-full h-48 overflow-hidden rounded-xl">
                                <img
                                    src={cat.image}
                                    alt={cat.name}
                                    className="w-full h-full object-cover object-center"
                                />
                            </div>

                            <h3 className="mt-3 font-semibold text-[#4a3f35] text-xl">
                                {cat.name}
                            </h3>
                        </a>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Category;
