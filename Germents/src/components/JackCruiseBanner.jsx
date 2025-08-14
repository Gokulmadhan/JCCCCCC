import React from "react";
import { bg } from "../assets/Images/images"; // Make sure this path is correct

const JackCruiseBanner = () => {
  return (
    <div className="relative w-full h-[250px] sm:h-[320px] md:h-[400px] lg:h-[500px] rounded-xl overflow-hidden flex items-center justify-center p-2 sm:p-4">
      {/* Background Image */}
      <img
        src={bg}
        alt="Background"
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
      />

      {/* Overlay Content */}
      <div className="absolute z-10 text-center text-black px-2 sm:px-4">
        <h2 className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-extrabold leading-snug sm:leading-tight">
          JACK CRUISE
        </h2>
        <h3 className="text-sm sm:text-lg md:text-2xl lg:text-3xl font-semibold mt-1 sm:mt-3">
          WHERE COMFORT MEETS CONFIDENCE
        </h3>
        <p className="mt-1 sm:mt-2 text-xs sm:text-sm md:text-base font-medium max-w-xs sm:max-w-md mx-auto">
          Elevate your everyday style with fashion-forward comfort for all.
        </p>

        <button className="mt-1 sm:mt-5 px-1 sm:px-6 py-2 sm:py-2.5 border ml-8 border-black rounded-md hover:bg-black hover:text-white transition duration-300 text-xs sm:text-sm md:text-base font-semibold w-fit mx-auto">
          SHOP NOW
        </button>
      </div>
    </div>
  );
};

export default JackCruiseBanner;
