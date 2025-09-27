import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthProvider";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import { authAxios } from "../../components/utils/AuthUtils";

const AddCarForm = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

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

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validation if required fields are not filled
    if (
      !formData.model ||
      !formData.dailyRentalPrice ||
      !formData.vehicleRegistrationNumber
    ) {
      toast.error("Please fill in all required fields");
      setLoading(false);
      return;
    }

    // current user data included
    const submitData = {
      ...formData,
      dailyRentalPrice: parseFloat(formData.dailyRentalPrice),
      ownerEmail: currentUser.email,
      ownerName: currentUser.displayName || currentUser.email,
    };

    try {
      const response = await authAxios(
        "https://a11-autovoyage.vercel.app/cars",
        "POST",
        submitData,
        currentUser
      );

      if (response.data.success) {
        toast.success("Car added successfully!");

        // Form Reset
        setFormData({
          model: "",
          dailyRentalPrice: "",
          availability: true,
          vehicleRegistrationNumber: "",
          features: "",
          description: "",
          imageUrl: "",
          location: "",
        });

        navigate("/available-cars");
      }
    } catch (error) {
      console.error("Error adding car:", error);
      if (error.response?.status === 401) {
        toast.error("Authentication failed. Please login again.");
      } else {
        toast.error("Failed to add car!");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="loading loading-spinner loading-lg"></div>
        <p className="mt-4">Loading user information...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8">Add Your Car</h2>

        <div className="alert alert-info mb-6">
          <span>
            Adding car as:{" "}
            <strong>
              {currentUser.displayName} ( {currentUser.email} ){" "}
            </strong>
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

          {/* Submit Button */}
          <div className="form-control">
            <button
              type="submit"
              className={`btn btn-primary w-full ${loading ? "loading" : ""}`}
              disabled={loading}
            >
              {loading ? "Adding Car..." : "Add Car"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCarForm;
