

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import logo from '../assets/logo.png'
const Navbar = ({ loggedIn, setLoggedIn }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const isMenuOpen = Boolean(anchorEl);

  // Retrieve user profile from localStorage
  const userProfile = JSON.parse(localStorage.getItem('user'));
  const isAdmin = userProfile?.userType === 'admin';
  const isReceptionist=userProfile?.userType === 'receptionist';
  const isPatient=userProfile?.userType === 'patient'

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const menuItems = ['Home', 'About Us'];

  if (loggedIn) {
    menuItems.push('Doctors', 'Appointments', 'Profile','Dashboard');
    if (isAdmin) {
      menuItems.push('Approvals');
    }
    if(isReceptionist){
      menuItems.push('Bills');
    }
  }

  return (
    <AppBar
      position="fixed"
      sx={{
        backgroundColor: '#004080',
        top: 0,
        left: 0,
        right: 0,
        boxShadow: 'none',
        overflow: 'hidden',
        margin: 0,
        padding: 0,
      }}
    >
      <Toolbar sx={{ padding: '0 16px' }}>
           {/* Logo */}
    <img
      src={logo}
      alt="Logo"
      style={{
        height: '45px', // Adjust the height as needed
        marginRight: '16px', // Add some spacing between the logo and text
      }}
    />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Pushpa Hospital
        </Typography>

        <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
          {/* Main navigation links */}
          <Button key="Home" color="inherit" component={Link} to="/">
            Home
          </Button>
          {isAdmin? <Button key="Doctors" color="inherit" component={Link} to="/doctors">
            Staff Management
          </Button>: <Button key="Doctors" color="inherit" component={Link} to="/doctors">
            Doctors
          </Button>}
         
          <Button key="About Us" color="inherit" component={Link} to="/about">
            About Us
          </Button>
         
          {loggedIn && (
            <>
              <Button key="Appointments" color="inherit" component={Link} to="/appointments">
                Appointments
              </Button>
              {isReceptionist && (
                <Button key="Bills" color="inherit" component={Link} to="/bills">
                  Bills
                </Button>
              )}
                 {isPatient && (
                <Button key="Bills" color="inherit" component={Link} to="/billsPatient">
                  Bills
                </Button>
              )}

              {isAdmin && (
                <Button key="Approvals" color="inherit" component={Link} to="/approvals">
                  Approvals
                </Button>
              )}
               <Button key="Reviews" color="inherit" component={Link} to="/reviews">
            Dashboard
          </Button>
              <Button key="Profile" color="inherit" component={Link} to="/profile">
                Profile
              </Button>
              
             
            </>
          )}
          {!loggedIn && (
            <Button color="inherit" component={Link} to="/login">
              Login
            </Button>
          )}
        </Box>

        {/* Mobile menu button */}
        <IconButton
          edge="end"
          color="inherit"
          aria-label="menu"
          onClick={handleMenuOpen}
          sx={{ display: { xs: 'flex', md: 'none' } }}
        >
          <MenuIcon />
        </IconButton>
      </Toolbar>

      {/* Mobile menu */}
      <Menu
        anchorEl={anchorEl}
        open={isMenuOpen}
        onClose={handleMenuClose}
        sx={{ display: { xs: 'block', md: 'none' } }}
      >
        <MenuItem key="Home" onClick={handleMenuClose} component={Link} to="/">
          Home
        </MenuItem>
        {isAdmin? <MenuItem key="Doctors" onClick={handleMenuClose} component={Link} to="/doctors">
          Staff Management
        </MenuItem>: <MenuItem key="Doctors" onClick={handleMenuClose} component={Link} to="/doctors">
          Doctors
        </MenuItem>}
       
        <MenuItem key="About Us" onClick={handleMenuClose} component={Link} to="/about">
          About Us
        </MenuItem>
        {loggedIn && (
          <>
            <MenuItem key="Appointments" onClick={handleMenuClose} component={Link} to="/appointments">
              Appointments
            </MenuItem>
            <Button key="Reviews" color="inherit" component={Link} to="/reviews">
            Dashboard
          </Button>
            <MenuItem key="Profile" onClick={handleMenuClose} component={Link} to="/profile">
              Profile
            </MenuItem>

            {isAdmin && (
              <MenuItem key="Approvals" onClick={handleMenuClose} component={Link} to="/approvals">
                Approvals
              </MenuItem>
            )}
             {isReceptionist && (
              <MenuItem key="Bills" onClick={handleMenuClose} component={Link} to="/approvals">
                Bills
              </MenuItem>
            )}
              {isPatient && (
                <Button key="Bills" color="inherit" component={Link} to="/billsPatient">
                  Bills
                </Button>
              )}
          </>
        )}
        {!loggedIn && (
          <MenuItem key="Login" onClick={handleMenuClose} component={Link} to="/login">
            Login
          </MenuItem>
        )}
      </Menu>
    </AppBar>
  );
};

export default Navbar;
