import React from "react";
import { FaTh, FaList } from "react-icons/fa";

const LayoutToggle = ({ viewMode, onViewModeChange }) => {
  return (
    <div className="join">
      <button
        className={`btn join-item ${
          viewMode === "grid" ? "btn-active btn-primary" : "btn-outline"
        }`}
        onClick={() => onViewModeChange("grid")}
        title="Grid View"
      >
        <FaTh />
        <span className="hidden sm:inline ml-2">Grid</span>
      </button>
      <button
        className={`btn join-item ${
          viewMode === "list" ? "btn-active btn-primary" : "btn-outline"
        }`}
        onClick={() => onViewModeChange("list")}
        title="List View"
      >
        <FaList />
        <span className="hidden sm:inline ml-2">List</span>
      </button>
    </div>
  );
};

export default LayoutToggle;
