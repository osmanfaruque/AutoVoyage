import React from "react";
import { Link } from "react-router";

const MyCarsTable = ({
  cars,
  onUpdate,
  onDelete,
  onToggleAvailability,
  deleteLoading,
  formatDate,
}) => {
  return (
    <div className="overflow-x-auto">
      <table className="table table-zebra w-full">
        <thead>
          <tr>
            <th>Car Image</th>
            <th>Car Model</th>
            <th>Daily Rental Price</th>
            <th>Booking Count</th>
            <th>Availability</th>
            <th>Date Added</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {cars.map((car) => (
            <tr key={car._id} className="hover">
              {/* Car Image */}
              <td>
                <div className="avatar">
                  <div className="mask mask-squircle w-16 h-16">
                    <img
                      src={
                        car.imageUrl ||
                        "https://via.placeholder.com/64x64?text=Car"
                      }
                      alt={car.model}
                      onError={(e) => {
                        e.target.src =
                          "https://via.placeholder.com/64x64?text=Car";
                      }}
                    />
                  </div>
                </div>
              </td>

              {/* Car Model */}
              <td>
                <div className="font-bold">{car.model}</div>
                <div className="text-sm opacity-50">
                  {car.vehicleRegistrationNumber}
                </div>
              </td>

              {/* Daily Rental Price */}
              <td>
                <span className="font-bold text-primary">
                  ${car.dailyRentalPrice}/day
                </span>
              </td>

              {/* Booking Count */}
              <td>
                <div className="badge badge-info">
                  {car.bookingCount || 0} bookings
                </div>
              </td>

              {/* Availability */}
              <td>
                <div className="flex items-center gap-2">
                  <span
                    className={`badge ${
                      car.availability ? "badge-success" : "badge-error"
                    }`}
                  >
                    {car.availability ? "Available" : "Unavailable"}
                  </span>
                  <button
                    onClick={() => onToggleAvailability(car)}
                    className={`btn btn-xs ${
                      car.availability ? "btn-warning" : "btn-success"
                    }`}
                    title={`Mark as ${
                      car.availability ? "unavailable" : "available"
                    }`}
                  >
                    {car.availability ? "🔒" : "🔓"}
                  </button>
                </div>
              </td>

              {/* Date Added */}
              <td>
                <div className="text-sm">{formatDate(car.datePosted)}</div>
                <div className="text-xs opacity-50">{car.location}</div>
              </td>

              {/* Actions */}
              <td>
                <div className="flex gap-1">
                  <Link
                    to={`/car/${car._id}`}
                    className="btn btn-outline btn-xs"
                    title="View Details"
                  >
                    👁️
                  </Link>

                  {/*Update Button*/}
                  <button
                    onClick={() => onUpdate(car)}
                    className="btn btn-primary btn-xs"
                    title="Update Car"
                  >
                    ✏️
                  </button>

                  {/* Delete Button */}
                  <button
                    onClick={() => onDelete(car)}
                    className="btn btn-error btn-xs"
                    disabled={deleteLoading === car._id}
                    title="Delete Car"
                  >
                    {deleteLoading === car._id ? (
                      <span className="loading loading-spinner loading-xs"></span>
                    ) : (
                      "🗑️"
                    )}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MyCarsTable;
