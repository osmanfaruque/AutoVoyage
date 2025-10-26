import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router";
import { FaPercentage, FaCar, FaCalendarAlt, FaGift } from "react-icons/fa";

const SpecialOffers = () => {
  const offers = [
    {
      id: 1,
      title: "Weekend Special",
      discount: "15% OFF",
      description: "Get 15% off for weekend rentals!",
      terms: "Valid for Friday-Sunday bookings",
      buttonText: "Book Now",
      buttonLink: "/available-cars",
      bgGradient: "from-orange-400 to-red-500",
      icon: <FaCalendarAlt className="text-4xl" />,
      animation: "slideLeft",
    },
    {
      id: 2,
      title: "Luxury Holiday Deal",
      discount: "$99/day",
      description: "Luxury cars at $99/day this holiday season!",
      terms: "Premium vehicles included",
      buttonText: "Learn More",
      buttonLink: "/available-cars?category=luxury",
      bgGradient: "from-purple-400 to-indigo-600",
      icon: <FaCar className="text-4xl" />,
      animation: "slideRight",
    },
    {
      id: 3,
      title: "First Time Bonus",
      discount: "20% OFF",
      description: "New customer special discount!",
      terms: "First booking only",
      buttonText: "Get Started",
      buttonLink: "/register",
      bgGradient: "from-green-400 to-blue-500",
      icon: <FaGift className="text-4xl" />,
      animation: "slideLeft",
    },
  ];

  const slideLeftVariants = {
    offscreen: {
      opacity: 0,
      x: -100,
      scale: 0.8,
    },
    onscreen: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        type: "spring",
        bounce: 0.4,
        duration: 0.8,
      },
    },
  };

  const slideRightVariants = {
    offscreen: {
      opacity: 0,
      x: 100,
      scale: 0.8,
    },
    onscreen: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        type: "spring",
        bounce: 0.4,
        duration: 0.8,
      },
    },
  };

  const hoverVariants = {
    hover: {
      scale: 1.05,
      rotateY: 5,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 10,
      },
    },
  };

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-base-200 to-base-300 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          className="text-center mb-12 sm:mb-14 lg:mb-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ amount: 0.3 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex justify-center items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <FaPercentage className="text-2xl sm:text-3xl lg:text-4xl text-primary" />
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold">Special Offers</h2>
            <FaPercentage className="text-2xl sm:text-3xl lg:text-4xl text-primary" />
          </div>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto px-4">
            Don't miss out on these amazing deals! Limited time offers to make
            your car rental experience even better.
          </p>
        </motion.div>

        {/* Offers Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-6 lg:gap-8">
          {offers.map((offer) => (
            <motion.div
              key={offer.id}
              className="relative group"
              initial="offscreen"
              whileInView="onscreen"
              whileHover="hover"
              viewport={{ amount: 0.3 }}
              variants={
                offer.animation === "slideLeft"
                  ? slideLeftVariants
                  : slideRightVariants
              }
            >
              <motion.div
                className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${offer.bgGradient} p-6 sm:p-7 lg:p-8 text-white shadow-2xl`}
                variants={hoverVariants}
              >
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-4 right-4 text-6xl sm:text-7xl lg:text-8xl font-bold opacity-20">
                    {offer.discount.split("%")[0]}
                  </div>
                </div>

                {/* Content */}
                <div className="relative z-10">
                  {/* Icon */}
                  <motion.div
                    className="mb-3 sm:mb-4 text-3xl sm:text-4xl"
                    whileHover={{
                      rotate: 360,
                      transition: { duration: 0.8 },
                    }}
                  >
                    {offer.icon}
                  </motion.div>

                  {/* Title */}
                  <h3 className="text-xl sm:text-2xl font-bold mb-2">{offer.title}</h3>

                  {/* Discount Badge */}
                  <div className="inline-block bg-white/20 backdrop-blur-sm rounded-full px-3 sm:px-4 py-1.5 sm:py-2 mb-3 sm:mb-4">
                    <span className="text-xl sm:text-2xl font-black">
                      {offer.discount}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-base sm:text-lg mb-2 font-medium">
                    {offer.description}
                  </p>
                  <p className="text-xs sm:text-sm opacity-80 mb-4 sm:mb-6">{offer.terms}</p>

                  {/* CTA Button */}
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link
                      to={offer.buttonLink}
                      className="inline-block bg-white text-gray-800 font-bold py-2.5 sm:py-3 px-5 sm:px-6 rounded-full hover:bg-gray-100 transition-all duration-300 shadow-lg text-sm sm:text-base"
                    >
                      {offer.buttonText} →
                    </Link>
                  </motion.div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full"></div>
                <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-white/5 rounded-full"></div>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          className="text-center mt-10 sm:mt-12 lg:mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ amount: 0.3 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <p className="text-base sm:text-lg text-gray-600 mb-4 sm:mb-6">
            Ready to save on your next rental?
          </p>
          <Link to="/available-cars" className="btn btn-primary btn-md sm:btn-lg">
            Browse All Cars
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default SpecialOffers;
