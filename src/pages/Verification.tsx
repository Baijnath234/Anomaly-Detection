import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { verifyOtp } from '../services/auth';
import { Container, CssBaseline, Avatar, Typography, Button, TextField, Alert, CircularProgress } from '@mui/material';
import { makeStyles } from 'tss-react/mui';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { pink } from '@mui/material/colors';

const useStyles = makeStyles()((theme) => ({
  paper: {
    marginTop: theme.spacing(12),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: pink[400],
  },
  form: {
    width: '100%',
    marginTop: theme.spacing(1),
  },
}));

const OtpVerificationPage: React.FC = () => {
  const { classes } = useStyles();
  const navigate = useNavigate();
  const location = useLocation();
  const { email, otp: initialOtp } = location.state || {};
  const [otp, setOtp] = useState(initialOtp || '');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await verifyOtp(email, otp);
      navigate('/reset-password', { state: { email, otp } });
    } catch (err: any) {
      console.error("OTP verification failed:", err);
      const msg = err.response?.data?.message || "OTP verification failed. Please check your OTP and try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          OTP Verification
        </Typography>
        {email && (
          <Typography variant="body2" color="textSecondary" style={{ marginTop: 8 }}>
            Enter the OTP sent to <strong>{email}</strong>
          </Typography>
        )}
        {error && <Alert severity="error" style={{ width: '100%', marginTop: 12 }}>{error}</Alert>}
        <form className={classes.form} onSubmit={handleSubmit}>
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
          <Button type="submit" fullWidth variant="contained" color="primary" disabled={!otp || loading} style={{ marginTop: 16 }}>
            {loading ? <CircularProgress size={24} /> : 'Verify OTP'}
          </Button>
        </form>
      </div>
    </Container>
  );
};

export default OtpVerificationPage;
