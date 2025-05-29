import React, { useEffect } from 'react';
import Card from '../common/Card';
import Select from '../common/Select';
import DateRangePicker from '../common/DateRangePicker';
import Button from '../common/Button';
import { usePatients } from '../../hooks/usePatients';

const FilterPanel = () => {
  const { 
    filters, 
    updateFilters, 
    loadBranches, 
    loadPatients,
    branches 
  } = usePatients();

  useEffect(() => {
    loadBranches();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleStartDateChange = (date) => {
    updateFilters({ startDate: date });
  };

  const handleEndDateChange = (date) => {
    updateFilters({ endDate: date });
  };

  const handleBranchChange = (e) => {
    updateFilters({ branchId: e.target.value });
  };

  const handleApplyFilters = () => {
    loadPatients();
  };

  const handleResetFilters = () => {
    updateFilters({
      startDate: null,
      endDate: null,
      branchId: ''
    });
  };

  const branchOptions = branches.map(branch => ({
    value: branch.id,
    label: branch.name
  }));

  return (
    <Card className="mb-6">
      <h2 className="text-lg font-semibold mb-4">Filter Patients</h2>
      
      <div className="space-y-4">
        <DateRangePicker
          startDate={filters.startDate}
          endDate={filters.endDate}
          onStartDateChange={handleStartDateChange}
          onEndDateChange={handleEndDateChange}
        />
        
        <Select
          label="Branch"
          id="branch"
          name="branch"
          value={filters.branchId}
          onChange={handleBranchChange}
          options={branchOptions}
          placeholder="All branches"
        />
        
        <div className="flex flex-col sm:flex-row gap-2">
          <Button 
            onClick={handleApplyFilters}
            className="sm:flex-1"
          >
            Apply Filters
          </Button>
          
          <Button 
            onClick={handleResetFilters}
            variant="secondary"
            className="sm:flex-1"
          >
            Reset
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default FilterPanel;