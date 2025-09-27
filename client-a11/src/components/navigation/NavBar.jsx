import React from "react";
import { Link, NavLink } from "react-router";
import { useAuth } from "../../contexts/AuthProvider";
import ThemeToggle from "../shared/ThemeToggle";
import { notifySuccess } from "../../components/shared/ToastNotification";
import Lottie from "lottie-react";
import LogoutAnimation from "../../assets/animations/LogoutAnimation.json";
import { GiHamburgerMenu } from "react-icons/gi";
import logo from "/Icons/favicon.svg";

const NavBar = () => {
  const { currentUser, logout } = useAuth();

  const handleLogout = () => {
    logout()
      .then(() => {
        notifySuccess("Logged out successfully!", {
          animation: (
            <Lottie
              animationData={LogoutAnimation}
              loop={false}
              style={{ height: 600 }}
            />
          ),
        });
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const navLinks = (
    <>
      <li><NavLink to="/">Home</NavLink></li>
      <li><NavLink to="/available-cars">Available Cars</NavLink></li>
      {currentUser ? (
        <>
          <li>
            <NavLink to="/add-car">Add Car</NavLink>
          </li>
          <li>
            <NavLink to="/my-cars">My Cars</NavLink>
          </li>
          <li>
            <NavLink to="/my-bookings">My Bookings</NavLink>
          </li>
        </>
      ) : (<></>
      )}
    </>
  );

  return (
    <div
      className="navbar bg-base-100 shadow-sm"
      style={{
        backgroundColor: "var(--header-footer-bg)",
        color: "var(--text-inverted)",
      }}
    >
      <div className="navbar-start flex items-center justify-start pl-20 gap-2 sm:gap-4">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <GiHamburgerMenu className="text-3xl" />
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
            style={{
              backgroundColor: "var(--header-footer-bg)",
              color: "var(--text-inverted)",
            }}
          >
            {navLinks}
          </ul>
        </div>
        <Link to="/" className="btn btn-ghost text-xl">
          <img src={logo} alt="AutoVoyage Logo" className="w-12 h-12" />
          <span className="hidden sm:inline text-2xl font-bold">
            AutoVoyage
          </span>
        </Link>
      </div>
      <div className="navbar-center max-lg:hidden flex">
        <ul className="menu menu-horizontal px-1 text-lg">
            {navLinks}
        </ul>
      </div>
      <div className="navbar-end flex items-center justify-end pr-20 gap-2 sm:gap-4">
        <ThemeToggle className="text-4xl" />
        {currentUser ? (
          <div
            className="tooltip tooltip-bottom"
            data-tip={currentUser.displayName || "User"}
          >
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle avatar"
              >
                <div className="w-12 rounded-full border-2 border-gray-300">
                  <img
                    alt="User avatar"
                    src={
                      currentUser.photoURL ||
                      "https://i.ibb.co/68vstBq/user-profile-icon-free-vector.jpg"
                    }
                  />
                </div>
              </div>
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
                style={{
                  backgroundColor: "var(--header-footer-bg)",
                  color: "var(--text-inverted)",
                }}
              >
                <li>
                  <button onClick={handleLogout} className="btn btn-ghost w-full">Logout</button>
                </li>
              </ul>
            </div>
          </div>
        ) : (
          <>
            <Link to="/login" className="btn">
              Log-in
            </Link>
            <Link to="/register" className="btn">
              Register
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default NavBar;