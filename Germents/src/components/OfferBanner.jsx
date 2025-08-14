import React from 'react';

const OfferPage = () => {
  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col items-center px-4 py-12">
      <div className="text-center space-y-4">
        <button className="bg-gray-800 text-white px-4 py-1 rounded-full text-sm font-semibold">
          Limited Time Offer - Up to 50% OFF
        </button>
        <h1 className="text-4xl font-bold text-gray-900">
          2024 <span className="text-gray-800">ACTIVEWEAR</span> DEALS
        </h1>
        <p className="max-w-xl text-sm text-gray-600 mx-auto mt-2">
          Celebrate the end of the year in style! 🏋️‍♀️ Enjoy unbeatable deals on our premium range of activewear for all fitness lovers.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12 w-full max-w-7xl px-4">
        {/* Box 1 */}
        <div className="bg-gradient-to-br from-purple-100 to-gray-100 p-6 rounded-xl border border-purple-300 shadow-md text-center">
          <div className="text-sm font-medium bg-gray-800 text-white rounded-full px-3 py-1 inline-block mb-4">
            Gym Essentials
          </div>
          <h2 className="text-2xl font-bold mb-2 text-gray-800">25% OFF</h2>
          <p className="text-sm text-gray-700">Stay fit in style with 25% off on gym tops, joggers, and sports bras.</p>
        </div>

        {/* Box 2 */}
        <div className="bg-gradient-to-br from-purple-100 to-gray-100 p-6 rounded-xl border border-purple-300 shadow-md text-center">
          <div className="text-sm font-medium bg-gray-800 text-white rounded-full px-3 py-1 inline-block mb-4">
            Yoga Collection
          </div>
          <h2 className="text-2xl font-bold mb-2 text-gray-800">30% OFF</h2>
          <p className="text-sm text-gray-700">Enjoy 30% off on breathable yoga pants, tanks, and sets.</p>
        </div>

        {/* Box 3 */}
        <div className="bg-gradient-to-br from-purple-100 to-gray-100 p-6 rounded-xl border border-purple-300 shadow-md text-center">
          <div className="text-sm font-medium bg-gray-800 text-white rounded-full px-3 py-1 inline-block mb-4">
            Men's Activewear
          </div>
          <h2 className="text-2xl font-bold mb-2 text-gray-800">Buy 1 Get 1</h2>
          <p className="text-sm text-gray-700">Grab your favorite tees and shorts — buy 1, get 1 free!</p>
        </div>

        {/* Box 4 */}
        <div className="bg-gradient-to-br from-purple-100 to-gray-100 p-6 rounded-xl border border-purple-300 shadow-md text-center">
          <div className="text-sm font-medium bg-gray-800 text-white rounded-full px-3 py-1 inline-block mb-4">
            New Arrivals
          </div>
          <h2 className="text-2xl font-bold mb-2 text-gray-800">Flat ₹499</h2>
          <p className="text-sm text-gray-700">Grab trending activewear sets starting at just ₹499 for a limited time.</p>
        </div>
      </div>
    </div>
  );
};

export default OfferPage;
