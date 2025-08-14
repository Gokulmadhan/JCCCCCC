import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// Shared Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Routes
import AllRoutes from './routes';

export default function App() {
  return (
    <Router>
      <div className="flex flex-col pt-18 min-h-screen">
        <Navbar />
        <ToastContainer
position="top-right"
autoClose={5000}
hideProgressBar={false}
newestOnTop={false}
closeOnClick={false}
rtl={false}
pauseOnFocusLoss
draggable
pauseOnHover
theme="colored"
/>
        <main className="flex-grow">
          <AllRoutes />
        </main>
        <Footer />
      </div>
    </Router>
  );
}
