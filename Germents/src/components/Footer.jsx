import React from 'react';
import { Link } from 'react-router-dom';
import {
  FaInstagram,
  FaFacebookF,
  FaLinkedinIn,
  FaYoutube,
  FaMapMarkerAlt,
  FaEnvelope,
  FaPhoneAlt
} from 'react-icons/fa';
import logo from '../assets/Images/logo1.png';

const Footer = () => {
  return (

    <div className='overflow-hidden  px-3'>
    <footer className="bg-gray-100 text-gray-700 px-4 sm:px-6 md:px-16 pt-16 pb-10 ">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12">
        {/* Logo & Contact Info */}
        <div className="space-y-4">
          <Link to="/" className="flex items-center space-x-2">
            <img src={logo} alt="Jack Cruise Logo" className="h-10 sm:h-12 w-auto" />
            <span className="text-black text-lg sm:text-xl font-bold">JACK CRUISE</span>
          </Link>
          <p className="text-sm text-gray-600 max-w-xs leading-relaxed">
            Authorized manufacturer and marketer of premium quality innerwear and apparel.
          </p>
          <div className="mt-4 space-y-3 text-sm text-gray-600">
            <div className="flex items-start">
              <FaMapMarkerAlt className="mt-1 mr-3 flex-shrink-0 text-gray-500" />
              <address className="not-italic">
                Siddhartha Garments,<br />
                No. 192G, Abirami Nagar,<br />
                Saminathapuram 1st Street,<br />
                Gandhi Nagar Post,<br />
                Tirupur - 641 603,<br />
                Tamil Nadu, India.
              </address>
            </div>
            <div className="flex items-center">
              <FaEnvelope className="mr-3 text-gray-500" />
              <a href="mailto:info@jackcruise.in" className="hover:text-black transition">
                info@jackcruise.in
              </a>
            </div>
            <div className="flex items-center">
              <FaPhoneAlt className="mr-3 text-gray-500" />
              <a href="tel:+919363576725" className="hover:text-black transition">
                +91-9363576725
              </a>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div>
          <h2 className="text-black text-base font-semibold mb-4 border-b border-gray-300 pb-2">
            Shop
          </h2>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="text-black text-sm font-medium mb-2">Men</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><Link to="/men/innerwear" className="hover:text-black">Innerwear</Link></li>
                <li><Link to="/men/vests" className="hover:text-black">Vests</Link></li>
                <li><Link to="/men/top" className="hover:text-black">Tops</Link></li>
                <li><Link to="/men/bottom" className="hover:text-black">Bottoms</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-black text-sm font-medium mb-2">Women</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><Link to="/women/innerwear" className="hover:text-black">Innerwear</Link></li>
                <li><Link to="/women/vests" className="hover:text-black">Vests</Link></li>
                <li><Link to="/women/top" className="hover:text-black">Tops</Link></li>
                <li><Link to="/women/bottom" className="hover:text-black">Bottoms</Link></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Company Links */}
        <div>
          <h2 className="text-black text-base font-semibold mb-4 border-b border-gray-300 pb-2">
            Company
          </h2>
          <ul className="space-y-2 text-sm text-gray-600">
            <li><Link to="/about-us" className="hover:text-black">About Us</Link></li>
            <li><Link to="/contact-us" className="hover:text-black">Contact Us</Link></li>
            <li><Link to="/offers" className="hover:text-black">Offers</Link></li>
            {/* <li><Link to="/terms-and-conditions" className="hover:text-black">Terms & Conditions</Link></li>
            <li><Link to="/privacy-policy" className="hover:text-black">Privacy Policy</Link></li>
            <li><Link to="/refund-policy" className="hover:text-black">Refund Policy</Link></li> */}
          </ul>
        </div>

        {/* Newsletter & Social */}
        <div>
          <h2 className="text-black text-base font-semibold mb-4 border-b border-gray-300 pb-">
            Stay Connected
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            Subscribe to our newsletter for the latest updates and offers.
          </p>
          <form className="mb-6">
            <div className="flex flex-col sm:flex-row">
              <input
                type="email"
                placeholder="Your email address"
                required
                className="px-1 py-3 rounded-t-md sm:rounded-l-md sm:rounded-tr-none bg-gray-100 border border-gray-300 text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-b-md sm:rounded-r-md sm:rounded-bl-none mt-2 sm:mt-0 transition-colors"
              >
                Subscribe
              </button>
            </div>
          </form>
          <h3 className="text-black text-sm font-medium mb-3">Follow Us</h3>
          <div className="flex flex-wrap gap-3">
            <a href="https://www.instagram.com/gessdemn_globalservices/?hl=en" className="w-9 h-9 bg-gray-100 hover:bg-gray-200 flex items-center justify-center rounded-full" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
            <a href="https://www.facebook.com/share/16cX7kNSEf/" className="w-9 h-9 bg-gray-100 hover:bg-gray-200 flex items-center justify-center rounded-full" target="_blank" rel="noopener noreferrer"><FaFacebookF /></a>
            <a href="https://www.linkedin.com/company/gessdemn-global-services/?originalSubdomain=in" className="w-9 h-9 bg-gray-100 hover:bg-gray-200 flex items-center justify-center rounded-full" target="_blank" rel="noopener noreferrer"><FaLinkedinIn /></a>
            <a href="https://www.threads.net/@jackcruise_india" className="w-9 h-9 bg-gray-100 hover:bg-gray-200 flex items-center justify-center rounded-full" target="_blank" rel="noopener noreferrer"><FaYoutube /></a>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="mt-12 pt-6 border-t border-gray-300 text-center text-sm text-gray-500">
        <p>© {new Date().getFullYear()} Jack Cruise. All rights reserved.</p>
        {/* <p className="mt-1">Designed with ❤️ in India</p> */}
      </div>
      
    </footer>
    </div>
  );
};

export default Footer;
