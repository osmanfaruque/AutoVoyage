import React from 'react';
import { Link } from 'react-router';
import { FaTwitter, FaYoutube, FaFacebookF } from 'react-icons/fa';

const Footer = () => {
    return (
        <footer
            className="footer border-t border-[color:var(--border)]"
            style={{
                backgroundColor: 'var(--header-footer-bg)',
                color: 'var(--text-inverted)',
            }}
        >
          <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 justify-items-center text-center sm:justify-items-start sm:text-left">
            <aside className="flex flex-col items-center sm:items-start">
                <img src="/Icons/favicon.svg" alt="AutoVoyage" className="w-20 h-20 sm:w-24 sm:h-24" />
                <p className="text-lg sm:text-xl font-bold mt-2">
                    AutoVoyage
                    <br />
                    <span className="text-xs sm:text-sm font-normal">
                        Unlock your Ride and <br />Journey with AutoVoyage
                    </span>
                </p>
            </aside>
            <nav className="sm:col-start-2 lg:col-auto">
                <h6 className="footer-title text-base sm:text-lg">Services</h6>
                <Link to="/available-cars" className="link link-hover block py-1">
                    Browse Cars
                </Link>
                <Link to="/add-car" className="link link-hover block py-1">
                    Add a Car
                </Link>
                <Link to="/my-bookings" className="link link-hover block py-1">
                    My Bookings
                </Link>
            </nav>
            <nav className="sm:col-start-1 lg:col-auto">
                <h6 className="footer-title text-base sm:text-lg">Company</h6>
                <Link to="/about" className="link link-hover block py-1">
                    About us
                </Link>
                <Link to="/offers" className="link link-hover block py-1">Offers</Link>
                <Link to="/why-choose-us" className="link link-hover block py-1">Why Choose Us</Link>
                <Link to="/contact" className="link link-hover block py-1">Contact</Link>
            </nav>
            <nav className="sm:col-start-2 lg:col-auto">
                <h6 className="footer-title text-base sm:text-lg">Social</h6>
                <div className="grid grid-flow-col gap-3 sm:gap-4">
                    <a href="#" className="link link-hover text-xl sm:text-2xl">
                        <FaTwitter />
                    </a>
                    <a href="#" className="link link-hover text-xl sm:text-2xl">
                        <FaYoutube />
                    </a>
                    <a href="#" className="link link-hover text-xl sm:text-2xl">
                        <FaFacebookF />
                    </a>
                </div>
            </nav>
          </div>
        </footer>
    );
};

export default Footer;