import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  CssBaseline,
  Avatar,
  Typography,
  Button,
} from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
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
  button: {
    margin: theme.spacing(2, 0),
    width: '80%',
  },
}));

const UserSelectionPage: React.FC = () => {
  const { classes } = useStyles();
  const navigate = useNavigate();

  const handleNewUser = () => {
    navigate('/register');
  };

  const handleExistingUser = () => {
    navigate('/singup');
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <PersonAddIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Select User Type
        </Typography>
        <Button
          variant="contained"
          color="primary"
          className={classes.button}
          onClick={handleNewUser}
        >
          New User Add
        </Button>
        <Button
          variant="outlined"
          color="primary"
          className={classes.button}
          onClick={handleExistingUser}
        >
          Existing User
        </Button>
      </div>
    </Container>
  );
};

export default UserSelectionPage;
