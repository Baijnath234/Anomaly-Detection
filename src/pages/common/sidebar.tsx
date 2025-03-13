import React from 'react';
import { Drawer, Toolbar, IconButton, Typography, List, ListItemButton, ListItemIcon, ListItemText, Divider, Box, Collapse } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DesktopWindowsIcon from '@mui/icons-material/DesktopWindows';
import MonitorIcon from '@mui/icons-material/Monitor';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useAppDispatch } from '../../features/common/hooks';
import { logout } from '../../features/common/authSlice';
import { useNavigate } from 'react-router-dom';

const drawerWidth = 280;
const collapsedWidth = 60;

type DropdownNames = 'anomalies' | 'modelling' | 'usersRoles';

interface SidebarProps {
  open: boolean;
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setActivePage: React.Dispatch<React.SetStateAction<string>>;
  activePage: string;
}

const Sidebar: React.FC<SidebarProps> = ({ setSidebarOpen, setActivePage, activePage }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(true);
  const [dropdowns, setDropdowns] = React.useState({
    anomalies: false,
    modelling: false,
    usersRoles: false,
  });

  const handleDrawerToggle = () => {
    setOpen(!open);
    setSidebarOpen(!open);
  };

  const handleDropdownToggle = (dropdownName: DropdownNames) => {
    setDropdowns((prev) => ({ ...prev, [dropdownName]: !prev[dropdownName] }));
  };

  const handleLogout = async () => {
    await dispatch(logout());
    navigate('/singup');
  };

  const handleMenuItemClick = (page: string) => {
    console.log(page, "page");
    
    setActivePage(page); 
    setSidebarOpen(false); 
    navigate(`/dashboard/${page}`); 
  };

  const getMenuItemStyle = (page: string) => {
    return page === activePage ? { backgroundColor: '#f0f0f0', fontWeight: 'bold' } : {};
  };

  return (
    <Drawer
      sx={{
        width: open ? drawerWidth : collapsedWidth,
        flexShrink: 0,
        position: 'fixed',
        height: '100vh',
        '& .MuiDrawer-paper': {
          width: open ? drawerWidth : collapsedWidth,
          transition: 'width 0.3s ease',
          boxSizing: 'border-box',
          position: 'relative',
        },
      }}
      variant="permanent"
      anchor="left"
      open={open}
    >
      <Toolbar sx={{ display: 'flex', justifyContent: open ? 'flex-start' : 'center', padding: '0 16px', transition: 'all 0.3s ease' }}>
        <IconButton onClick={handleDrawerToggle}>
          <MenuIcon />
        </IconButton>
        {open && (
          <Typography variant="h6" noWrap sx={{ marginLeft: 1 }}>
            VEBUIN
          </Typography>
        )}
      </Toolbar>
      <Divider />

      {/* Main Content Items with Dropdowns */}
      <List>
        {/* Anomalies Dropdown */}
        <ListItemButton
          onClick={() => handleDropdownToggle('anomalies')}
          sx={{ justifyContent: open ? 'initial' : 'center', ...getMenuItemStyle('anomalies'), transition: 'all 0.3s ease' }}
        >
          <ListItemIcon sx={{ minWidth: 0, mr: open ? 3 : 'auto', justifyContent: 'center' }}>
            <MonitorIcon />
          </ListItemIcon>
          {open && <ListItemText primary="Anomalies" />}
          {open && (dropdowns.anomalies ? <ExpandLessIcon /> : <ExpandMoreIcon />)}
        </ListItemButton>
        <Collapse in={dropdowns.anomalies} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItemButton
              sx={{ pl: open ? 4 : 0, justifyContent: open ? 'initial' : 'center', ...getMenuItemStyle('anomaliesNotConfirmed') }}
              onClick={() => handleMenuItemClick('anomaliesNotConfirmed')}
            >
              {open && <ListItemText primary="Not Confirmed" />}
            </ListItemButton>
          </List>
        </Collapse>

        {/* Modelling Dropdown */}
        <ListItemButton
          onClick={() => handleDropdownToggle('modelling')}
          sx={{ justifyContent: open ? 'initial' : 'center', ...getMenuItemStyle('modelling') }}
        >
          <ListItemIcon sx={{ minWidth: 0, mr: open ? 3 : 'auto', justifyContent: 'center' }}>
            <DesktopWindowsIcon />
          </ListItemIcon>
          {open && <ListItemText primary="Modelling" />}
          {open && (dropdowns.modelling ? <ExpandLessIcon /> : <ExpandMoreIcon />)}
        </ListItemButton>
        <Collapse in={dropdowns.modelling} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItemButton
              sx={{ pl: open ? 4 : 0, justifyContent: open ? 'initial' : 'center', ...getMenuItemStyle('modelList') }}
              onClick={() => handleMenuItemClick('modelList')}
            >
              {open && <ListItemText primary="Model List" />}
            </ListItemButton>
            <ListItemButton
              sx={{ pl: open ? 4 : 0, justifyContent: open ? 'initial' : 'center', ...getMenuItemStyle('createModel') }}
              onClick={() => handleMenuItemClick('createModelVersion')}
            >
              {open && <ListItemText primary="Create Model Version" />}
            </ListItemButton>
          </List>
        </Collapse>
      </List>

      <Divider />

      {/* Bottom Menu Items */}
      <Box sx={{ position: 'absolute', bottom: open ? 50 : 80, width: '100%', display: 'flex', justifyContent: open ? 'space-between' : 'center', alignItems: 'center' }}>
        <List>
          <ListItemButton sx={{ justifyContent: open ? 'initial' : 'center' }}>
            <ListItemIcon sx={{ minWidth: 0, mr: open ? 3 : 'auto', justifyContent: 'center' }}>
              <SettingsIcon />
            </ListItemIcon>
            {open && <ListItemText primary="Settings" />}
          </ListItemButton>
        </List>
      </Box>

      {/* Notification and Logout Icons */}
      <Box sx={{ 
        position: 'absolute',
        bottom: 0,
        width: '100%',
        display: 'flex',
        flexDirection: open ? 'row' : 'column',
        justifyContent: open ? 'space-between' : 'center',
        alignItems: 'center',
        padding: open ? '0 16px' : '8px 0',
        transition: 'all 0.3s ease',
        }}
        >
        <IconButton sx={{ margin: open ? '0 120px 0 0' : '0' }}>
          <NotificationsIcon />
        </IconButton>
        <IconButton sx={{ margin: open ? '0 0 0 8px' : '8px 0 0 0' }} onClick={handleLogout}>
          <LogoutIcon />
        </IconButton>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
