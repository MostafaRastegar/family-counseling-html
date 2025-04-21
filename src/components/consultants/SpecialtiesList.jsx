import React, { useState } from 'react';

const SpecialtiesList = ({ onSpecialtiesChange, initialSpecialties = [] }) => {
  const [selectedSpecialties, setSelectedSpecialties] =
    useState(initialSpecialties);

  // Predefined list of available specialties
  const availableSpecialties = [
    'Cardiology',
    'Neurology',
    'Pediatrics',
    'Oncology',
    'Dermatology',
    'Orthopedics',
    'Psychiatry',
    'Gynecology',
    'Endocrinology',
    'Radiology',
  ];

  const handleSpecialtiesChange = (newSpecialties) => {
    setSelectedSpecialties(newSpecialties);
    // Optional: Call parent component's callback if provided
    if (onSpecialtiesChange) {
      onSpecialtiesChange(newSpecialties);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        Select Specialties
      </label>
      <TagSelector
        availableTags={availableSpecialties}
        selectedTags={selectedSpecialties}
        onChange={handleSpecialtiesChange}
        placeholder="Choose specialties"
        maxTags={5}
      />
      <p className="mt-1 text-xs text-gray-500">Select up to 5 specialties</p>
    </div>
  );
};

export default SpecialtiesList;
