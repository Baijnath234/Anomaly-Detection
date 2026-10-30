import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { resetPassword } from '../services/auth';
import {
  Container,
  CssBaseline,
  Typography,
  Button,
  TextField,
  Avatar,
  Alert,
  CircularProgress,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { pink } from '@mui/material/colors';

const ResetPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { email, otp: stateOtp } = location.state || {};
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otp, setOtp] = useState(stateOtp || '');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const passwordIsValid = (password: string) => {
    return (
      password.length >= 8 &&
      /[A-Z]/.test(password) &&
      /[a-z]/.test(password) &&
      /\d/.test(password) &&
      /[!@#$%^&*(),.?":{}|<>]/.test(password)
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!email) {
      setError('Email is missing. Please restart the forgot password process.');
      return;
    }

    if (!otp) {
      setError('OTP is required.');
      return;
    }

    if (!passwordIsValid(newPassword)) {
      setError(
        'Password must be at least 8 characters, include uppercase, lowercase, a number, and a special character.'
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      await resetPassword(email, otp, newPassword);
      setSuccess('Password has been successfully reset! Redirecting to sign in...');
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Password reset failed. Please try again.';
      setError(msg);
      console.error('Password reset failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div
        style={{
          marginTop: '64px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar style={{ margin: '8px', backgroundColor: pink[400] }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Reset Password
        </Typography>
        {email && (
          <Typography variant="body2" color="textSecondary" style={{ marginTop: 8 }}>
            Resetting password for <strong>{email}</strong>
          </Typography>
        )}
        {error && <Alert severity="error" style={{ width: '100%', marginTop: 8 }}>{error}</Alert>}
        {success && <Alert severity="success" style={{ width: '100%', marginTop: 8 }}>{success}</Alert>}
        <form onSubmit={handleSubmit} style={{ width: '100%', marginTop: '8px' }}>
          {!stateOtp && (
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              label="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              disabled={loading}
            />
          )}
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="New Password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            disabled={loading}
            helperText="Must be at least 8 characters, with uppercase, lowercase, number, and special character."
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={loading}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            disabled={!otp || !newPassword || !confirmPassword || loading}
            style={{ marginTop: 16 }}
          >
            {loading ? <CircularProgress size={24} /> : 'Reset Password'}
          </Button>
        </form>
      </div>
    </Container>
  );
};

export default ResetPasswordPage;
