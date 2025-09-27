import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { useAuth } from "../../contexts/AuthProvider";
import { toast } from "react-toastify";
import { authAxios } from "../../components/utils/AuthUtils";
import axios from "axios";

const UpdateCarPage = () => {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [car, setCar] = useState(null);

  const [formData, setFormData] = useState({
    model: "",
    dailyRentalPrice: "",
    availability: true,
    vehicleRegistrationNumber: "",
    features: "",
    description: "",
    imageUrl: "",
    location: "",
  });

  useEffect(() => {
    fetchCarDetails();
  }, [id]);

  const fetchCarDetails = async () => {
    try {
      const response = await axios.get(`https://a11-autovoyage.vercel.app/cars/${id}`);
      const carData = response.data;

      // ✅ Security Check: Only owner can update
      if (carData.ownerEmail !== currentUser.email) {
        toast.error("You can only update your own cars!");
        navigate("/my-cars");
        return;
      }

      setCar(carData);
      setFormData({
        model: carData.model || "",
        dailyRentalPrice: carData.dailyRentalPrice || "",
        availability: carData.availability ?? true,
        vehicleRegistrationNumber: carData.vehicleRegistrationNumber || "",
        features: carData.features || "",
        description: carData.description || "",
        imageUrl: carData.imageUrl || "",
        location: carData.location || "",
      });
    } catch (error) {
      console.error("Error fetching car:", error);
      toast.error("Car not found!");
      navigate("/my-cars");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdateLoading(true);

    // Validation
    if (
      !formData.model ||
      !formData.dailyRentalPrice ||
      !formData.vehicleRegistrationNumber
    ) {
      toast.error("Please fill in all required fields");
      setUpdateLoading(false);
      return;
    }

    const updateData = {
      ...formData,
      dailyRentalPrice: parseFloat(formData.dailyRentalPrice),
    };

    try {
      const response = await authAxios(
        `https://a11-autovoyage.vercel.app/cars/${id}`,
        "PUT",
        updateData,
        currentUser
      );

      if (response.data.success) {
        toast.success("Car updated successfully!");
        navigate("/my-cars");
      }
    } catch (error) {
      console.error("Error updating car:", error);
      if (error.response?.status === 403) {
        toast.error("You can only update your own cars!");
      } else {
        toast.error("Failed to update car!");
      }
    } finally {
      setUpdateLoading(false);
    }
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
        <button
          onClick={() => navigate("/my-cars")}
          className="btn btn-primary"
        >
          Back to My Cars
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Update Car</h2>
          <button
            onClick={() => navigate("/my-cars")}
            className="btn btn-outline"
          >
            ← Back to My Cars
          </button>
        </div>

        <div className="alert alert-info mb-6">
          <span>
            Updating car: <strong>{car.model}</strong>
            (Owner: {car.ownerName})
          </span>
        </div>

        <form
          onSubmit={handleSubmit}
          className="card bg-base-100 shadow-xl p-8"
        >
          {/* Car Model */}
          <div className="form-control mb-4">
            <label className="label">
              <span className="label-text font-semibold">Car Model *</span>
            </label>
            <input
              type="text"
              name="model"
              value={formData.model}
              onChange={handleInputChange}
              placeholder="Example: Toyota Camry 2023"
              className="input input-bordered w-full"
              required
            />
          </div>

          {/* Daily Rental Price */}
          <div className="form-control mb-4">
            <label className="label">
              <span className="label-text font-semibold">
                Daily Rental Price (BDT) *
              </span>
            </label>
            <input
              type="number"
              name="dailyRentalPrice"
              value={formData.dailyRentalPrice}
              onChange={handleInputChange}
              placeholder="Example: 45 (Min 10 BDT)"
              className="input input-bordered w-full"
              min="10"
              required
            />
          </div>

          {/* Availability */}
          <div className="form-control mb-4">
            <label className="cursor-pointer label justify-start gap-3">
              <input
                type="checkbox"
                name="availability"
                checked={formData.availability}
                onChange={handleInputChange}
                className="checkbox checkbox-primary"
              />
              <span className="label-text font-semibold">
                Available for rent
              </span>
            </label>
          </div>

          {/* Vehicle Registration Number */}
          <div className="form-control mb-4">
            <label className="label">
              <span className="label-text font-semibold">
                Vehicle Registration Number *
              </span>
            </label>
            <input
              type="text"
              name="vehicleRegistrationNumber"
              value={formData.vehicleRegistrationNumber}
              onChange={handleInputChange}
              placeholder="Example: DHK-1234"
              className="input input-bordered w-full"
              required
            />
          </div>

          {/* Features */}
          <div className="form-control mb-4">
            <label className="label">
              <span className="label-text font-semibold">Features</span>
            </label>
            <input
              type="text"
              name="features"
              value={formData.features}
              onChange={handleInputChange}
              placeholder="Example: GPS, AC, Bluetooth, Sunroof"
              className="input input-bordered w-full"
            />
          </div>

          {/* Description */}
          <div className="form-control mb-4">
            <label className="label">
              <span className="label-text font-semibold">Description</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Describe your car..."
              className="textarea textarea-bordered h-24"
              rows="3"
            ></textarea>
          </div>

          {/* Image URL */}
          <div className="form-control mb-4">
            <label className="label">
              <span className="label-text font-semibold">Image URL</span>
            </label>
            <input
              type="url"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleInputChange}
              placeholder="Example: https://example.com/car-image.jpg"
              className="input input-bordered w-full"
            />
          </div>

          {/* Location */}
          <div className="form-control mb-6">
            <label className="label">
              <span className="label-text font-semibold">Location</span>
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              placeholder="Example: Dhaka, Chittagong"
              className="input input-bordered w-full"
            />
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => navigate("/my-cars")}
              className="btn btn-outline flex-1"
              disabled={updateLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`btn btn-primary flex-1 ${
                updateLoading ? "loading" : ""
              }`}
              disabled={updateLoading}
            >
              {updateLoading ? "Updating Car..." : "Update Car"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateCarPage;
