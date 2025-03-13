import {  useState } from 'react';
import { Box, CssBaseline } from '@mui/material';
import Sidebar from './sidebar';
import Header from './Header';
import UserTable from '../User/UserTable';

const MainLayout = ({setActivePage}:any) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);  // Track sidebar state

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <CssBaseline />

      {/* Sidebar with Dynamic Width */}
      <Sidebar setSidebarOpen={setSidebarOpen} open={false} setActivePage={setActivePage} activePage={''} />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          backgroundColor: '#f4f6f8',
          padding: '16px',
          minHeight: '100vh',
          marginLeft: sidebarOpen ? '280px' : '60px',  // Adjust based on whether sidebar is open
          transition: 'margin-left 0.3s ease',
        }}
      >
        {/* Header */}
        <Header />

        {/* Main Content */}
        <Box sx={{ marginTop: '16px' }}>
          <UserTable />
        </Box>
      </Box>
    </Box>
  );
};

export default MainLayout;
