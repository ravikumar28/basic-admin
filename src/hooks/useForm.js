import { useState } from 'react';

export const useForm = (initialValues = {}) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setValues(prevValues => ({
      ...prevValues,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prevErrors => ({
        ...prevErrors,
        [name]: null
      }));
    }
  };

  const validate = (rules) => {
    const newErrors = {};
    let isValid = true;

    Object.keys(rules).forEach(field => {
      const value = values[field];
      const fieldRules = rules[field];

      if (fieldRules.required && !value) {
        newErrors[field] = 'This field is required';
        isValid = false;
      } else if (fieldRules.minLength && value.length < fieldRules.minLength) {
        newErrors[field] = `Must be at least ${fieldRules.minLength} characters`;
        isValid = false;
      } else if (fieldRules.pattern && !fieldRules.pattern.test(value)) {
        newErrors[field] = fieldRules.message || 'Invalid format';
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const reset = () => {
    setValues(initialValues);
    setErrors({});
  };

  return {
    values,
    setValues,
    errors,
    setErrors,
    handleChange,
    validate,
    reset
  };
};