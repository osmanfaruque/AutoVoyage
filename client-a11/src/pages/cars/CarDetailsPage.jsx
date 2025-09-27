import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { useAuth } from "../../contexts/AuthProvider";
import { toast } from "react-toastify";
import axios from "axios";
import Swal from "sweetalert2";
import { authAxios } from "../../components/utils/AuthUtils";

const CarDetailsPage = () => {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [userHasActiveBooking, setUserHasActiveBooking] = useState(false);

  // Booking form state
  const [bookingData, setBookingData] = useState({
    startDate: "",
    endDate: "",
    totalDays: 0,
    totalCost: 0,
  });

  useEffect(() => {
    fetchCarDetails();
  }, [id]);

  useEffect(() => {
    if (currentUser && car) {
      checkUserActiveBooking();
    }
  }, [currentUser, car]);

  useEffect(() => {
    calculateTotalCost();
  }, [bookingData.startDate, bookingData.endDate, car]);

  const fetchCarDetails = async () => {
    try {
      const response = await axios.get(`https://a11-autovoyage.vercel.app/cars/${id}`);
      setCar(response.data);
    } catch (error) {
      console.error("Error fetching car details:", error);
      toast.error("Car not found!");
      navigate("/available-cars");
    } finally {
      setLoading(false);
    }
  };

  //Check if user has active booking for this car
  const checkUserActiveBooking = async () => {
    try {
      const response = await authAxios(
        `https://a11-autovoyage.vercel.app/bookings/check/${car._id}/${currentUser.email}`,
        "GET",
        null,
        currentUser
      );

      setUserHasActiveBooking(response.data.hasActiveBooking);
    } catch (error) {
      console.error("Error checking user booking:", error);
      // If error, assume no active booking to allow booking
      setUserHasActiveBooking(false);
    }
  };

  const calculateTotalCost = () => {
    if (bookingData.startDate && bookingData.endDate && car) {
      const start = new Date(bookingData.startDate);
      const end = new Date(bookingData.endDate);
      const diffTime = end - start;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays > 0) {
        setBookingData((prev) => ({
          ...prev,
          totalDays: diffDays,
          totalCost: diffDays * car.dailyRentalPrice,
        }));
      } else {
        setBookingData((prev) => ({
          ...prev,
          totalDays: 0,
          totalCost: 0,
        }));
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookingData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleBookNowClick = () => {
    if (!currentUser) {
      toast.error("Please login to book a car");
      navigate("/login");
      return;
    }

    if (userHasActiveBooking) {
      toast.error("You already have an active booking for this car!");
      return;
    }

    if (!bookingData.startDate || !bookingData.endDate) {
      toast.error("Please select both start and end dates");
      return;
    }

    if (bookingData.totalDays <= 0) {
      toast.error("End date must be after start date");
      return;
    }

    // Show confirmation modal
    setShowConfirmationModal(true);
  };

  const handleConfirmBooking = async () => {
    setBookingLoading(true);
    setShowConfirmationModal(false);

    const booking = {
      carId: car._id,
      carModel: car.model,
      carOwner: car.ownerName,
      carOwnerEmail: car.ownerEmail,
      renterEmail: currentUser.email,
      renterName: currentUser.displayName || currentUser.email,
      startDate: bookingData.startDate,
      endDate: bookingData.endDate,
      totalDays: bookingData.totalDays,
      totalCost: bookingData.totalCost,
      bookingDate: new Date(),
      status: "pending",
    };

    try {
      const bookingResponse = await authAxios(
        "https://a11-autovoyage.vercel.app/bookings",
        "POST",
        booking,
        currentUser
      );

      if (bookingResponse.data.success) {

        // Update local state
        setUserHasActiveBooking(true);
        setCar((prev) => ({
          ...prev,
          bookingCount: (prev.bookingCount || 0) + 1,
        }));

        Swal.fire({
          icon: "success",
          title: "Booking Confirmed!",
          text: "Your booking request has been sent successfully!",
          confirmButtonText: "View My Bookings",
          showCancelButton: true,
          cancelButtonText: "Stay Here",
        }).then((result) => {
          if (result.isConfirmed) {
            navigate("/my-bookings");
          }
        });

        setBookingData({
          startDate: "",
          endDate: "",
          totalDays: 0,
          totalCost: 0,
        });
      }
    } catch (error) {
      console.error("Error creating booking:", error);

      if (error.response?.status === 401) {
        Swal.fire({
          icon: "error",
          title: "Authentication Error!",
          text: "Please login again.",
        });
      } else if (error.response?.status === 409) {
        Swal.fire({
          icon: "error",
          title: "Already Booked!",
          text: "You already have an active booking for this car.",
        });
        setUserHasActiveBooking(true);
      } else {
        Swal.fire({
          icon: "error",
          title: "Booking Failed!",
          text: "Something went wrong. Please try again.",
        });
      }
    } finally {
      setBookingLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="loading loading-spinner loading-lg"></div>
        <p className="mt-4">Loading car details...</p>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Car Not Found</h1>
        <Link to="/available-cars" className="btn btn-primary">
          Back to Available Cars
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <div className="mb-6">
        <Link to="/available-cars" className="btn btn-outline">
          ← Back to Cars
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Car Image and Details */}
        <div>
          <div className="card bg-base-100 shadow-xl">
            <figure className="h-64 lg:h-80">
              <img
                src={
                  car.imageUrl ||
                  "https://via.placeholder.com/600x400?text=Car+Image"
                }
                alt={car.model}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src =
                    "https://via.placeholder.com/600x400?text=Car+Image";
                }}
              />
            </figure>
            <div className="card-body">
              <h1 className="card-title text-3xl">{car.model}</h1>

              <div className="flex justify-between items-center my-4">
                <span className="text-3xl font-bold text-primary">
                  ${car.dailyRentalPrice}/day
                </span>
                <span
                  className={`badge badge-lg ${
                    car.availability ? "badge-success" : "badge-error"
                  }`}
                >
                  {car.availability ? "Available" : "Not Available"}
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex items-center">
                  <span className="font-semibold mr-2">📍 Location:</span>
                  <span>{car.location || "Not specified"}</span>
                </div>

                <div className="flex items-center">
                  <span className="font-semibold mr-2">🚗 Registration:</span>
                  <span>{car.vehicleRegistrationNumber}</span>
                </div>

                <div className="flex items-center">
                  <span className="font-semibold mr-2">⚙️ Features:</span>
                  <span>{car.features || "Basic features"}</span>
                </div>

                <div className="flex items-center">
                  <span className="font-semibold mr-2">📅 Posted:</span>
                  <span>{formatDate(car.datePosted)}</span>
                </div>

                <div className="flex items-center">
                  <span className="font-semibold mr-2">📊 Bookings:</span>
                  <span>{car.bookingCount || 0} times</span>
                </div>

                <div className="flex items-center">
                  <span className="font-semibold mr-2">👤 Owner:</span>
                  <span>{car.ownerName}</span>
                </div>
              </div>

              {car.description && (
                <div className="mt-4">
                  <h3 className="font-semibold mb-2">Description:</h3>
                  <p className="text-gray-600">{car.description}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Booking Form */}
        <div>
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-2xl mb-4">Book This Car</h2>

              {!car.availability ? (
                <div className="alert alert-error">
                  <span>This car is currently not available for booking.</span>
                </div>
              ) : !currentUser ? (
                <div className="alert alert-warning">
                  <span>Please login to book this car.</span>
                  <Link to="/login" className="btn btn-sm btn-primary">
                    Login
                  </Link>
                </div>
              ) : currentUser.email === car.ownerEmail ? (
                <div className="alert alert-info">
                  <span>This is your own car. You cannot book it.</span>
                </div>
              ) : userHasActiveBooking ? (
                <div className="alert alert-warning">
                  <span>You already have an active booking for this car!</span>
                  <Link to="/my-bookings" className="btn btn-sm btn-primary">
                    View My Bookings
                  </Link>
                </div>
              ) : (
                <div>
                  <div className="form-control mb-4">
                    <label className="label">
                      <span className="label-text font-semibold">
                        Start Date
                      </span>
                    </label>
                    <input
                      type="date"
                      name="startDate"
                      value={bookingData.startDate}
                      onChange={handleInputChange}
                      min={new Date().toISOString().split("T")[0]}
                      className="input input-bordered"
                      required
                    />
                  </div>

                  <div className="form-control mb-4">
                    <label className="label">
                      <span className="label-text font-semibold">End Date</span>
                    </label>
                    <input
                      type="date"
                      name="endDate"
                      value={bookingData.endDate}
                      onChange={handleInputChange}
                      min={
                        bookingData.startDate ||
                        new Date().toISOString().split("T")[0]
                      }
                      className="input input-bordered"
                      required
                    />
                  </div>

                  {bookingData.totalDays > 0 && (
                    <div className="bg-primary/10 p-4 rounded-lg mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <span>Duration:</span>
                        <span className="font-semibold">
                          {bookingData.totalDays} days
                        </span>
                      </div>
                      <div className="flex justify-between items-center mb-2">
                        <span>Daily Rate:</span>
                        <span>${car.dailyRentalPrice}</span>
                      </div>
                      <div className="divider my-2"></div>
                      <div className="flex justify-between items-center text-lg font-bold">
                        <span>Total Cost:</span>
                        <span className="text-primary">
                          ${bookingData.totalCost}
                        </span>
                      </div>
                    </div>
                  )}

                  <button
                    onClick={handleBookNowClick}
                    className={`btn btn-primary w-full ${
                      bookingLoading ? "loading" : ""
                    }`}
                    disabled={bookingLoading || bookingData.totalDays <= 0}
                  >
                    {bookingLoading ? "Processing..." : "Book Now"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmationModal && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">Confirm Your Booking</h3>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="font-semibold">Car:</span>
                <span>{car.model}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Start Date:</span>
                <span>{formatDate(bookingData.startDate)}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">End Date:</span>
                <span>{formatDate(bookingData.endDate)}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Duration:</span>
                <span>{bookingData.totalDays} days</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Daily Rate:</span>
                <span>${car.dailyRentalPrice}</span>
              </div>
              <div className="divider"></div>
              <div className="flex justify-between text-lg font-bold">
                <span>Total Cost:</span>
                <span className="text-primary">${bookingData.totalCost}</span>
              </div>
            </div>

            <div className="modal-action">
              <button
                onClick={() => setShowConfirmationModal(false)}
                className="btn btn-outline"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmBooking}
                className={`btn btn-primary ${bookingLoading ? "loading" : ""}`}
                disabled={bookingLoading}
              >
                {bookingLoading ? "Confirming..." : "Confirm Booking"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CarDetailsPage;
