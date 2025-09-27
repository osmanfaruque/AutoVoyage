import React, { useState, useEffect } from "react";
import { Link } from "react-router";
import { useAuth } from "../../contexts/AuthProvider";
import { authAxios } from "../../components/utils/AuthUtils";
import Swal from "sweetalert2";
import ModifyBookingModal from "../../components/booking-section/ModifyBookingModal";
import BookingTable from "../../components/booking-section/BookingTable";
import SortControls from "../../components/shared/SortControls";

const MyBookingsPage = () => {
  const { currentUser } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [showModifyModal, setShowModifyModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [viewMode, setViewMode] = useState("table");
  const [sortBy, setSortBy] = useState("bookingDate");
  const [sortOrder, setSortOrder] = useState("desc");

  useEffect(() => {
    if (currentUser) {
      fetchMyBookings();
    }
  }, [currentUser]);

  const fetchMyBookings = async () => {
    try {
      const response = await authAxios(
        "https://a11-autovoyage.vercel.app/bookings",
        "GET",
        null,
        currentUser
      );
      setBookings(response.data);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";

    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch (error) {
      console.error("Date formatting error:", error);
      return "Invalid Date";
    }
  };

  const getStatusBadge = (status) => {
    if (!status) return "badge badge-neutral";

    const badges = {
      pending: "badge badge-warning",
      confirmed: "badge badge-success",
      cancelled: "badge badge-error",
      completed: "badge badge-info",
    };
    return badges[status.toLowerCase()] || "badge badge-neutral";
  };

  const handleModifyBooking = (booking) => {
    setSelectedBooking(booking);
    setShowModifyModal(true);
  };

  const handleCancelBooking = async (booking) => {
    const result = await Swal.fire({
      title: "Are you sure you want to cancel this booking?",
      text: `Booking for ${booking.carModel}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes",
      cancelButtonText: "No",
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      setActionLoading(booking._id);

      try {
        const updateData = {
          status: "cancelled",
        };

        const response = await authAxios(
          `https://a11-autovoyage.vercel.app/bookings/${booking._id}`,
          "PUT",
          updateData,
          currentUser
        );

        if (response.data.success) {
          setBookings((prevBookings) =>
            prevBookings.map((b) =>
              b._id === booking._id ? { ...b, status: "cancelled" } : b
            )
          );

          Swal.fire({
            icon: "success",
            title: "Booking Cancelled!",
            text: "Your booking has been cancelled successfully.",
            timer: 2000,
            showConfirmButton: false,
          });
        }
      } catch (error) {
        console.error("Error cancelling booking:", error);
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: "Failed to cancel booking. Please try again.",
        });
      } finally {
        setActionLoading(null);
      }
    }
  };

  const handleDeleteBooking = async (booking) => {
    const result = await Swal.fire({
      title: "Delete Booking?",
      text: `This will permanently delete your booking for ${booking.carModel}. This action cannot be undone!`,
      icon: "error",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, Delete",
      cancelButtonText: "Keep Booking",
    });

    if (result.isConfirmed) {
      setActionLoading(booking._id);

      try {
        const response = await authAxios(
          `https://a11-autovoyage.vercel.app/bookings/${booking._id}`,
          "DELETE",
          null,
          currentUser
        );

        if (response.data.success) {
          setBookings((prevBookings) =>
            prevBookings.filter((b) => b._id !== booking._id)
          );

          Swal.fire({
            icon: "success",
            title: "Booking Deleted!",
            text: "Your booking has been permanently deleted.",
            timer: 2000,
            showConfirmButton: false,
          });
        }
      } catch (error) {
        console.error("Error deleting booking:", error);
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: "Failed to delete booking. Please try again.",
        });
      } finally {
        setActionLoading(null);
      }
    }
  };

  const handleBookingUpdated = (updatedBooking) => {
    setBookings((prevBookings) =>
      prevBookings.map((booking) =>
        booking._id === updatedBooking._id ? updatedBooking : booking
      )
    );
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="loading loading-spinner loading-lg"></div>
        <p className="mt-4">Loading your bookings...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold">My Bookings</h1>
          <p className="text-gray-600 mt-2">Manage your car rental bookings</p>
        </div>
        <Link to="/available-cars" className="btn btn-primary">
          Book Another Car
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="stat bg-base-100 shadow rounded-lg">
          <div className="stat-title">Total Bookings</div>
          <div className="stat-value text-primary">{bookings.length}</div>
        </div>
        <div className="stat bg-base-100 shadow rounded-lg">
          <div className="stat-title">Pending</div>
          <div className="stat-value text-warning">
            {bookings.filter((b) => b.status === "pending").length}
          </div>
        </div>
        <div className="stat bg-base-100 shadow rounded-lg">
          <div className="stat-title">Confirmed</div>
          <div className="stat-value text-success">
            {bookings.filter((b) => b.status === "confirmed").length}
          </div>
        </div>
        <div className="stat bg-base-100 shadow rounded-lg">
          <div className="stat-title">Total Spent</div>
          <div className="stat-value text-info">
            $
            {bookings.reduce(
              (sum, booking) => sum + (booking.totalCost || 0),
              0
            )}
          </div>
        </div>
      </div>

      {/* View Toggle */}
      {bookings.length > 0 && (
        <div className="card bg-base-100 shadow-xl p-6 mb-8">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">View Options</h3>
            <div className="join">
              <button
                className={`btn join-item ${
                  viewMode === "table"
                    ? "btn-active btn-primary"
                    : "btn-outline"
                }`}
                onClick={() => setViewMode("table")}
              >
                📋 Table
              </button>
              <button
                className={`btn join-item ${
                  viewMode === "cards"
                    ? "btn-active btn-primary"
                    : "btn-outline"
                }`}
                onClick={() => setViewMode("cards")}
              >
                🗃️ Cards
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bookings Display */}
      {bookings.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">📋</div>
          <h2 className="text-2xl font-bold mb-4">No Bookings Yet</h2>
          <p className="text-gray-600 mb-6">
            Start exploring and book your first car!
          </p>
          <Link to="/available-cars" className="btn btn-primary btn-lg">
            Browse Available Cars
          </Link>
        </div>
      ) : viewMode === "table" ? (
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body p-0">
            <BookingTable
              bookings={bookings}
              onModify={handleModifyBooking}
              onCancel={handleCancelBooking}
              onDelete={handleDeleteBooking}
              actionLoading={actionLoading}
              formatDate={formatDate}
              getStatusBadge={getStatusBadge}
            />
          </div>
        </div>
      ) : (
        /* Cards View */
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div key={booking._id} className="card bg-base-100 shadow-lg">
              <div className="card-body">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                  {/* Car Info */}
                  <div className="lg:col-span-2">
                    <h3 className="card-title text-xl">{booking.carModel}</h3>
                    <p className="text-gray-600">Owner: {booking.carOwner}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <span className={getStatusBadge(booking.status)}>
                        {booking.status.toUpperCase()}
                      </span>
                      <span className="text-sm text-gray-500">
                        Booked: {formatDate(booking.bookingDate)}
                      </span>
                    </div>
                  </div>

                  {/* Booking Details */}
                  <div>
                    <h4 className="font-semibold mb-2">Rental Period</h4>
                    <p className="text-sm">
                      From: {formatDate(booking.startDate)}
                    </p>
                    <p className="text-sm">To: {formatDate(booking.endDate)}</p>
                    <p className="text-sm font-semibold">
                      Duration: {booking.totalDays} days
                    </p>
                  </div>

                  {/* Cost & Actions */}
                  <div className="flex flex-col justify-between">
                    <div>
                      <h4 className="font-semibold">Total Cost</h4>
                      <p className="text-2xl font-bold text-primary">
                        ${booking.totalCost}
                      </p>
                    </div>

                    <div className="flex gap-2 mt-4 flex-wrap">
                      {booking.status === "pending" && (
                        <>
                          <button
                            onClick={() => handleModifyBooking(booking)}
                            className="btn btn-info btn-sm"
                          >
                            Modify Date
                          </button>
                          <button
                            onClick={() => handleCancelBooking(booking)}
                            className={`btn btn-warning btn-sm ${
                              actionLoading === booking._id ? "loading" : ""
                            }`}
                            disabled={actionLoading === booking._id}
                          >
                            Cancel
                          </button>
                        </>
                      )}

                      {(booking.status === "cancelled" ||
                        booking.status === "completed") && (
                        <button
                          onClick={() => handleDeleteBooking(booking)}
                          className={`btn btn-error btn-sm ${
                            actionLoading === booking._id ? "loading" : ""
                          }`}
                          disabled={actionLoading === booking._id}
                        >
                          Delete
                        </button>
                      )}

                      <Link
                        to={`/car/${booking.carId}`}
                        className="btn btn-primary btn-sm"
                      >
                        View Car
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modify Booking Modal */}
      <ModifyBookingModal
        booking={selectedBooking}
        isOpen={showModifyModal}
        onClose={() => {
          setShowModifyModal(false);
          setSelectedBooking(null);
        }}
        onBookingUpdated={handleBookingUpdated}
      />
    </div>
  );
};

export default MyBookingsPage;
