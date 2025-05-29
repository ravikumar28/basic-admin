import { mockAPI } from './api';

// Function to toggle mock API
export const toggleMockAPI = (state = null) => {
  const isMockEnabled = mockAPI.toggleMock(state);
  console.log(`Mock API is now ${isMockEnabled ? 'enabled' : 'disabled'}`);
  return isMockEnabled;
};

// Default to using mock API in development
if (process.env.NODE_ENV === 'development') {
  mockAPI.toggleMock(true);
  console.log('Mock API automatically enabled in development mode');
}