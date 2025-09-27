import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import Lottie from "lottie-react";
import contactAnimation from "../../assets/animations/contact.json";

const ContactUs = () => {
    const { theme } = useTheme();

    return (
        <div className={`py-12 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-base-200 text-black'}`}>
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold">Contact Us</h2>
                    <p className="text-lg mt-2">Have questions? We'd love to hear from you.</p>
                </div>
                <div className="flex flex-wrap -mx-4 items-center">
                    <div className="w-full lg:w-1/2 px-4 mb-8 lg:mb-0">
                        <div className={`p-8 rounded-lg shadow-2xl border ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white'}`}>
                            <h3 className="text-2xl font-bold mb-6">Send us a message</h3>
                            <form>
                                <div className="mb-4">
                                    <label htmlFor="name" className="block text-sm font-medium mb-2">Your Name</label>
                                    <input type="text" id="name" name="name" className="input input-bordered w-full" placeholder="John Doe" />
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="email" className="block text-sm font-medium mb-2">Your Email</label>
                                    <input type="email" id="email" name="email" className="input input-bordered w-full" placeholder="john.doe@example.com" />
                                </div>
                                <div className="mb-6">
                                    <label htmlFor="message" className="block text-sm font-medium mb-2">Message</label>
                                    <textarea id="message" name="message" rows="4" className="textarea textarea-bordered w-full" placeholder="Your message..."></textarea>
                                </div>
                                <button type="submit" className="btn btn-primary w-full">Send Message</button>
                            </form>
                        </div>
                    </div>
                    <div className="w-full lg:w-1/2 px-4">
                        <Lottie animationData={contactAnimation} loop={true} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactUs;