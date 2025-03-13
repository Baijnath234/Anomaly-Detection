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
  const [emailError, setEmailError] = useState(''); // New state for email error

  const validateEmail = (email: string) => {
    // Regex for basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Check for email validity
    if (!validateEmail(contactInfo)) {
      setEmailError('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    setEmailError('');

    try {
      await forgotPassword(contactInfo);
      setSuccess('OTP sent successfully! Please check your email.');
      navigate('/otp-verification', { state: { email: contactInfo } });
    } catch (error) {
      setError("Failed to send OTP. Please try again.");
      console.error("Error sending OTP:", error);
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
        {error && <Alert severity="error">{error}</Alert>}
        {success && <Alert severity="success">{success}</Alert>}
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
