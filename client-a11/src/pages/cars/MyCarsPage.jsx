import React, { useState, useEffect } from "react";
import { Link } from "react-router";
import { useAuth } from "../../contexts/AuthProvider";
import { authAxios } from "../../components/utils/AuthUtils";
import Swal from "sweetalert2";
import UpdateCarModal from "../../components/my-cars-section/UpdateCarModal";
import MyCarsTable from "../../components/my-cars-section/MyCarsTable";
import SortControls from "../../components/shared/SortControls";

const MyCarsPage = () => {
  const { currentUser } = useAuth();
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedCar, setSelectedCar] = useState(null);
  const [sortBy, setSortBy] = useState("datePosted");
  const [sortOrder, setSortOrder] = useState("desc");

  useEffect(() => {
    if (currentUser) {
      fetchMyCars();
    }
  }, [currentUser, sortBy, sortOrder]);

  const fetchMyCars = async () => {
    try {
      setLoading(true);

      const response = await authAxios(
        "https://a11-autovoyage.vercel.app/cars",
        "GET",
        null,
        currentUser
      );

      // Filter by current user's email and sort
      const myCars = response.data
        .filter((car) => car.ownerEmail === currentUser.email)
        .sort((a, b) => {
          if (sortBy === "datePosted") {
            const dateA = new Date(a[sortBy]);
            const dateB = new Date(b[sortBy]);
            return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
          } else if (
            sortBy === "dailyRentalPrice" ||
            sortBy === "bookingCount"
          ) {
            return sortOrder === "desc"
              ? b[sortBy] - a[sortBy]
              : a[sortBy] - b[sortBy];
          } else {
            return sortOrder === "desc"
              ? b[sortBy].localeCompare(a[sortBy])
              : a[sortBy].localeCompare(b[sortBy]);
          }
        });

      setCars(myCars);
    } catch (error) {
      console.error("Error fetching cars:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateCar = (car) => {
    setSelectedCar(car);
    setShowUpdateModal(true);
  };

  const handleCarUpdated = (updatedCar) => {
    setCars((prevCars) =>
      prevCars.map((car) => (car._id === updatedCar._id ? updatedCar : car))
    );
  };

  const handleSortChange = (newSortBy) => {
    setSortBy(newSortBy);
  };

  const handleSortOrderChange = (newOrder) => {
    setSortOrder(newOrder);
  };

  const handleDeleteCar = async (car) => {
    const result = await Swal.fire({
      title: "Delete Car?",
      text: `Are you sure you want to delete "${car.model}"? This action cannot be undone!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, Delete Car",
      cancelButtonText: "Keep Car",
    });

    if (result.isConfirmed) {
      setDeleteLoading(car._id);

      try {
        const response = await authAxios(
          `https://a11-autovoyage.vercel.app/cars/${car._id}`,
          "DELETE",
          null,
          currentUser
        );

        if (response.data.success) {
          setCars((prevCars) => prevCars.filter((c) => c._id !== car._id));

          Swal.fire({
            icon: "success",
            title: "Car Deleted!",
            text: "Your car has been deleted successfully.",
            timer: 2000,
            showConfirmButton: false,
          });
        }
      } catch (error) {
        console.error("Error deleting car:", error);
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: "Failed to delete car. Please try again.",
        });
      } finally {
        setDeleteLoading(null);
      }
    }
  };

  const handleToggleAvailability = async (car) => {
    try {
      const updateData = {
        availability: !car.availability,
      };

      const response = await authAxios(
        `https://a11-autovoyage.vercel.app/cars/${car._id}`,
        "PUT",
        updateData,
        currentUser
      );

      if (response.data.success) {
        setCars((prevCars) =>
          prevCars.map((c) =>
            c._id === car._id ? { ...c, availability: !car.availability } : c
          )
        );
      }
    } catch (error) {
      console.error("Error updating availability:", error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // SORT OPTIONS
  const sortOptions = [
    { value: "datePosted", label: "Date Added" },
    { value: "dailyRentalPrice", label: "Price" },
    { value: "model", label: "Car Model" },
    { value: "bookingCount", label: "Popularity" },
  ];

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="loading loading-spinner loading-lg"></div>
        <p className="mt-4">Loading your cars...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-4xl font-bold">My Cars</h1>
          <p className="text-gray-600 mt-2">Manage your rental car listings</p>
        </div>
        <Link to="/add-car" className="btn btn-primary">
          Add New Car
        </Link>
      </div>

      {/*SORT CONTROLS */}
      {cars.length > 0 && (
        <div className="card bg-base-100 shadow-xl p-6 mb-8">
          <SortControls
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSortChange={handleSortChange}
            onOrderChange={handleSortOrderChange}
            sortOptions={sortOptions}
          />
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="stat bg-base-100 shadow rounded-lg">
          <div className="stat-title">Total Cars</div>
          <div className="stat-value text-primary">{cars.length}</div>
        </div>
        <div className="stat bg-base-100 shadow rounded-lg">
          <div className="stat-title">Available</div>
          <div className="stat-value text-success">
            {cars.filter((car) => car.availability).length}
          </div>
        </div>
        <div className="stat bg-base-100 shadow rounded-lg">
          <div className="stat-title">Total Bookings</div>
          <div className="stat-value text-warning">
            {cars.reduce((sum, car) => sum + (car.bookingCount || 0), 0)}
          </div>
        </div>
        <div className="stat bg-base-100 shadow rounded-lg">
          <div className="stat-title">Avg. Price</div>
          <div className="stat-value text-info">
            $
            {cars.length > 0
              ? Math.round(
                  cars.reduce((sum, car) => sum + car.dailyRentalPrice, 0) /
                    cars.length
                )
              : 0}
          </div>
        </div>
      </div>

      {cars.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🚗</div>
          <h2 className="text-2xl font-bold mb-4">No Cars Added Yet</h2>
          <p className="text-gray-600 mb-6">
            Start earning by adding your first car to rent!
          </p>
          <Link to="/add-car" className="btn btn-primary btn-lg">
            Add Your First Car
          </Link>
        </div>
      ) : (
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body p-0">
            <MyCarsTable
              cars={cars}
              onUpdate={handleUpdateCar}
              onDelete={handleDeleteCar}
              onToggleAvailability={handleToggleAvailability}
              deleteLoading={deleteLoading}
              formatDate={formatDate}
            />
          </div>
        </div>
      )}

      {/*UPDATE CAR MODAL */}
      <UpdateCarModal
        car={selectedCar}
        isOpen={showUpdateModal}
        onClose={() => {
          setShowUpdateModal(false);
          setSelectedCar(null);
        }}
        onCarUpdated={handleCarUpdated}
      />
    </div>
  );
};

export default MyCarsPage;
