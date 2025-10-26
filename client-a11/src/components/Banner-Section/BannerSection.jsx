import React from 'react';
import { Link } from 'react-router';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, EffectFade } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';
import './BannerSection.css';

const BannerSection = () => {
    const slides = [
        {
            imageUrl: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            slogan: 'Unlock Your Ride!',
        },
        {
            imageUrl: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=1966&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            slogan: 'Experience the Freedom of the Open Road.',
        },
        {
            imageUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            slogan: 'Elegance in Motion.',
        },
        {
            imageUrl: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            slogan: 'Power and Performance at Your Fingertips.',
        },
        {
            imageUrl: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            slogan: 'Live Life in the Fast Lane.',
        },
        {
            imageUrl: 'https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?q=80&w=1937&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            slogan: 'Drive Your Dreams.',
        },
    ];

    return (
        <Swiper
            modules={[Autoplay, Navigation, EffectFade]}
            navigation
            effect="fade"
            autoplay={{
                delay: 2000,
                disableOnInteraction: false,
            }}
            loop={true}
            className="w-full h-[70vh] md:h-[60vh]"
            id='banner'
        >
            {slides.map((slide, index) => (
                <SwiperSlide key={index}>
                    <div
                        className="hero min-h-[70vh] md:min-h-[60vh] bg-cover bg-center bg-no-repeat"
                        style={{ backgroundImage: `url(${slide.imageUrl})` }}
                    >
                        <div className="hero-overlay bg-opacity-60"></div>
                        <div className="hero-content text-center text-neutral-content">
                            <div className="flex flex-col items-center justify-center gap-6 md:gap-8">
                                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white" style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)' }}>
                                    AutoVoyage <br /> {slide.slogan}
                                </h1>
                                <p className="text-base md:text-lg" style={{ textShadow: '1px 1px 3px rgba(0, 0, 0, 0.5)' }}>
                                    Your Next Car Awaits You.
                                </p>
                                <Link to="/available-cars" className="btn btn-primary">
                                    View Available Cars
                                </Link>
                            </div>
                        </div>
                    </div>
                </SwiperSlide>
            ))}
        </Swiper>
    );
};

export default BannerSection;