import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import Lottie from "lottie-react";
import contactAnimation from "../../assets/animations/contact.json";

const ContactUs = () => {
    const { theme } = useTheme();

    return (
        <div className={`py-8 sm:py-10 lg:py-12 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-base-200 text-black'}`}>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-8 sm:mb-10 lg:mb-12">
                    <h2 className="text-3xl sm:text-4xl font-bold">Contact Us</h2>
                    <p className="text-base sm:text-lg mt-2">Have questions? We'd love to hear from you.</p>
                </div>
                <div className="flex flex-wrap -mx-4 items-center">
                    <div className="w-full lg:w-1/2 px-4 mb-6 sm:mb-8 lg:mb-0">
                        <div className={`p-6 sm:p-8 rounded-lg shadow-2xl border ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white'}`}>
                            <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Send us a message</h3>
                            <form>
                                <div className="mb-3 sm:mb-4">
                                    <label htmlFor="name" className="block text-xs sm:text-sm font-medium mb-2">Your Name</label>
                                    <input type="text" id="name" name="name" className="input input-bordered w-full input-sm sm:input-md" placeholder="John Doe" />
                                </div>
                                <div className="mb-3 sm:mb-4">
                                    <label htmlFor="email" className="block text-xs sm:text-sm font-medium mb-2">Your Email</label>
                                    <input type="email" id="email" name="email" className="input input-bordered w-full input-sm sm:input-md" placeholder="john.doe@example.com" />
                                </div>
                                <div className="mb-4 sm:mb-6">
                                    <label htmlFor="message" className="block text-xs sm:text-sm font-medium mb-2">Message</label>
                                    <textarea id="message" name="message" rows="4" className="textarea textarea-bordered w-full textarea-sm sm:textarea-md" placeholder="Your message..."></textarea>
                                </div>
                                <button type="submit" className="btn btn-primary w-full btn-sm sm:btn-md">Send Message</button>
                            </form>
                        </div>
                    </div>
                    <div className="w-full lg:w-1/2 px-4">
                        <Lottie animationData={contactAnimation} loop={true} style={{ maxHeight: '400px' }} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactUs;