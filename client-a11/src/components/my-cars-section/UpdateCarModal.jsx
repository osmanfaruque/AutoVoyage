import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthProvider";
import { authAxios } from "../utils/AuthUtils";
import Swal from "sweetalert2";

const UpdateCarModal = ({ car, isOpen, onClose, onCarUpdated }) => {
  const { currentUser } = useAuth();
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

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (car && isOpen) {
      setFormData({
        model: car.model || "",
        dailyRentalPrice: car.dailyRentalPrice || "",
        availability: car.availability || true,
        vehicleRegistrationNumber: car.vehicleRegistrationNumber || "",
        features: car.features || "",
        description: car.description || "",
        imageUrl: car.imageUrl || "",
        location: car.location || "",
      });
      setErrors({});
    }
  }, [car, isOpen]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.model.trim()) {
      newErrors.model = "Car model is required";
    }

    if (!formData.dailyRentalPrice || formData.dailyRentalPrice <= 0) {
      newErrors.dailyRentalPrice = "Valid daily rental price is required";
    }

    if (!formData.vehicleRegistrationNumber.trim()) {
      newErrors.vehicleRegistrationNumber =
        "Vehicle registration number is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const result = await Swal.fire({
      title: "Update Car?",
      html: `
                <div class="text-left">
                    <p><strong>Model:</strong> ${formData.model}</p>
                    <p><strong>Price:</strong> $${
                      formData.dailyRentalPrice
                    }/day</p>
                    <p><strong>Status:</strong> ${
                      formData.availability ? "Available" : "Unavailable"
                    }</p>
                    <p><strong>Registration:</strong> ${
                      formData.vehicleRegistrationNumber
                    }</p>
                </div>
            `,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Update Car",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    setLoading(true);

    try {
      const updateData = {
        model: formData.model.trim(),
        dailyRentalPrice: parseFloat(formData.dailyRentalPrice),
        availability: formData.availability,
        vehicleRegistrationNumber: formData.vehicleRegistrationNumber.trim(),
        features: formData.features.trim(),
        description: formData.description.trim(),
        imageUrl: formData.imageUrl.trim(),
        location: formData.location.trim(),
      };

      const response = await authAxios(
        `https://a11-autovoyage.vercel.app/cars/${car._id}`,
        "PUT",
        updateData,
        currentUser
      );

      if (response.data.success) {
        Swal.fire({
          icon: "success",
          title: "Car Updated!",
          text: "Your car has been updated successfully.",
          timer: 2000,
          showConfirmButton: false,
        });

        onCarUpdated &&
          onCarUpdated({
            ...car,
            ...updateData,
          });

        onClose();
      }
    } catch (error) {
      console.error("Error updating car:", error);

      Swal.fire({
        icon: "error",
        title: "Update Failed!",
        text:
          error.response?.data?.error ||
          "Failed to update car. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !car) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-lg">Update Car Details</h3>
          <button
            onClick={onClose}
            className="btn btn-sm btn-circle btn-ghost"
            disabled={loading}
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Car Model */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Car Model *</span>
            </label>
            <input
              type="text"
              name="model"
              value={formData.model}
              onChange={handleInputChange}
              placeholder="e.g., Toyota Corolla 2022"
              className={`input input-bordered ${
                errors.model ? "input-error" : ""
              }`}
              required
            />
            {errors.model && (
              <label className="label">
                <span className="label-text-alt text-error">
                  {errors.model}
                </span>
              </label>
            )}
          </div>

          {/* Daily Rental Price */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">
                Daily Rental Price ($) *
              </span>
            </label>
            <input
              type="number"
              name="dailyRentalPrice"
              value={formData.dailyRentalPrice}
              onChange={handleInputChange}
              placeholder="50"
              min="1"
              step="0.01"
              className={`input input-bordered ${
                errors.dailyRentalPrice ? "input-error" : ""
              }`}
              required
            />
            {errors.dailyRentalPrice && (
              <label className="label">
                <span className="label-text-alt text-error">
                  {errors.dailyRentalPrice}
                </span>
              </label>
            )}
          </div>

          {/* Vehicle Registration Number */}
          <div className="form-control">
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
              placeholder="ABC-1234"
              className={`input input-bordered ${
                errors.vehicleRegistrationNumber ? "input-error" : ""
              }`}
              required
            />
            {errors.vehicleRegistrationNumber && (
              <label className="label">
                <span className="label-text-alt text-error">
                  {errors.vehicleRegistrationNumber}
                </span>
              </label>
            )}
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Features */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Features</span>
              </label>
              <input
                type="text"
                name="features"
                value={formData.features}
                onChange={handleInputChange}
                placeholder="AC, GPS, Automatic"
                className="input input-bordered"
              />
            </div>

            {/* Location */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Location</span>
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="Dhaka, Bangladesh"
                className="input input-bordered"
              />
            </div>
          </div>

          {/* Image URL */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Car Image URL</span>
            </label>
            <input
              type="url"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleInputChange}
              placeholder="https://example.com/car-image.jpg"
              className="input input-bordered"
            />
            {formData.imageUrl && (
              <div className="mt-2">
                <img
                  src={formData.imageUrl}
                  alt="Car preview"
                  className="w-32 h-20 object-cover rounded"
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
              </div>
            )}
          </div>

          {/* Description */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Description</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Describe your car..."
              className="textarea textarea-bordered h-24"
              rows={3}
            />
          </div>

          {/* Availability Toggle */}
          <div className="form-control">
            <label className="cursor-pointer label">
              <span className="label-text font-semibold">
                Availability Status
              </span>
              <input
                type="checkbox"
                name="availability"
                checked={formData.availability}
                onChange={handleInputChange}
                className="toggle toggle-success"
              />
            </label>
            <label className="label">
              <span className="label-text-alt">
                {formData.availability
                  ? "Car is available for rent"
                  : "Car is currently unavailable"}
              </span>
            </label>
          </div>

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
              disabled={loading}
            >
              {loading ? "Updating..." : "Update Car"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateCarModal;
