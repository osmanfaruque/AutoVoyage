import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthProvider";
import { authAxios } from '../utils/AuthUtils';
import Swal from "sweetalert2";

const ModifyBookingModal = ({ booking, isOpen, onClose, onBookingUpdated }) => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    startDate: "",
    endDate: "",
    totalDays: 0,
    totalCost: 0,
  });

  useEffect(() => {
    if (booking && isOpen) {
      // Convert dates to YYYY-MM-DD format for input
      const startDate = new Date(booking.startDate).toISOString().split("T")[0];
      const endDate = new Date(booking.endDate).toISOString().split("T")[0];

      setFormData({
        startDate,
        endDate,
        totalDays: booking.totalDays,
        totalCost: booking.totalCost,
      });
    }
  }, [booking, isOpen]);

  useEffect(() => {
    calculateTotalCost();
  }, [formData.startDate, formData.endDate, booking]);

  const calculateTotalCost = () => {
    if (formData.startDate && formData.endDate && booking) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      const diffTime = end - start;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays > 0) {
        // Calculate daily rate from original booking
        const dailyRate = booking.totalCost / booking.totalDays;

        setFormData((prev) => ({
          ...prev,
          totalDays: diffDays,
          totalCost: Math.round(diffDays * dailyRate),
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          totalDays: 0,
          totalCost: 0,
        }));
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.startDate || !formData.endDate) {
      Swal.fire({
        icon: "error",
        title: "Invalid Dates",
        text: "Please select both start and end dates",
      });
      return;
    }

    if (formData.totalDays <= 0) {
      Swal.fire({
        icon: "error",
        title: "Invalid Date Range",
        text: "End date must be after start date",
      });
      return;
    }

    const result = await Swal.fire({
      title: "Confirm Date Change?",
      html: `
                <div class="text-left">
                    <p><strong>Car:</strong> ${booking.carModel}</p>
                    <p><strong>Current:</strong> ${new Date(
                      booking.startDate
                    ).toLocaleDateString()} - ${new Date(
        booking.endDate
      ).toLocaleDateString()}</p>
                    <p><strong>New:</strong> ${new Date(
                      formData.startDate
                    ).toLocaleDateString()} - ${new Date(
        formData.endDate
      ).toLocaleDateString()}</p>
                    <p><strong>Duration:</strong> ${formData.totalDays} days</p>
                    <p><strong>New Total Cost:</strong> $${
                      formData.totalCost
                    }</p>
                </div>
            `,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Update Booking",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    setLoading(true);

    try {
      const updateData = {
        startDate: formData.startDate,
        endDate: formData.endDate,
        totalDays: formData.totalDays,
        totalCost: formData.totalCost,
      };

      const response = await authAxios(
        `https://a11-autovoyage.vercel.app/bookings/${booking._id}`,
        "PUT",
        updateData,
        currentUser
      );

      if (response.data.success) {
        Swal.fire({
          icon: "success",
          title: "Booking Updated!",
          text: "Your booking dates have been updated successfully.",
          timer: 2000,
          showConfirmButton: false,
        });

        onBookingUpdated &&
          onBookingUpdated({
            ...booking,
            ...updateData,
          });

        onClose();
      }
    } catch (error) {
      console.error("Error updating booking:", error);

      Swal.fire({
        icon: "error",
        title: "Update Failed!",
        text:
          error.response?.data?.error ||
          "Failed to update booking. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !booking) return null;

  const dailyRate = booking.totalCost / booking.totalDays;

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-lg">Modify Booking Dates</h3>
          <button
            onClick={onClose}
            className="btn btn-sm btn-circle btn-ghost"
            disabled={loading}
          >
            ✕
          </button>
        </div>

        {/* Booking Info */}
        <div className="bg-base-200 p-4 rounded-lg mb-4">
          <h4 className="font-semibold">{booking.carModel}</h4>
          <p className="text-sm text-gray-600">Owner: {booking.carOwner}</p>
          <p className="text-sm text-gray-600">
            Status:
            <span
              className={`badge badge-sm ml-1 ${
                booking.status === "confirmed"
                  ? "badge-success"
                  : "badge-warning"
              }`}
            >
              {booking.status.toUpperCase()}
            </span>
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Current Dates Info */}
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm font-medium">Current Booking:</p>
            <p className="text-sm">
              {new Date(booking.startDate).toLocaleDateString()} -{" "}
              {new Date(booking.endDate).toLocaleDateString()}
            </p>
            <p className="text-sm">
              Duration: {booking.totalDays} days | Cost: ${booking.totalCost}
            </p>
          </div>

          {/* New Start Date */}
          <div className="form-control mb-4">
            <label className="label">
              <span className="label-text font-semibold">New Start Date</span>
            </label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleInputChange}
              min={new Date().toISOString().split("T")[0]}
              className="input input-bordered"
              required
            />
          </div>

          {/* New End Date */}
          <div className="form-control mb-4">
            <label className="label">
              <span className="label-text font-semibold">New End Date</span>
            </label>
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleInputChange}
              min={formData.startDate || new Date().toISOString().split("T")[0]}
              className="input input-bordered"
              required
            />
          </div>

          {/* Cost Calculation */}
          {formData.totalDays > 0 && (
            <div className="bg-primary/10 p-4 rounded-lg mb-4">
              <div className="flex justify-between items-center mb-2">
                <span>New Duration:</span>
                <span className="font-semibold">{formData.totalDays} days</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span>Daily Rate:</span>
                <span>${Math.round(dailyRate)}</span>
              </div>
              <div className="divider my-2"></div>
              <div className="flex justify-between items-center text-lg font-bold">
                <span>New Total Cost:</span>
                <span className="text-primary">${formData.totalCost}</span>
              </div>
              {formData.totalCost !== booking.totalCost && (
                <div className="text-sm text-center mt-2">
                  <span
                    className={
                      formData.totalCost > booking.totalCost
                        ? "text-red-600"
                        : "text-green-600"
                    }
                  >
                    {formData.totalCost > booking.totalCost ? "+" : ""}$
                    {formData.totalCost - booking.totalCost} from original
                    booking
                  </span>
                </div>
              )}
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
              disabled={loading || formData.totalDays <= 0}
            >
              {loading ? "Updating..." : "Update Booking"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModifyBookingModal;
