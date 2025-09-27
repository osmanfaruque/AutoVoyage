import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthProvider";
import { useNavigate } from "react-router";
import {
  notifySuccess,
  notifyError,
} from "../../components/shared/ToastNotification";
import Lottie from "lottie-react";
import LoggedInAnimation from "../../assets/animations/LoggedInAnimation.json";
import { FcGoogle } from "react-icons/fc";

const GoogleLogin = ({ fromAddress }) => {
  const { signInWithGoogle } = useAuth();
  const navigate = useNavigate(); 
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleGoogleSignIn = async () => {
    setIsSubmitting(true);
    try {
      const result = await signInWithGoogle();
      await notifySuccess("Login Successful!", {
        animation: (
          <Lottie
            animationData={LoggedInAnimation}
            loop={false}
            style={{ height: 600 }}
          />
        ),
      });
      navigate(fromAddress || "/");
    } catch (error) {
      notifyError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="divider">OR</div>
      <button
        type="button"
        onClick={handleGoogleSignIn}
        className="btn btn-neutral"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <span className="loading loading-spinner"></span>
        ) : (
          <>
            <FcGoogle className="w-6 h-6" />
            Sign In with Google
          </>
        )}
      </button>
    </>
  );
};

export default GoogleLogin;