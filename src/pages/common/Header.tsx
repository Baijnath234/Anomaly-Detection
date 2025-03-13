import { Box, Button, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

const Header = () => (
  <Box
    sx={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '16px',
      backgroundColor: '#1565c0',
      color: 'white',
    }}
  >
    <Typography variant="h5">Users</Typography>
    <Button variant="contained" startIcon={<AddIcon />} sx={{ backgroundColor: '#4caf50' }}>
      Add User
    </Button>
  </Box>
);

export default Header;
