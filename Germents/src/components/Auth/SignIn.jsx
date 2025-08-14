import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { useLoginUserMutation } from '../../store/userApi';
import { setCredentials } from '../../store/authSlice';
const SignIn = ({ onClose, switchToSignUp }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const dispatch = useDispatch();
  const [loginUser] = useLoginUserMutation();
  const handleSignIn = (e) => {
    e.preventDefault();

    loginUser({ email, password })
      .unwrap()
      .then((user) => {
        dispatch(setCredentials(user));
        onClose();
      })
      .catch((error) => {
        setError(error.message);
      });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-2xl shadow-xl w-[90%] max-w-sm p-6 relative"
      >
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-2xl"
          onClick={onClose}
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Sign In</h2>

        <form className="space-y-4" onSubmit={handleSignIn}>
          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition"
          >
            Sign In
          </button>
        </form>

        {error && <p className="text-sm text-red-500 text-center mt-3">{error}</p>}

        <p className="text-sm text-center text-gray-600 mt-4">
          Don’t have an account?{' '}
          <button
            onClick={switchToSignUp}
            className="text-blue-600 hover:underline font-medium"
          >
            Sign Up
          </button>
        </p>
      </motion.div>
    </div>
  );
};

export default SignIn;
