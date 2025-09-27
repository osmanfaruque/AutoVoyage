import React from "react";
import { FaSortAmountDown, FaSortAmountUp, FaFilter } from "react-icons/fa";

const SortControls = ({
  sortBy,
  sortOrder,
  onSortChange,
  onOrderChange,
  sortOptions = [],
  showFilters = false,
  onToggleFilters,
}) => {
  const getSortIcon = () => {
    return sortOrder === "asc" ? <FaSortAmountUp /> : <FaSortAmountDown />;
  };

  const getSortOrderText = (field) => {
    switch (field) {
      case "datePosted":
        return sortOrder === "desc" ? "Newest First" : "Oldest First";
      case "dailyRentalPrice":
        return sortOrder === "desc" ? "High to Low" : "Low to High";
      case "model":
        return sortOrder === "desc" ? "Z to A" : "A to Z";
      case "bookingCount":
        return sortOrder === "desc" ? "Most Popular" : "Least Popular";
      default:
        return sortOrder === "desc" ? "Descending" : "Ascending";
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
      {/* Sort By Dropdown */}
      <div className="form-control w-full sm:w-auto">
        <label className="label">
          <span className="label-text font-semibold">Sort By</span>
        </label>
        <select
          className="select select-bordered w-full sm:w-48"
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Sort Order Toggle */}
      <div className="form-control w-full sm:w-auto">
        <label className="label">
          <span className="label-text font-semibold">Order</span>
        </label>
        <button
          onClick={() => onOrderChange(sortOrder === "asc" ? "desc" : "asc")}
          className="btn btn-outline w-full sm:w-auto flex items-center gap-2"
          title={`Click to sort ${
            sortOrder === "asc" ? "descending" : "ascending"
          }`}
        >
          {getSortIcon()}
          <span className="hidden sm:inline">{getSortOrderText(sortBy)}</span>
          <span className="sm:hidden">{sortOrder.toUpperCase()}</span>
        </button>
      </div>

      {/* Advanced Filters Toggle */}
      {onToggleFilters && (
        <div className="form-control w-full sm:w-auto">
          <label className="label">
            <span className="label-text font-semibold">Filters</span>
          </label>
          <button
            onClick={onToggleFilters}
            className={`btn w-full sm:w-auto ${
              showFilters ? "btn-primary" : "btn-outline"
            }`}
          >
            <FaFilter />
            <span className="ml-2">
              {showFilters ? "Hide" : "Show"} Filters
            </span>
          </button>
        </div>
      )}

      {/* Current Sort Display */}
      <div className="hidden lg:block text-sm text-gray-600 mt-6">
        <p>
          Sorting by{" "}
          <strong>
            {sortOptions.find((opt) => opt.value === sortBy)?.label}
          </strong>
        </p>
        <p>{getSortOrderText(sortBy)}</p>
      </div>
    </div>
  );
};

export default SortControls;
