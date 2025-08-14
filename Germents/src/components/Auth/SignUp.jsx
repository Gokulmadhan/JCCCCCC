import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useDispatch } from 'react-redux';
import { useCreateUserMutation } from '../../store/userApi';
import { setCredentials } from '../../store/authSlice';

const SignUp = ({ onClose, switchToSignIn }) => {
  const dispatch = useDispatch();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  const [createUser, { isLoading }] = useCreateUserMutation();

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      const userData = { name, email, phone, password };
      const res = await createUser(userData).unwrap();

      // Save user data to Redux
      dispatch(setCredentials(res));

      alert('Registration successful!');
      switchToSignIn(); // Switch to login
    } catch (err) {
      alert(err?.data?.message || 'Signup failed');
      console.error('Signup error:', err);
    }
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
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Create Account
        </h2>

        <form className="space-y-4" onSubmit={handleSignUp}>
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none"
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none"
            required
          />
          <input
            type="text"
            placeholder="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none"
            required
          />

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200"
          >
            {isLoading ? 'Creating...' : 'Sign Up'}
          </button>
        </form>

        <p className="text-sm mt-4 text-center text-gray-600">
          Already have an account?{' '}
          <button
            className="text-blue-600 font-medium underline"
            onClick={switchToSignIn}
          >
            Sign In
          </button>
        </p>
      </motion.div>
    </div>
  );
};

export default SignUp;
