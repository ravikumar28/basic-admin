import React, { useEffect } from "react";
import DateRangePicker from "../common/DateRangePicker";
import { usePatients } from "../../hooks/usePatients";

const STATUS_OPTIONS = [
  { value: "", label: "All Statuses" },
  { value: "scheduled", label: "Scheduled" },
  { value: "completed", label: "Completed" },
  { value: "pending", label: "Pending" },
  { value: "cancelled", label: "Cancelled" },
];

// Preset date options
const DATE_PRESETS = [
  { key: "today", label: "Today" },
  { key: "yesterday", label: "Yesterday" },
  { key: "last5days", label: "Last 5 Days" },
];

const FilterPanel = () => {
  const {
    filters,
    updateFilters,
    loadBranches,
    loadPatients,
    branches,
  } = usePatients();
  
  useEffect(() => {
    loadBranches();
    
    // Set default to last 5 days on initial load
    if (!filters.startDate && !filters.endDate) {
      const today = new Date('2025-05-31'); // Using the provided current date
      const startDate = new Date(today);
      startDate.setDate(startDate.getDate() - 4); // 4 days ago + today = 5 days
      
      updateFilters({
        startDate: startDate,
        endDate: today
      });
    }
    // eslint-disable-next-line
  }, []);

  const handleStartDateChange = (date) => updateFilters({ startDate: date });
  const handleEndDateChange = (date) => updateFilters({ endDate: date });
  const handleBranchChange = (e) => updateFilters({ branchId: e.target.value });
  const handleStatusChange = (e) => updateFilters({ status: e.target.value });

  const handleApplyFilters = () => loadPatients();
  const handleResetFilters = () => {
    updateFilters({
      startDate: null,
      endDate: null,
      branchId: "",
      status: "",
    });
  };

  // Handle date preset selection
  const handleDatePreset = (preset) => {
    const today = new Date('2025-05-31'); // Using the provided current date
    let startDate = null;
    let endDate = null;
    
    switch (preset) {
      case "today":
        startDate = new Date(today);
        endDate = new Date(today);
        break;
      case "yesterday":
        startDate = new Date(today);
        startDate.setDate(startDate.getDate() - 1);
        endDate = new Date(startDate);
        break;
      case "last5days":
        startDate = new Date(today);
        startDate.setDate(startDate.getDate() - 4); // 4 days ago + today = 5 days
        endDate = new Date(today);
        break;
      default:
        break;
    }
    
    updateFilters({ startDate, endDate });
  };

  const branchOptions = branches.map((branch) => ({
    value: branch.id,
    label: branch.name || branch.branch_name,
  }));

  // Custom styles for consistent alignment
  const customStyles = `
    /* Date picker custom styling */
    .react-datepicker-wrapper {
      width: 100%;
    }
    
    .react-datepicker__input-container input {
      height: 38px;
      padding: 0.5rem 0.75rem;
      border: 1px solid #e2e8f0;
      border-radius: 0.25rem;
      width: 100%;
      font-size: 0.875rem;
      line-height: 1.5;
      box-sizing: border-box;
      outline: none;
      background-color: #fff;
    }
    
    /* Preset button styling */
    .preset-btn {
      font-size: 0.875rem;
      padding: 0.375rem 0.75rem;
      border-radius: 0.25rem;
      background-color: #f3f4f6;
      transition: all 0.2s;
    }
    
    .preset-btn:hover {
      background-color: #e5e7eb;
    }
    
    .preset-btn.active {
      background-color: #e2e8f0;
      font-weight: 500;
    }
  `;
  
  // Determine which preset is active
  const getPresetActive = () => {
    if (!filters.startDate || !filters.endDate) return null;
    
    const today = new Date('2025-05-31'); // Using the provided current date
    today.setHours(0, 0, 0, 0); // Normalize to start of day
    
    const startDate = new Date(filters.startDate);
    startDate.setHours(0, 0, 0, 0);
    
    const endDate = new Date(filters.endDate);
    endDate.setHours(0, 0, 0, 0);
    
    // Check if today
    if (startDate.getTime() === today.getTime() && endDate.getTime() === today.getTime()) {
      return "today";
    }
    
    // Check if yesterday
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    if (startDate.getTime() === yesterday.getTime() && endDate.getTime() === yesterday.getTime()) {
      return "yesterday";
    }
    
    // Check if last 5 days
    const last5days = new Date(today);
    last5days.setDate(last5days.getDate() - 4);
    if (startDate.getTime() === last5days.getTime() && endDate.getTime() === today.getTime()) {
      return "last5days";
    }
    
    return null;
  };
  
  const activePreset = getPresetActive();

  return (
    <div className="mb-6">
      {/* Add custom CSS for consistent styling */}
      <style>{customStyles}</style>
      
      {/* Date preset buttons */}
      <div className="flex gap-3 mb-4">
        <div className="text-sm text-gray-600 flex items-center">
          Quick filters:
        </div>
        {DATE_PRESETS.map((preset) => (
          <button
            key={preset.key}
            type="button"
            onClick={() => handleDatePreset(preset.key)}
            className={`preset-btn ${activePreset === preset.key ? 'active bg-gray-200 font-medium' : ''}`}
          >
            {preset.label}
          </button>
        ))}
      </div>
      
      {/* Main filter container - using grid for perfect alignment */}
      <div className="grid grid-cols-12 gap-4 items-center">
        {/* Date pickers - span 4 columns */}
        <div className="col-span-12 md:col-span-4 flex gap-4">
          <DateRangePicker
            startDate={filters.startDate}
            endDate={filters.endDate}
            onStartDateChange={handleStartDateChange}
            onEndDateChange={handleEndDateChange}
            className="w-full flex gap-4"
          />
        </div>
        
        {/* Branch dropdown - span 3 columns */}
        <div className="col-span-6 md:col-span-3">
          <select
            value={filters.branchId}
            onChange={handleBranchChange}
            className="w-full h-[38px] border border-gray-200 rounded px-3 text-sm"
          >
            <option value="">All Branches</option>
            {branchOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        
        {/* Status dropdown - span 3 columns */}
        <div className="col-span-6 md:col-span-3">
          <select
            value={filters.status || ""}
            onChange={handleStatusChange}
            className="w-full h-[38px] border border-gray-200 rounded px-3 text-sm"
          >
            {STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        
        {/* Buttons - span 2 columns */}
        <div className="col-span-12 md:col-span-2 flex items-center gap-4 justify-end">
          <button
            type="button"
            onClick={handleApplyFilters}
            className="bg-orange-500 text-white h-[38px] px-6 rounded hover:bg-orange-600"
          >
            Apply
          </button>
          <button
            type="button"
            onClick={handleResetFilters}
            className="text-gray-700 h-[38px] hover:underline flex items-center"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;