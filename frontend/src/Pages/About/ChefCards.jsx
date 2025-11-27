import React, { useState } from "react";
import { card } from "../../assets/assets";
import Title from "./Title";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";

const ChefCards = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? card.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === card.length - 1 ? 0 : prevIndex + 1
    );
  };

  const currentCard = card[currentIndex];

  return (
    <>
      <div className="flex flex-col lg:flex-row md:m-10 lg:m-0 items-center justify-center gap-5 transition-all duration-500 ease-in-out relative chefCards">
        {/* Left Button */}
        <button
          onClick={handlePrev}
          className="absolute left-2 sm:left-5 md:left-0 transform -translate-x-1/2 top-1/2 bg-[#dfa26d] text-white p-2 rounded-[50%] shadow-lg focus:outline-none cursor-pointer hover:bg-[#f19b50]"
        >
          <MdKeyboardArrowLeft className="text-3xl" />
        </button>

        <img
          className="max-w-xl rounded-xl h-auto w-[90%] sm:w-full object-cover object-center"
          src={currentCard.image}
          alt="Card image"
        />
        
        <div className="px-5 rounded-xl py-10 sm:mx-15 md:mx-0">
          {/* Title and Subtitle */}
          <div className="text-center sm:text-start">
            <Title
              title={currentCard.title}
              subTitle={currentCard.description}
            />
          </div>

          <div className="flex flex-col gap-5 mt-6">
            {/* Timing of opening and closing */}
            <h2 className="text-xl font-extrabold text-[#091e2e] style">{currentCard.heading}</h2>
            {currentCard.timings.map((timing, index) => (
              <div key={index} className="flex justify-between text-[12px] sm:text-[16px]">
                <span className="font-small">{timing.day}</span>
                <span className="text-[#604a4c]">{timing.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* <div className="yellow-circle absolute -right-5 top-15 blur-xl"></div> */}
        
        {/* Right Button */}
        <button
          onClick={handleNext}
          className="absolute right-2 sm:right-5 md:right-0 transform translate-x-1/2 top-1/2 bg-[#dfa26d] text-white p-2 rounded-full shadow-lg focus:outline-none cursor-pointer hover:bg-[#f19b50]"
        >
          <MdKeyboardArrowRight className="text-3xl" />
        </button>
      </div>
    </>
  );
};

export default ChefCards;
