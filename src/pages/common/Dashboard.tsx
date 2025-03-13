import { useEffect, useState } from 'react';
import { Box, CssBaseline, Typography } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import Sidebar from './sidebar';
import CreateModelVersion from '../CraeteModelVersion/CreateModelVersion';
import ModelList from '../ModelList/ModelList';

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activePage, setActivePage] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  const drawerWidth = 280;
  const collapsedWidth = 280;

  useEffect(() => {
    const path = location.pathname.split('/').pop();
    if (path && path !== activePage) {
      setActivePage(path);
    }
  }, [location, activePage]);

  const renderContent = () => {
    switch (activePage) {
      case 'anomaliesNotConfirmed':
        return (
          <Typography variant="h6" sx={{ marginBottom: '16px' }}>
            Anomalies - Not Confirmed
          </Typography>
        );
      case 'anomaliesConfirmed':
        return (
          <Typography variant="h6" sx={{ marginBottom: '16px' }}>
            Anomalies - Confirmed
          </Typography>
        );
      case 'modelList':
        return <ModelList />;
      case 'createModelVersion':
        return <CreateModelVersion />;
      default:
        return (
          <Typography variant="h6">
            Select a page to view content.
          </Typography>
        );
    }
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh', width: '100%' }}>
      <CssBaseline />

      <Sidebar
        setSidebarOpen={setSidebarOpen}
        open={sidebarOpen}
        setActivePage={setActivePage}
        activePage={activePage}
      />

      <Box
        component="main"
        sx={{
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          padding: '16px',
          overflowX: 'auto',
          flexGrow: 1,
          height: '100vh',
          transition: 'margin-left 0.3s ease',
          marginLeft: sidebarOpen ? `${drawerWidth}px` : `${collapsedWidth}px`,
        }}
      >
        <Box sx={{ marginTop: '16px' }}>{renderContent()}</Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
