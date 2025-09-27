import React from 'react';
import { Link } from 'react-router';
import { FaTwitter, FaYoutube, FaFacebookF } from 'react-icons/fa';

const Footer = () => {
    return (
        <footer
            className="footer p-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 justify-items-center text-center md:justify-items-start md:text-left"
            style={{
                backgroundColor: 'var(--header-footer-bg)',
                color: 'var(--text-inverted)',
            }}
        >
            <aside className="flex flex-col items-center md:items-start">
                <img src="/Icons/favicon.svg" alt="AutoVoyage" className="w-25 h-25" />
                <p className="text-xl font-bold">
                    AutoVoyage
                    <br />
                    <span className="text-sm font-normal">
                        Unlock your Ride and <br />Journey with AutoVoyage
                    </span>
                </p>
            </aside>
            <nav className="md:col-start-2 lg:col-auto">
                <h6 className="footer-title">Services</h6>
                <Link to="/available-cars" className="link link-hover">
                    Browse Cars
                </Link>
                <Link to="/add-car" className="link link-hover">
                    Add a Car
                </Link>
                <Link to="/my-bookings" className="link link-hover">
                    My Bookings
                </Link>
            </nav>
            <nav className="md:col-start-2 lg:col-auto">
                <h6 className="footer-title">Company</h6>
                <Link to="/about" className="link link-hover">
                    About us
                </Link>
                <Link to="/contact-us" className="link link-hover">
                    Contact
                </Link>
            </nav>
            <nav className="md:col-start-2 lg:col-auto">
                <h6 className="footer-title">Social</h6>
                <div className="grid grid-flow-col gap-4">
                    <a href="#" className="link link-hover text-2xl">
                        <FaTwitter />
                    </a>
                    <a href="#" className="link link-hover text-2xl">
                        <FaYoutube />
                    </a>
                    <a href="#" className="link link-hover text-2xl">
                        <FaFacebookF />
                    </a>
                </div>
            </nav>
        </footer>
    );
};

export default Footer;