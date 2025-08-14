import React from "react";
import vdo from "../assets/Video/hero1.mp4"; // Ensure path is correct

const JackCriseCard = () => {
  return (
    <div className="w-full flex justify-center items-center min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 px-4 py-10 sm:px-6 md:px-8">
      <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full p-6 sm:p-8 transition-all duration-300 hover:shadow-gray-400">
        {/* Heading */}
    <h2 className="flex justify-center flex-wrap text-2xl sm:text-3xl md:text-5xl font-extrabold mb-6 sm:mb-8 tracking-wide gap-2 sm:gap-4">
  <span className="text-black">JACK CRUISE</span>
  <span className="text-gray-600">IS HERE</span>
</h2>


        {/* Video Container */}
        <div className="overflow-hidden rounded-xl border border-gray-300 hover:border-black transition duration-300">
          <video
            src={vdo}
            controls
            muted
            className="w-full h-[450px] sm:h-[300px] md:h-[400px] lg:h-[500px] object-cover rounded-xl"
          />
        </div>
      </div>
    </div>
  );
};

export default JackCriseCard;
