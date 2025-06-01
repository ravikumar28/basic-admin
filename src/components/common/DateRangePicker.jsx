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
      <style>
        {`
          .react-datepicker__day--selected,
          .react-datepicker__day--in-selecting-range,
          .react-datepicker__day--in-range {
            background-color: #fb923c !important; /* orange-400 */
            color: white !important;
          }
          .react-datepicker__day--keyboard-selected {
            background-color: #fdba74 !important; /* orange-300 */
            color: white !important;
          }
          .react-datepicker__day--in-selecting-range:not(.react-datepicker__day--in-range) {
            background-color: #fed7aa !important; /* orange-200 */
          }
          .react-datepicker__day:hover {
            background-color: #ffedd5 !important; /* orange-100 */
          }
          .react-datepicker__day--today {
            font-weight: bold;
            color: #ea580c !important; /* orange-600 */
          }
        `}
      </style>
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