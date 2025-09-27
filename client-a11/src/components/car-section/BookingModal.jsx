import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthProvider";
import { toast } from "react-toastify";
import axios from "axios";

const BookingModal = ({ car, isOpen, onClose, onBookingSuccess }) => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);

  const [bookingData, setBookingData] = useState({
    startDate: "",
    endDate: "",
    totalDays: 0,
    totalCost: 0,
  });

  // Reset form when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setBookingData({
        startDate: "",
        endDate: "",
        totalDays: 0,
        totalCost: 0,
      });
    }
  }, [isOpen]);

  // Calculate total cost when dates change
  useEffect(() => {
    calculateTotalCost();
  }, [bookingData.startDate, bookingData.endDate, car]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!bookingData.startDate || !bookingData.endDate) {
      toast.error("Please select both start and end dates");
      return;
    }

    if (bookingData.totalDays <= 0) {
      toast.error("End date must be after start date");
      return;
    }

    setLoading(true);

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
      // Add booking to database
      const response = await axios.post(
        "https://a11-autovoyage.vercel.app/bookings",
        booking
      );

      if (response.data.success) {
        // Update car booking count
        await axios.put(`https://a11-autovoyage.vercel.app/cars/${car._id}`, {
          ...car,
          bookingCount: (car.bookingCount || 0) + 1,
        });

        toast.success("Booking request sent successfully!");
        onBookingSuccess && onBookingSuccess(booking);
        onClose();
      }
    } catch (error) {
      console.error("Error creating booking:", error);
      toast.error("Failed to create booking!");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !car) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-lg">Book {car.model}</h3>
          <button onClick={onClose} className="btn btn-sm btn-circle btn-ghost">
            ✕
          </button>
        </div>

        {/* Car Info Summary */}
        <div className="bg-base-200 p-4 rounded-lg mb-4">
          <div className="flex items-center gap-4">
            <img
              src={car.imageUrl || "https://via.placeholder.com/80x60?text=Car"}
              alt={car.model}
              className="w-20 h-15 object-cover rounded"
            />
            <div>
              <h4 className="font-semibold">{car.model}</h4>
              <p className="text-sm text-gray-600">📍 {car.location}</p>
              <p className="text-lg font-bold text-primary">
                ${car.dailyRentalPrice}/day
              </p>
            </div>
          </div>
        </div>

        {/* Booking Form */}
        <form onSubmit={handleSubmit}>
          <div className="form-control mb-4">
            <label className="label">
              <span className="label-text font-semibold">Start Date</span>
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
                bookingData.startDate || new Date().toISOString().split("T")[0]
              }
              className="input input-bordered"
              required
            />
          </div>

          {/* Cost Calculation */}
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
                <span className="text-primary">${bookingData.totalCost}</span>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="modal-action">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-outline"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`btn btn-primary ${loading ? "loading" : ""}`}
              disabled={loading || bookingData.totalDays <= 0}
            >
              {loading ? "Booking..." : "Confirm Booking"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingModal;
