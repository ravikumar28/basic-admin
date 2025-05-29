import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Input from '../common/Input';
import Button from '../common/Button';
import Card from '../common/Card';
import { useAuth } from '../../hooks/useAuth';
import { useForm } from '../../hooks/useForm';

const LoginForm = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  
  const { values, handleChange, errors, setErrors } = useForm({
    username: '',
    password: '',
  });

  const validateForm = () => {
    const newErrors = {};
    
    if (!values.username) {
      newErrors.username = 'Username is required';
    }
    
    if (!values.password) {
      newErrors.password = 'Password is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      await login(values);
      navigate('/');
    } catch (error) {
      let errorMessage = 'Failed to login. Please try again.';
      
      if (error.response && error.response.data && error.response.data.message) {
        errorMessage = error.response.data.message;
      }
      
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
      <form onSubmit={handleSubmit}>
        <Input
          label="Username"
          id="username"
          name="username"
          value={values.username}
          onChange={handleChange}
          error={errors.username}
          required
        />
        
        <Input
          label="Password"
          id="password"
          name="password"
          type="password"
          value={values.password}
          onChange={handleChange}
          error={errors.password}
          required
        />
        
        <Button 
          type="submit" 
          className="w-full mt-6" 
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </Button>
      </form>
    </Card>
  );
};

export default LoginForm;