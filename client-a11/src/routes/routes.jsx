import React from "react";
import { createBrowserRouter } from "react-router";
import App from "../App";

// Home
import HomePage from "../Layouts/home/HomePage.jsx";

// Auth
import Register from "../pages/auth/Register.jsx";
import LogIn from "../pages/auth/LogIn.jsx";

// Errors
import ErrorFound from "../pages/errors/ErrorFound.jsx";

// Private Route
import PrivateRoute from "./PrivateRoute.jsx";
import ForgetPass from "../pages/auth/ForgetPass.jsx";

// Car Pages
import AvailableCarsPage from "../pages/cars/AvailableCarsPage";
import CarDetailsPage from "../pages/cars/CarDetailsPage";
import AddCarPage from "../pages/cars/AddCarPage";
import MyCarsPage from "../pages/cars/MyCarsPage";
import MyBookingsPage from "../pages/cars/MyBookingsPage";
import UpdateCarPage from "../pages/cars/UpdateCarPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorFound />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "available-cars", element: <AvailableCarsPage /> },
      {
        path: "car/:id",
        element: <CarDetailsPage />,
      },
      {
        path: "add-car",
        element: (
          <PrivateRoute>
            <AddCarPage />
          </PrivateRoute>
        ),
      },
      {
        path: "my-cars",
        element: (
          <PrivateRoute>
            <MyCarsPage />
          </PrivateRoute>
        ),
      },
      {
        path: "my-bookings",
        element: (
          <PrivateRoute>
            <MyBookingsPage />
          </PrivateRoute>
        ),
      },
      {
        path: "update-car/:id",
        element: (
          <PrivateRoute>
            <UpdateCarPage />
          </PrivateRoute>
        ),
      },
      { path: "login", element: <LogIn /> },
      { path: "register", element: <Register /> },
      { path: "forgot-password", element: <ForgetPass /> },
      { path: "*", element: <ErrorFound /> },
    ],
  },
]);

export default router;
