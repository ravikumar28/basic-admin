import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const DateRangePicker = ({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  showLabels = false,
  startDateLabel = 'Start Date',
  endDateLabel = 'End Date',
  className = '',
}) => {
  return (
    <div className={`flex flex-col sm:flex-row gap-4 ${className}`}>
      <div className="form-group w-full sm:w-1/2">
        {showLabels && <label className="form-label">{startDateLabel}</label>}
        <DatePicker
          selected={startDate}
          onChange={onStartDateChange}
          selectsStart
          startDate={startDate}
          endDate={endDate}
          className="input w-full"
          dateFormat="yyyy-MM-dd"
          placeholderText="Select start date"
        />
      </div>
      <div className="form-group w-full sm:w-1/2">
        {showLabels && <label className="form-label">{endDateLabel}</label>}
        <DatePicker
          selected={endDate}
          onChange={onEndDateChange}
          selectsEnd
          startDate={startDate}
          endDate={endDate}
          minDate={startDate}
          className="input w-full"
          dateFormat="yyyy-MM-dd"
          placeholderText="Select end date"
        />
      </div>
    </div>
  );
};

export default DateRangePicker;