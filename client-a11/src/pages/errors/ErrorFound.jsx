import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import Lottie from 'lottie-react';
import ErrorAnimation from '../../assets/animations/ErrorAnimation.json';

const ErrorFound = () => {
  const lottieRef = useRef(null);
  const navigate = useNavigate();
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    if (lottieRef.current) {
      lottieRef.current.playSegments([0, 120], true);
    }
  }, []);

  const handleBackToHome = () => {
    if (lottieRef.current && !isRedirecting) {
      setIsRedirecting(true);
      lottieRef.current.playSegments([120, 149], true);
    }
  };

  const handleAnimationComplete = () => {
    if (isRedirecting) {
      navigate('/');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-292px)] text-center px-4">
      <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-4">Oops! There is an Error "Accident" Occurred</h1>
      <div className="w-full max-w-2xl">
        <Lottie
          lottieRef={lottieRef}
          animationData={ErrorAnimation}
          loop={false}
          autoplay={false}
          onComplete={handleAnimationComplete}
        />
      </div>
      <button
        className="btn btn-outline btn-primary"
        onClick={handleBackToHome}
        disabled={isRedirecting}
      >
        {isRedirecting ? 'Redirecting...' : 'Lets take it to the Office'}
      </button>
    </div>
  );
};

export default ErrorFound;