export const validators = {
  required: (value) => (value ? null : 'This field is required'),
  
  email: (value) => {
    if (!value) return null;
    const regex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return regex.test(value) ? null : 'Invalid email address';
  },
  
  minLength: (length) => (value) => {
    if (!value) return null;
    return value.length >= length ? null : `Must be at least ${length} characters`;
  },
  
  maxLength: (length) => (value) => {
    if (!value) return null;
    return value.length <= length ? null : `Must be at most ${length} characters`;
  }
};