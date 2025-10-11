import { useState, useCallback } from 'react';

/**
 * Custom hook for managing filter state
 */
export function useFilters(initialFilters = {}) {
  const [filters, setFilters] = useState(initialFilters);
  const [errors, setErrors] = useState({});

  const updateFilter = useCallback((name, value) => {
    setFilters(prev => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear error for this field when user updates it
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  }, [errors]);

  const setAllFilters = useCallback((newFilters) => {
    setFilters(newFilters);
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(initialFilters);
    setErrors({});
  }, [initialFilters]);

  const validateFilters = useCallback((requiredFields = []) => {
    const newErrors = {};
    
    requiredFields.forEach(field => {
      const value = filters[field];
      if (value === '' || value === null || value === undefined) {
        newErrors[field] = 'This field is required';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [filters]);

  const hasFilters = useCallback(() => {
    return Object.values(filters).some(value => 
      value !== '' && value !== null && value !== undefined
    );
  }, [filters]);

  return {
    filters,
    errors,
    updateFilter,
    setAllFilters,
    resetFilters,
    validateFilters,
    hasFilters,
  };
}

export default useFilters;
