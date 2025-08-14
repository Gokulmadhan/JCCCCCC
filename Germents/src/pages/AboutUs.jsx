import React from 'react';
import bannerImage from '../assets/Images/hero5.jpg';
import model1 from '../assets/Images/dress1.jpg';
import model2 from '../assets/Images/dress3.jpg';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
};

const AboutUs = () => {
  const [ref1, inView1] = useInView({ triggerOnce: true, threshold: 0.2 });
  const [ref2, inView2] = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <div className="bg-white text-gray-800">
      {/* Parallax Banner */}
      <div className="relative w-full h-[80vh] overflow-hidden">
        <motion.img
          src={bannerImage}
          alt="Jack Cruise Banner"
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          className="absolute top-0 left-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 flex flex-col justify-center items-center text-white text-center px-4">
          <motion.h1
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="text-3xl md:text-5xl font-bold mb-2"
          >
            Empowering Comfort
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 1 }}
            className="text-lg md:text-2xl"
          >
            Where Comfort Meets Confidence
          </motion.p>
        </div>
      </div>

      {/* Brand Introduction */}
      <section className="max-w-5xl mx-auto px-4 py-16 text-center">
        <motion.h2
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-3xl font-bold mb-4 text-gray-900"
        >
          We are Jack Cruise
        </motion.h2>
        <motion.p
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-lg text-gray-700 leading-relaxed max-w-3xl mx-auto"
        >
          Welcome to <span className="font-semibold">Jack Cruise</span> – a brand committed to delivering high-quality apparel for men and women.
          From breathable innerwear to stylish athleisure and performance-driven activewear, our collections are crafted to support your lifestyle.
        </motion.p>
      </section>

      {/* Section 1 */}
      <section ref={ref1} className="max-w-3xl mx-auto grid md:grid-cols-2 gap-10 items-center px-4 py-12">
        <motion.img
          src={model1}
          alt="Jack Cruise Model"
          className="w-full max-w-md md:max-w-lg rounded-xl object-cover mx-auto"
          initial={{ opacity: 0, x: -50 }}
          animate={inView1 ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 1 }}
        />
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={inView1 ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 1 }}
        >
          <h3 className="text-2xl font-semibold text-red-600 mb-2">Established - 1995</h3>
          <p className="text-gray-700 text-lg leading-relaxed">
            Since 1995, Jack Cruise has stood for premium quality, innovative design, and everyday comfort.
            Our mission is to deliver garments that not only look good but feel even better, made for those who live life on their terms.
          </p>
        </motion.div>
      </section>

      {/* Section 2 */}
      <section ref={ref2} className="max-w-3xl mx-auto grid md:grid-cols-2 gap-10 items-center px-4 py-12">
        <motion.div
          className="order-2 md:order-1"
          initial={{ opacity: 0, x: -50 }}
          animate={inView2 ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 1 }}
        >
          <h3 className="text-2xl font-semibold text-red-600 mb-2">Our Mission</h3>
          <p className="text-gray-700 text-lg leading-relaxed">
            To provide men and women with fashion that empowers, supports, and inspires confidence through comfort.
            Our pieces combine style with function – from gym sessions to daily errands.
          </p>
        </motion.div>
        <motion.img
          src={model2}
          alt="Comfort & Confidence"
          className="order-1 md:order-2 w-full max-w-md md:max-w-lg rounded-xl object-cover mx-auto"
          initial={{ opacity: 0, x: 50 }}
          animate={inView2 ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 1 }}
        />
      </section>

      {/* Final CTA */}
      <motion.div
        className="text-center py-12 px-4 bg-gray-50"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
      >
        <p className="text-red-600 text-xl font-semibold">Jack Cruise – Designed to Move with You</p>
      </motion.div>
    </div>
  );
};

export default AboutUs;
