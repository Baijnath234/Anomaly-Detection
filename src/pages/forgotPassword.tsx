import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { forgotPassword } from '../services/auth';
import {
  Container,
  CssBaseline,
  Avatar,
  Typography,
  Button,
  TextField,
  CircularProgress,
  Alert,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { makeStyles } from 'tss-react/mui';
import { pink } from '@mui/material/colors';

const useStyles = makeStyles()((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
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
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const ForgetPasswordPage: React.FC = () => {
  const { classes } = useStyles();
  const navigate = useNavigate();
  const [contactInfo, setContactInfo] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [emailError, setEmailError] = useState('');

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateEmail(contactInfo)) {
      setEmailError('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    setEmailError('');

    try {
      const res: any = await forgotPassword(contactInfo);
      const devOtp = res?.data?.otp;
      setSuccess(res?.data?.message || 'OTP sent successfully! Please check your email.');
      navigate('/otp-verification', { state: { email: contactInfo, otp: devOtp } });
    } catch (err: any) {
      const rawMsg = err?.response?.data?.message || err?.message || 'Failed to send OTP. Please try again.';
      const msg = Array.isArray(rawMsg) ? rawMsg.join(', ') : rawMsg;
      setError(msg);
      console.error('Error sending OTP:', err);
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
          Forgot Password
        </Typography>
        {error && <Alert severity="error" style={{ width: '100%', marginTop: 8 }}>{error}</Alert>}
        {success && <Alert severity="success" style={{ width: '100%', marginTop: 8 }}>{success}</Alert>}
        <form className={classes.form} onSubmit={handleSubmit}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="contactInfo"
            label="Email Address"
            name="contactInfo"
            autoComplete="email"
            autoFocus
            value={contactInfo}
            onChange={(e) => setContactInfo(e.target.value)}
            onBlur={() => {
              if (contactInfo && !validateEmail(contactInfo)) {
                setEmailError('Please enter a valid email address.');
              } else {
                setEmailError('');
              }
            }}
            error={!!emailError}
            helperText={emailError}
            aria-label="Enter your email address"
            disabled={loading}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            disabled={!contactInfo || loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Submit'}
          </Button>
        </form>
      </div>
    </Container>
  );
};

export default ForgetPasswordPage;
