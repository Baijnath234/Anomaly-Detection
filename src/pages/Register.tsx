import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  CssBaseline,
  Avatar,
  Typography,
  Button,
  TextField,
  Link,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { makeStyles } from 'tss-react/mui';
import { pink } from '@mui/material/colors';
import axios from 'axios';

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

const RegisterPage: React.FC = () => {
  const { classes } = useStyles();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [errors, setErrors] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  // Validation functions
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    const passwordRegex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  const validateUsernameLength = (username: string) => username.length >= 4;

  const handleRegister = async () => {
    try {
      const response = await axios.post('http://localhost:3000/users/register', {
        username,
        email,
        password,
      });
      console.log('User registered successfully:', response.data);
      navigate('/'); // Redirect to Sign-In page or another page after successful registration
    } catch (error: any) {
      console.error('Registration error:', error.response?.data || error.message);
      alert('Registration failed. Please try again.');
    }
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all fields
    let validationErrors = { username: '', email: '', password: '', confirmPassword: '' };
    if (!username || !validateUsernameLength(username)) {
      validationErrors.username = 'Username must be at least 4 characters.';
    }
    if (!email || !validateEmail(email)) {
      validationErrors.email = 'Enter a valid email address.';
    }
    if (!password || !validatePassword(password)) {
      validationErrors.password =
        'Password must be at least 8 characters, include a number, and a special character.';
    }
    if (password !== confirmPassword) {
      validationErrors.confirmPassword = "Passwords don't match.";
    }
    setErrors(validationErrors);

    // Proceed only if there are no errors
    if (Object.values(validationErrors).every((error) => error === '')) {
      handleRegister();
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
          Register
        </Typography>
        <form className={classes.form} onSubmit={onSubmit}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoComplete="username"
            autoFocus
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            error={!!errors.username}
            helperText={errors.username}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={!!errors.email}
            helperText={errors.email}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={!!errors.password}
            helperText={errors.password}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="confirmPassword"
            label="Confirm Password"
            type="password"
            id="confirmPassword"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            disabled={
              !username || !email || !password || !confirmPassword
            }
          >
            Register
          </Button>
          <Link href="/singup" variant="body2" style={{ marginTop: '1rem' }}>
            Already have an account? Login
          </Link>
        </form>
      </div>
    </Container>
  );
};

export default RegisterPage;
