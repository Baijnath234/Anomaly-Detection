import axios from 'axios';

const API_URL = 'http://localhost:3000/user'; // Replace with your backend server URL

// Forgot password request
export const forgotPassword = async (email:any) => {
  return axios.post(`${API_URL}/forgot-password`, { email });
};

// Verify OTP
export const verifyOtp = async (email:any, otp:any) => {
  return axios.post(`${API_URL}/verify-otp`, { email, otp });
};

// Reset password
export const resetPassword = async (email:any, otp:any, newPassword:any) => {
  return axios.post(`${API_URL}/reset-password`, { email, otp, newPassword });
};
