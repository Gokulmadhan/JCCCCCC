import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FaShoppingCart,
  FaSearch,
  FaBars,
  FaTimes,
  FaFacebookF,
  FaInstagram,
  FaWhatsapp,
  FaBoxOpen,
  FaChevronDown,
  FaChevronUp,
} from 'react-icons/fa';
import logo from '../assets/Images/logo1.png';
import SignInModal from '../components/Auth/SignIn';
import SignUpModal from '../components/Auth/SignUp';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/authSlice';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showMenSubmenu, setShowMenSubmenu] = useState(false);
  const [showWomenSubmenu, setShowWomenSubmenu] = useState(false);
  const [authType, setAuthType] = useState(null);
  const user = useSelector((state) => state.jc_auth.user);
  const dispatch = useDispatch();

  const closeAuthModal = () => setAuthType(null);
  const handleLogout = () => dispatch(logout());

  return (
    <div className='overflow-hidden'>
      {/* Social Icons */}
      <div className="fixed top-1/3 left-0 z-50 flex flex-col items-center space-y-3 px-2">
        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="bg-white text-black p-2 md:p-3 rounded-full hover:bg-blue-600 transition"><FaFacebookF /></a>
        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="bg-white text-black p-2 md:p-3 rounded-full hover:bg-pink-500 transition"><FaInstagram /></a>
        <a href="https://wa.me/your-number" target="_blank" rel="noopener noreferrer" className="bg-white text-black p-2 md:p-3 rounded-full hover:bg-green-500 transition"><FaWhatsapp /></a>
      </div>

      {/* Navbar */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img src={logo} alt="Logo" className="h-10 w-auto" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6 text-[15px] font-medium text-gray-800">
            <Link to="/" className="hover:text-blue-600 transition">Home</Link>

            <div className="relative group">
              <span className="hover:text-blue-600 transition cursor-pointer">Men</span>
              <div className="absolute left-0 mt-2 w-40 bg-white rounded-md shadow-lg opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all duration-200 z-50">
                <Link to="/category/men/tops" className="block px-4 py-2 hover:bg-blue-100">Tops</Link>
                <Link to="/category/men/bottoms" className="block px-4 py-2 hover:bg-blue-100">Bottoms</Link>
                <Link to="/category/men/innerwear" className="block px-4 py-2 hover:bg-blue-100">Innerwear</Link>
                <Link to="/category/men/vests" className="block px-4 py-2 hover:bg-blue-100">Vests</Link>
                <Link to="/category/men/activewear" className="block px-4 py-2 hover:bg-blue-100">Activewear</Link>
              </div>
            </div>

            <div className="relative group">
              <span className="hover:text-pink-600 transition cursor-pointer">Women</span>
              <div className="absolute left-0 mt-2 w-40 bg-white rounded-md shadow-lg opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all duration-200 z-50">
                <Link to="/category/women/tops" className="block px-4 py-2 hover:bg-pink-100">Tops</Link>
                <Link to="/category/women/bottoms" className="block px-4 py-2 hover:bg-pink-100">Bottoms</Link>
                <Link to="/category/women/innerwear" className="block px-4 py-2 hover:bg-pink-100">Innerwear</Link>
                <Link to="/category/women/vests" className="block px-4 py-2 hover:bg-pink-100">Vests</Link>
                <Link to="/category/women/activewear" className="block px-4 py-2 hover:bg-pink-100">Activewear</Link>
              </div>
            </div>

            <Link to="/offers" className="hover:text-red-500 transition">Offers</Link>
            <Link to="/about" className="hover:text-gray-600 transition">About Us</Link>
            <FaSearch className="cursor-pointer hover:text-blue-500" />
            <Link to="/CartPage" className="hover:text-green-500 transition">
              <FaShoppingCart className="cursor-pointer" />
            </Link>

            {user ? (
              <>
                <span className="text-blue-600 font-semibold">{user.name}</span>
                <button onClick={handleLogout} className="text-red-500 hover:underline ml-2">Logout</button>
              </>
            ) : (
              <>
                <button onClick={() => setAuthType('login')} className="text-blue-600 hover:underline">Login</button>
                <button onClick={() => setAuthType('register')} className="text-blue-600 hover:underline">Register</button>
              </>
            )}

            <Link to="/my-orders" className="hover:text-purple-600 transition flex items-center space-x-1">
              <FaBoxOpen className="text-lg" />
              <span>My Orders</span>
            </Link>
          </div>

          {/* Hamburger */}
          <div className="md:hidden">
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-gray-800 focus:outline-none">
              {mobileMenuOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        <div className={`md:hidden fixed top-[64px] left-0 w-full bg-white shadow-lg z-40 transition-all duration-300 ${mobileMenuOpen ? 'max-h-screen py-4' : 'max-h-0 overflow-hidden'}`}>
          <div className="flex flex-col px-6 space-y-4 text-[15px] font-medium text-gray-700">
            <Link to="/" onClick={() => setMobileMenuOpen(false)} className="hover:text-blue-600">Home</Link>

            {/* Men Toggle */}
            <div>
              <button onClick={() => setShowMenSubmenu(!showMenSubmenu)} className="flex justify-between w-full items-center text-left">
                <span className="hover:text-blue-600">Men</span>
                {showMenSubmenu ? <FaChevronUp /> : <FaChevronDown />}
              </button>
              {showMenSubmenu && (
                <div className="pl-4 space-y-1 mt-2">
                  <Link to="/category/men/tops" onClick={() => setMobileMenuOpen(false)} className="block hover:text-blue-600">Tops</Link>
                  <Link to="/category/men/bottoms" onClick={() => setMobileMenuOpen(false)} className="block hover:text-blue-600">Bottoms</Link>
                  <Link to="/category/men/innerwear" onClick={() => setMobileMenuOpen(false)} className="block hover:text-blue-600">Innerwear</Link>
                  <Link to="/category/men/vests" onClick={() => setMobileMenuOpen(false)} className="block hover:text-blue-600">Vests</Link>
                  <Link to="/category/men/activewear" onClick={() => setMobileMenuOpen(false)} className="block hover:text-blue-600">Activewear</Link>
                </div>
              )}
            </div>

            {/* Women Toggle */}
            <div>
              <button onClick={() => setShowWomenSubmenu(!showWomenSubmenu)} className="flex justify-between w-full items-center text-left">
                <span className="hover:text-pink-600">Women</span>
                {showWomenSubmenu ? <FaChevronUp /> : <FaChevronDown />}
              </button>
              {showWomenSubmenu && (
                <div className="pl-4 space-y-1 mt-2">
                  <Link to="/category/women/tops" onClick={() => setMobileMenuOpen(false)} className="block hover:text-pink-600">Tops</Link>
                  <Link to="/category/women/bottoms" onClick={() => setMobileMenuOpen(false)} className="block hover:text-pink-600">Bottoms</Link>
                  <Link to="/category/women/innerwear" onClick={() => setMobileMenuOpen(false)} className="block hover:text-pink-600">Innerwear</Link>
                  <Link to="/category/women/vests" onClick={() => setMobileMenuOpen(false)} className="block hover:text-pink-600">Vests</Link>
                  <Link to="/category/women/activewear" onClick={() => setMobileMenuOpen(false)} className="block hover:text-pink-600">Activewear</Link>
                </div>
              )}
            </div>

            <Link to="/offers" onClick={() => setMobileMenuOpen(false)} className="hover:text-red-500">Offers</Link>
            <Link to="/about" onClick={() => setMobileMenuOpen(false)} className="hover:text-gray-600">About Us</Link>
            <Link to="/CartPage" onClick={() => setMobileMenuOpen(false)} className="hover:text-green-500">Cart</Link>

            {user ? (
              <>
                <span className="text-blue-600 font-semibold">Hi, {user.name}</span>
                <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }} className="text-red-500">Logout</button>
              </>
            ) : (
              <>
                <button onClick={() => { setAuthType('login'); setMobileMenuOpen(false); }} className="text-blue-600">Login</button>
                <button onClick={() => { setAuthType('register'); setMobileMenuOpen(false); }} className="text-blue-600">Register</button>
              </>
            )}

            <Link to="/my-orders" onClick={() => setMobileMenuOpen(false)} className="hover:text-purple-600 flex items-center space-x-2">
              <FaBoxOpen />
              <span>My Orders</span>
            </Link>

            <div className="flex space-x-4 pt-3">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="bg-white text-black p-2 rounded-full hover:bg-blue-600 transition"><FaFacebookF /></a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="bg-white text-black p-2 rounded-full hover:bg-pink-500 transition"><FaInstagram /></a>
              <a href="https://wa.me/your-number" target="_blank" rel="noopener noreferrer" className="bg-white text-black p-2 rounded-full hover:bg-green-500 transition"><FaWhatsapp /></a>
            </div>
          </div>
        </div>
      </nav>

      {/* Auth Modals */}
      {authType === 'login' && <SignInModal onClose={closeAuthModal} switchToSignUp={() => setAuthType('register')} />}
      {authType === 'register' && <SignUpModal onClose={closeAuthModal} switchToSignIn={() => setAuthType('login')} />}
    </div>
  );
};

export default Navbar;
