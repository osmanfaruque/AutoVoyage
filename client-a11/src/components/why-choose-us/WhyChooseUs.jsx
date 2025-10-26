import React from 'react';
import { motion } from 'framer-motion';
import { FaCarSide, FaTags, FaClipboardCheck, FaHeadset, FaFileInvoiceDollar, FaShieldAlt } from 'react-icons/fa';
import Lottie from 'lottie-react';

// Assuming these animation files exist at the specified paths as per your request
import carAnimation from '../../assets/animations/car.json';
import moneyAnimation from '../../assets/animations/money.json';
import bookingAnimation from '../../assets/animations/booking.json';
import wellMaintainedAnimation from '../../assets/animations/well.json';
import transparentPricingAnimation from '../../assets/animations/transparent.json';
import supportAnimation from '../../assets/animations/support.json';

const WhyChooseUs = () => {
    const features = [
        {
            icon: <FaCarSide className="text-5xl" />,
            title: 'Wide Variety of Cars',
            description: 'From budget-friendly options to luxury vehicles to suit every need.',
            animation: carAnimation
        },
        {
            icon: <FaTags className="text-5xl" />,
            title: 'Affordable Prices',
            description: 'Competitive and transparent daily rates you can count on.',
            animation: moneyAnimation
        },
        {
            icon: <FaClipboardCheck className="text-5xl" />,
            title: 'Easy Booking Process',
            description: 'Seamlessly book your ideal ride in just a few simple clicks.',
            animation: bookingAnimation
        },
        {
            icon: <FaShieldAlt className="text-5xl" />,
            title: 'Well-Maintained Fleet',
            description: 'Regularly serviced and sanitized vehicles for your safety and comfort.',
            animation: wellMaintainedAnimation
        },
        {
            icon: <FaFileInvoiceDollar className="text-5xl" />,
            title: 'Transparent Pricing',
            description: 'No hidden fees. The price you see is the price you pay.',
            animation: transparentPricingAnimation
        },
        {
            icon: <FaHeadset className="text-5xl" />,
            title: '24/7 Customer Support',
            description: 'Round-the-clock assistance for all your questions and concerns.',
            animation: supportAnimation
        }
    ];

    const cardVariantsLeft = {
        offscreen: { opacity: 0, x: -100 },
        onscreen: {
            opacity: 1,
            x: 0,
            transition: { type: 'spring', bounce: 0.4, duration: 0.8 }
        }
    };

    const cardVariantsRight = {
        offscreen: { opacity: 0, x: 100 },
        onscreen: {
            opacity: 1,
            x: 0,
            transition: { type: 'spring', bounce: 0.4, duration: 0.8 }
        }
    };

    const animationVariants = {
        offscreen: { opacity: 0, scale: 0.5 },
        onscreen: {
            opacity: 1,
            scale: 1,
            transition: { type: 'spring', bounce: 0.4, duration: 1.2 }
        }
    };

    return (
        <section className="py-12 sm:py-16 lg:py-20 bg-base-200 overflow-x-hidden">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 sm:mb-14 lg:mb-16">Why Choose AutoVoyage?</h2>
                <div className="relative">
                    {/* Vertical line for desktop view */}
                    <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-primary -translate-x-1/2 hidden md:block" aria-hidden="true"></div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12 items-center">
                        {features.map((feature, index) => {
                            const isEven = index % 2 === 0;

                            const cardContent = (
                                <motion.div
                                    className="card bg-base-100 shadow-xl p-6 h-full"
                                    initial="offscreen"
                                    whileInView="onscreen"
                                    viewport={{ amount: 0.5 }}
                                    variants={isEven ? cardVariantsLeft : cardVariantsRight}
                                >
                                    <div className={`flex items-center gap-6 h-full ${!isEven && 'md:flex-row-reverse'}`}>
                                        <figure className="text-primary">{feature.icon}</figure>
                                        <div className={`card-body p-0 ${!isEven && 'md:text-right'}`}>
                                            <h3 className="card-title text-2xl">{feature.title}</h3>
                                            <p className="text-base">{feature.description}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            );

                            const animationContent = (
                                <motion.div
                                    initial="offscreen"
                                    whileInView="onscreen"
                                    viewport={{ amount: 0.5 }}
                                    variants={animationVariants}
                                    className="hidden md:flex items-center justify-center"
                                >
                                    <Lottie animationData={feature.animation} loop={true} style={{ height: 200 }} />
                                </motion.div>
                            );
                            
                            if (isEven) {
                                return (
                                    <React.Fragment key={index}>
                                        {cardContent}
                                        {animationContent}
                                    </React.Fragment>
                                );
                            } else {
                                return (
                                    <React.Fragment key={index}>
                                        {animationContent}
                                        {cardContent}
                                    </React.Fragment>
                                );
                            }
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default WhyChooseUs; 