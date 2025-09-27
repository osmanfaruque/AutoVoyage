import React, { useState, useEffect } from "react";
import { Link } from "react-router";
import axios from "axios";
import LayoutToggle from "../../components/shared/LayoutToggle";
import SortControls from "../../components/shared/SortControls";

const AvailableCarsPage = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("datePosted");
  const [sortOrder, setSortOrder] = useState("desc");

  // FOR LAYOUT TOGGLE
  const [viewMode, setViewMode] = useState("grid");

  useEffect(() => {
    fetchCars();
  }, [searchTerm, sortBy, sortOrder]);

  const fetchCars = async () => {
    setLoading(true);
    try {
      const params = {
        sort: sortBy,
        order: sortOrder,
      };

      if (searchTerm.trim()) {
        params.search = searchTerm.trim();
      }

      const response = await axios.get("https://a11-autovoyage.vercel.app/cars", {
        params,
      });
      setCars(response.data);
    } catch (error) {
      console.error("Error fetching cars:", error);
      setCars([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const clearSearch = () => {
    setSearchTerm("");
  };

  // SORT OPTIONS
  const sortOptions = [
    { value: "datePosted", label: "Date Posted" },
    { value: "dailyRentalPrice", label: "Price" },
    { value: "model", label: "Car Model" },
    { value: "bookingCount", label: "Popularity" },
  ];

  // SORT HANDLERS
  const handleSortChange = (newSortBy) => {
    setSortBy(newSortBy);
  };

  const handleSortOrderChange = (newOrder) => {
    setSortOrder(newOrder);
  };

  // GRID VIEW COMPONENT
  const GridView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {cars.map((car) => (
        <div
          key={car._id}
          className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
        >
          <figure className="h-48">
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
          <div className="card-body">
            <h2 className="card-title">{car.model}</h2>
            <p className="text-gray-600 text-sm">
              {car.description
                ? car.description.length > 100
                  ? car.description.substring(0, 100) + "..."
                  : car.description
                : "No description available"}
            </p>

            <div className="flex justify-between items-center my-3">
              <span className="text-2xl font-bold text-primary">
                ${car.dailyRentalPrice}/day
              </span>
              <span
                className={`badge ${
                  car.availability ? "badge-success" : "badge-error"
                }`}
              >
                {car.availability ? "Available" : "Not Available"}
              </span>
            </div>

            <div className="text-sm text-gray-500 space-y-1">
              {car.location && <p>📍 {car.location}</p>}
              {car.features && <p>⚙️ {car.features}</p>}
              <p>📅 Posted: {formatDate(car.datePosted)}</p>
              <p>🚗 Bookings: {car.bookingCount || 0}</p>
              <p>👤 Owner: {car.ownerName}</p>
            </div>

            <div className="card-actions justify-end mt-4">
              <Link to={`/car/${car._id}`} className="btn btn-primary">
                View Details
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  // LIST VIEW COMPONENT
  const ListView = () => (
    <div className="space-y-4">
      {cars.map((car) => (
        <div
          key={car._id}
          className="card bg-base-100 shadow-lg hover:shadow-xl transition-shadow duration-300"
        >
          <div className="card-body">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Car Image */}
              <div className="flex-shrink-0">
                <img
                  src={
                    car.imageUrl ||
                    "https://via.placeholder.com/200x120?text=Car+Image"
                  }
                  alt={car.model}
                  className="w-full lg:w-48 h-32 object-cover rounded-lg"
                  onError={(e) => {
                    e.target.src =
                      "https://via.placeholder.com/200x120?text=Car+Image";
                  }}
                />
              </div>

              {/* Car Details */}
              <div className="flex-grow">
                <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start">
                  <div className="flex-grow">
                    <h2 className="card-title text-2xl mb-2">{car.model}</h2>
                    <p className="text-gray-600 mb-3">
                      {car.description || "No description available"}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-500">
                      {car.location && <p>📍 {car.location}</p>}
                      {car.features && <p>⚙️ {car.features}</p>}
                      <p>📅 Posted: {formatDate(car.datePosted)}</p>
                      <p>🚗 Bookings: {car.bookingCount || 0}</p>
                      <p>👤 Owner: {car.ownerName}</p>
                    </div>
                  </div>

                  {/* Price and Actions */}
                  <div className="flex flex-col items-end mt-4 lg:mt-0 lg:ml-6">
                    <span className="text-3xl font-bold text-primary mb-2">
                      ${car.dailyRentalPrice}/day
                    </span>
                    <span
                      className={`badge badge-lg mb-4 ${
                        car.availability ? "badge-success" : "badge-error"
                      }`}
                    >
                      {car.availability ? "Available" : "Not Available"}
                    </span>
                    <Link to={`/car/${car._id}`} className="btn btn-primary">
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">Available Cars</h1>

      {/* Search, Filter, and Layout Controls */}
      <div className="card bg-base-100 shadow-xl p-6 mb-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-end">
          {/* Search */}
          <div className="lg:col-span-4">
            <label className="label">
              <span className="label-text font-semibold">Search Cars</span>
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search by model, location, features..."
                className="input input-bordered w-full pr-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button
                  onClick={clearSearch}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 btn btn-ghost btn-xs"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Sort Controls */}
          <div className="lg:col-span-6">
            <SortControls
              sortBy={sortBy}
              sortOrder={sortOrder}
              onSortChange={handleSortChange}
              onOrderChange={handleSortOrderChange}
              sortOptions={sortOptions}
            />
          </div>

          {/* LAYOUT TOGGLE */}
          <div className="lg:col-span-2">
            <label className="label">
              <span className="label-text font-semibold">View</span>
            </label>
            <LayoutToggle viewMode={viewMode} onViewModeChange={setViewMode} />
          </div>
        </div>
      </div>

      {/* Results Summary */}
      {!loading && (
        <div className="mb-6 text-center">
          <p className="text-lg text-gray-600">
            {searchTerm
              ? `Found ${cars.length} cars matching "${searchTerm}"`
              : `Showing ${cars.length} cars`}
            {sortBy !== "datePosted" && (
              <span className="ml-2 text-sm">
                (sorted by {sortBy === "dailyRentalPrice" ? "price" : "model"} -{" "}
                {sortOrder === "desc" ? "high to low" : "low to high"})
              </span>
            )}
            <span className="ml-4 text-sm">
              📊 View: <strong className="capitalize">{viewMode}</strong>
            </span>
          </p>
        </div>
      )}

      {/* Cars Display */}
      {loading ? (
        <div className="text-center py-12">
          <div className="loading loading-spinner loading-lg"></div>
          <p className="mt-4 text-gray-500">Loading cars...</p>
        </div>
      ) : cars.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🚗</div>
          <p className="text-xl text-gray-500 mb-4">
            {searchTerm
              ? "No cars found matching your search"
              : "No cars available yet"}
          </p>
          {searchTerm && (
            <button onClick={clearSearch} className="btn btn-outline mr-4">
              Clear Search
            </button>
          )}
          <Link to="/add-car" className="btn btn-primary">
            Add Your Car
          </Link>
        </div>
      ) : (
        // CONDITIONAL RENDERING BASED ON VIEW MODE
        <div>{viewMode === "grid" ? <GridView /> : <ListView />}</div>
      )}

      {/* Back to Top Button */}
      {cars.length > 6 && (
        <div className="text-center mt-12">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="btn btn-outline"
          >
            Back to Top ↑
          </button>
        </div>
      )}
    </div>
  );
};

export default AvailableCarsPage;
