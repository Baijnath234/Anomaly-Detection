import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { verifyOtp } from '../services/auth';
import { Container, CssBaseline, Avatar, Typography, Button, TextField } from '@mui/material';
import { makeStyles } from 'tss-react/mui';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { pink } from '@mui/material/colors';


const useStyles = makeStyles()((theme) => ({
  paper: {
    marginTop: theme.spacing(12), // Adds top margin to center vertically
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: pink[400],
  },
  form: {
    width: '100%', // Fixes width of the form
    marginTop: theme.spacing(1),
  },
}));

const OtpVerificationPage: React.FC = () => {
  const { classes } = useStyles();
  const navigate = useNavigate();
  const location = useLocation();
  const { email } = location.state || {};
  const [otp, setOtp] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await verifyOtp(email, otp);
      navigate('/reset-password', { state: { email } });
    } catch (error) {
      console.error("OTP verification failed:", error);
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
        <form className={classes.form} onSubmit={handleSubmit}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <Button type="submit" fullWidth variant="contained" color="primary" disabled={!otp}>
            Verify OTP
          </Button>
        </form>
      </div>
    </Container>
  );
};

export default OtpVerificationPage;

