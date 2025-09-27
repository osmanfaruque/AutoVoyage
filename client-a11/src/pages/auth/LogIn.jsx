import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthProvider";
import Lottie from "lottie-react";
import AuthAnimation from "../../assets/animations/AuthAnimation.json";
import LoggedInAnimation from "../../assets/animations/LoggedInAnimation.json";
import GoogleLogin from "../../components/shared/GoogleLogin";
import { Link, useLocation, useNavigate } from "react-router";
import {
  notifySuccess,
  notifyError,
} from "../../components/shared/ToastNotification";

const LogIn = () => {
  const { signIn } = useAuth();
  const location = useLocation();
  const Navigate = useNavigate();
  const fromAddress = location.state?.from?.pathname || "/";
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSignIn = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const form = e.target;
    const email = form.email.value;
    const password = form.password.value;

    //signin user
    signIn(email, password)
      .then((result) => {
        notifySuccess("Login Successful!", {
          animation: (
            <Lottie
              animationData={LoggedInAnimation}
              loop={false}
              style={{ height: 600 }}
            />
          ),
        }).then(() => {
          Navigate(fromAddress, { replace: true });
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
            className="hidden lg:block w-96 h-96"
            animationData={AuthAnimation}
            loop={true}
          />
        </div>
        <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
          <div className="card-body">
            <form onSubmit={handleSignIn}>
              <fieldset className="fieldset">
                <h1 className="text-3xl md:text-5xl text-center font-bold">Sign In!</h1>
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
                <div>
                  <Link to="/forgot-password" className="link link-hover">Forgot password?</Link>
                </div>
                <div className="flex w-full flex-col">
                  <button
                    className="btn btn-neutral"
                    type="submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <span className="loading loading-spinner"></span>
                    ) : (
                      "Sign In"
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

export default LogIn;
