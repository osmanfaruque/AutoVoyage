import React, { useState, useEffect } from "react";
import { Link } from "react-router";
import axios from "axios";

const RecentListings = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecentCars();
  }, []);

  const fetchRecentCars = async () => {
    try {
      const response = await axios.get("https://a11-autovoyage.vercel.app/cars", {
        params: {
          sort: "datePosted",
          order: "desc",
        },
      });

      //most recent 6 cars
      const recentCars = response.data.slice(0, 6);
      setCars(recentCars);
    } catch (error) {
      console.error("Error fetching recent cars:", error);
      setCars([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Added today";
    if (diffDays === 1) return "Added yesterday";
    if (diffDays < 7) return `Added ${diffDays} days ago`;
    if (diffDays < 30) return `Added ${Math.floor(diffDays / 7)} weeks ago`;
    return `Added ${Math.floor(diffDays / 30)} months ago`;
  };

  if (loading) {
    return (
      <section className="py-20 bg-base-100">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-8">Recent Listings</h2>
          <div className="loading loading-spinner loading-lg"></div>
          <p className="mt-4 text-gray-500">Loading recent cars...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-base-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-10 sm:mb-12 lg:mb-16">
          Recent Listings
        </h2>

        {cars.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-5xl sm:text-6xl mb-4">🚗</div>
            <p className="text-lg sm:text-xl text-gray-500 mb-4">No cars available yet.</p>
            <p className="text-gray-400 mb-6">Be the first to add your car!</p>
            <Link to="/add-car" className="btn btn-primary btn-md sm:btn-lg">
              Add Your First Car
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-6 lg:gap-8">
              {cars.map((car) => (
                <div
                  key={car._id}
                  className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] sm:hover:scale-105"
                >
                  <figure className="h-44 sm:h-48">
                    <img
                      src={
                        car.imageUrl ||
                        "https://via.placeholder.com/400x200?text=Car+Image"
                      }
                      alt={car.model}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        e.target.src =
                          "https://via.placeholder.com/400x200?text=Car+Image";
                      }}
                    />
                  </figure>
                  <div className="card-body p-4 sm:p-6">
                    <h3 className="card-title text-base sm:text-lg font-bold">
                      {car.model}
                    </h3>

                    {/* Description snippet */}
                    {car.description && (
                      <p className="text-gray-600 text-sm">
                        {car.description.length > 60
                          ? car.description.substring(0, 60) + "..."
                          : car.description}
                      </p>
                    )}

                    <div className="flex justify-between items-center mt-2">
                      <span className="text-xl sm:text-2xl font-bold text-primary">
                        ${car.dailyRentalPrice}/day
                      </span>
                      <span
                        className={`badge badge-sm sm:badge-md ${
                          car.availability ? "badge-success" : "badge-error"
                        }`}
                      >
                        {car.availability ? "Available" : "Not Available"}
                      </span>
                    </div>

                    <div className="text-xs sm:text-sm text-gray-500 space-y-1 mt-3">
                      {car.location && <p>📍 {car.location}</p>}
                      <p>🚗 Bookings: {car.bookingCount || 0}</p>
                      <p>👤 Owner: {car.ownerName}</p>
                      <p className="text-xs text-primary font-medium">
                        {formatDate(car.datePosted)}
                      </p>
                    </div>

                    <div className="card-actions justify-end mt-4">
                      <Link
                        to={`/car/${car._id}`}
                        className="btn btn-primary btn-sm"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* View All Cars Button */}
            <div className="text-center mt-8 sm:mt-10 lg:mt-12">
              <Link
                to="/available-cars"
                className="btn btn-outline btn-primary btn-md sm:btn-lg"
              >
                View All Cars ({cars.length < 6 ? cars.length : "6+"} available)
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default RecentListings;
