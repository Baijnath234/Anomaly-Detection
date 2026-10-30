import axios from 'axios';

const API_URL = 'http://localhost:3000/auth';

// Forgot password request
export const forgotPassword = async (email: string) => {
  return axios.post(`${API_URL}/forgot-password`, { email });
};

// Verify OTP
export const verifyOtp = async (email: string, otp: string) => {
  return axios.post(`${API_URL}/verify-otp`, { email, otp });
};

// Reset password
export const resetPassword = async (email: string, otp: string, newPassword: string) => {
  return axios.post(`${API_URL}/reset-password`, { email, otp, newPassword });
};
