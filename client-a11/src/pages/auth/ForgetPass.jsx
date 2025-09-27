import React, { useState } from "react";
import { Link } from "react-router";
import { useAuth } from "../../contexts/AuthProvider";
import LoadingAnimation from "../../components/shared/LoadingAnimation";
import {
  notifyPasswordResetSent,
  notifyError,
} from "../../components/shared/ToastNotification";

const ForgetPass = () => {
  const { resetPassword, loading: authLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      notifyError("Please enter your email address.");
      return;
    }
    setIsSubmitting(true);
    try {
      await resetPassword(email);
      notifyPasswordResetSent();
    } catch (err) {
      console.error("Password reset failed:", err);
      const errorMessage =
        err.message || "Failed to send password reset email.";
      notifyError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading && !isSubmitting) {
    return <LoadingAnimation />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-base-100 p-10 rounded-xl shadow-2xl">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold">
            Forgot your password?
          </h2>
          <p className="mt-2 text-center text-sm text-base-content-secondary">
            Enter your email address and we'll send you a link to reset your
            password.
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email-address" className="sr-only">
              Email address
            </label>
            <input
              id="email-address"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="input input-bordered w-full"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-neutral w-full group relative flex justify-center"
            >
              {isSubmitting ? (
                <span className="loading loading-spinner"></span>
              ) : (
                "Send Reset Link"
              )}
            </button>
          </div>
        </form>
        <div className="text-sm text-center">
          <p>
            Remember your password?{" "}
            <Link
              to="/login"
              className="font-medium link link-hover"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgetPass;