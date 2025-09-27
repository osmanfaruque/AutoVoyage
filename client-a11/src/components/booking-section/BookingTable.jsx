import React from "react";
import { Link } from "react-router";
import { FaTrash, FaCalendarAlt, FaEye } from "react-icons/fa";

const BookingTable = ({
  bookings,
  onModify,
  onCancel,
  onDelete,
  actionLoading,
  formatDate,
  getStatusBadge,
}) => {
  return (
    <div className="overflow-x-auto shadow-lg rounded-lg">
      <table className="table w-full">
        <thead>
          <tr className="bg-base-300">
            <th className="font-bold text-base-content">Car Image</th>
            <th className="font-bold text-base-content">Car Model</th>
            <th className="font-bold text-base-content">Booking Date</th>
            <th className="font-bold text-base-content">Total Price</th>
            <th className="font-bold text-base-content">Booking Status</th>
            <th className="font-bold text-base-content">Actions</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking, index) => (
            <tr
              key={booking._id}
              className={`
                ${index % 2 === 0 ? "bg-base-100" : "bg-base-50"} 
                hover:bg-base-200 hover:shadow-md transition-all duration-200
              `}
            >
              <td className="p-4">
                <div className="avatar">
                  <div className="mask mask-squircle w-16 h-16">
                    <img
                      src={
                        booking.carImageUrl ||
                        "https://via.placeholder.com/64x64?text=No+Image"
                      }
                      alt={booking.carModel}
                      className="object-cover w-full h-full"
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.nextSibling.style.display = "flex";
                      }}
                    />
                    <div
                      className="w-full h-full bg-gray-200 flex items-center justify-center text-2xl"
                      style={{ display: "none" }}
                    >
                      🚗
                    </div>
                  </div>
                </div>
              </td>

              {/* Car Model */}
              <td className="p-4">
                <div className="font-semibold text-base-content">
                  {booking.carModel}
                </div>
                <div className="text-sm text-base-content/70">
                  Owner: {booking.carOwner}
                </div>
              </td>

              {/* Booking Date */}
              <td className="p-4">
                <div className="text-sm font-medium">
                  {booking.bookingDate ? (
                    <>
                      {new Date(booking.bookingDate).toLocaleDateString(
                        "en-GB",
                        {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        }
                      )}{" "}
                      {new Date(booking.bookingDate).toLocaleTimeString(
                        "en-GB",
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}
                    </>
                  ) : (
                    "N/A"
                  )}
                </div>
                <div className="text-xs text-base-content/60">
                  Rental: {formatDate(booking.startDate)} -{" "}
                  {formatDate(booking.endDate)}
                </div>
              </td>

              {/* Total Price */}
              <td className="p-4">
                <div className="font-bold text-lg text-primary">
                  ${booking.totalCost || 0}
                </div>
                <div className="text-xs text-base-content/60">
                  {booking.totalDays || 0} days
                </div>
              </td>

              {/* Booking Status */}
              <td className="p-4">
                <span className={getStatusBadge(booking.status)}>
                  {booking.status ? booking.status.toUpperCase() : "UNKNOWN"}
                </span>
              </td>

              {/* Action Buttons */}
              <td className="p-4">
                <div className="flex gap-2 flex-wrap">
                  {/* Modify Booking Date button */}
                  {booking.status === "pending" && (
                    <button
                      onClick={() => onModify(booking)}
                      className="btn btn-info btn-sm flex items-center gap-1"
                      title="Modify booking dates"
                    >
                      <FaCalendarAlt className="w-3 h-3" />
                      <span className="hidden sm:inline">Modify Date</span>
                      <span className="sm:hidden">Modify</span>
                    </button>
                  )}

                  {/* Cancel Booking button */}
                  {booking.status === "pending" && (
                    <button
                      onClick={() => onCancel(booking)}
                      className={`btn btn-error btn-sm flex items-center gap-1 ${
                        actionLoading === booking._id ? "loading" : ""
                      }`}
                      disabled={actionLoading === booking._id}
                      title="Cancel this booking"
                    >
                      {actionLoading === booking._id ? (
                        <span className="loading loading-spinner loading-xs"></span>
                      ) : (
                        <>
                          <FaTrash className="w-3 h-3" />
                          <span className="hidden sm:inline">Cancel</span>
                          <span className="sm:hidden">Cancel</span>
                        </>
                      )}
                    </button>
                  )}

                  {/* Delete Button for cancelled/completed bookings */}
                  {(booking.status === "cancelled" ||
                    booking.status === "completed") && (
                    <button
                      onClick={() => onDelete(booking)}
                      className={`btn btn-error btn-sm flex items-center gap-1 ${
                        actionLoading === booking._id ? "loading" : ""
                      }`}
                      disabled={actionLoading === booking._id}
                      title="Delete this booking permanently"
                    >
                      {actionLoading === booking._id ? (
                        <span className="loading loading-spinner loading-xs"></span>
                      ) : (
                        <>
                          <FaTrash className="w-3 h-3" />
                          <span>Delete</span>
                        </>
                      )}
                    </button>
                  )}

                  {/* View Car Details */}
                  <Link
                    to={`/car/${booking.carId}`}
                    className="btn btn-outline btn-sm flex items-center gap-1"
                    title="View car details"
                  >
                    <FaEye className="w-3 h-3" />
                    <span className="hidden sm:inline">View</span>
                  </Link>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BookingTable;