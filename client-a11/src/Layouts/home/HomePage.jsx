import React from 'react';
import BannerSection from '../../components/Banner-Section/BannerSection';
import WhyChooseUs from '../../components/why-choose-us/WhyChooseUs';
import ContactUs from '../../components/contactUs-section/ContactUs';
import RecentListings from '../../components/car-section/RecentListings';
import SpecialOffers from '../../components/offers-section/SpecialOffers'; 

const HomePage = () => {
    return (
        <div className='flex flex-col gap-10'>
            <section id="banner">
                <BannerSection />
            </section>
            <RecentListings />
            <section id="offers">
                <SpecialOffers />
            </section>
            <section id="why-us">
                <WhyChooseUs />
            </section>
            <section id="contact">
                <ContactUs/>
            </section>
        </div>
    );
};

export default HomePage;