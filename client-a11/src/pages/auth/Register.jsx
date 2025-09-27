import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthProvider";
import Lottie from "lottie-react";
import AuthAnimation from "../../assets/animations/AuthAnimation.json";
import GoogleLogin from "../../components/shared/GoogleLogin";
import { useLocation, useNavigate } from "react-router";
import {
  notifySuccess,
  notifyError,
} from "../../components/shared/ToastNotification";

const Register = () => {
  const { createUser, updateUserProfile } = useAuth();
  const Navigate = useNavigate();
  const location = useLocation();
  const fromAddress = location.state?.from?.pathname || "/";
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRegister = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const form = e.target;
    const name = form.name.value;
    const email = form.email.value;
    const password = form.password.value;
    const photoURL = form.photoURL.value;

    createUser(email, password)
      .then((result) => {
        updateUserProfile(name, photoURL)
          .then(() => {
            notifySuccess("Registration successful!").then(() => {
              Navigate(fromAddress, { replace: true });
            });
          })
          .catch((error) => {
            notifyError(error.message);
          });
      })
      .catch((error) => {
        notifyError(error.message).then(() => {
          window.location.reload();
        });
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  return (
    <div className="hero bg-base-200 min-h-screen">
      <div className="hero-content flex-col lg:flex-row-reverse">
        <div className="text-center lg:text-left">
          <Lottie
            animationData={AuthAnimation}
            loop
            autoplay
            className="hidden lg:block w-96 h-96"
          />
        </div>
        <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
          <div className="card-body">
            <form onSubmit={handleRegister}>
              <fieldset className="fieldset">
                <h1 className="text-3xl md:text-5xl text-center font-bold">
                  Register now!
                </h1>
                <label className="label">Name</label>
                <input
                  type="text"
                  name="name"
                  className="input"
                  placeholder="Your Name"
                  disabled={isSubmitting}
                />
                <label className="label">Email</label>
                <input
                  type="email"
                  name="email"
                  className="input"
                  placeholder="Email"
                  disabled={isSubmitting}
                />
                <label className="label">Password</label>
                <input
                  type="password"
                  className="input"
                  placeholder="Password"
                  name="password"
                  disabled={isSubmitting}
                />
                <label className="label">Photo URL</label>
                <input
                  type="text"
                  name="photoURL"
                  className="input"
                  placeholder="Photo URL"
                  disabled={isSubmitting}
                />
                <div className="flex w-full flex-col mt-4">
                  <button
                    className="btn btn-neutral"
                    type="submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <span className="loading loading-spinner"></span>
                    ) : (
                      "Register"
                    )}
                  </button>
                  <GoogleLogin fromAddress={fromAddress} />
                </div>
              </fieldset>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;