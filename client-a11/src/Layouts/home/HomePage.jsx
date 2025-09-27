import React from 'react';
import BannerSection from '../../components/Banner-Section/BannerSection';
import WhyChooseUs from '../../components/why-choose-us/WhyChooseUs';
import ContactUs from '../../components/contactUs-section/ContactUs';
import RecentListings from '../../components/car-section/RecentListings';
import SpecialOffers from '../../components/offers-section/SpecialOffers'; 

const HomePage = () => {
    return (
        <div className='bg-var(--background) flex flex-col gap-10'>
            <BannerSection />
            <RecentListings />
            <SpecialOffers /> 
            <WhyChooseUs />
            <ContactUs/>
        </div>
    );
};

export default HomePage;