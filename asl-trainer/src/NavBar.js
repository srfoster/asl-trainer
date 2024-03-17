import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import {Link} from "react-router-dom"

export default function NavBar() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed" color="secondary" sx={{ top: 'auto', bottom: 0 }}>
        <Toolbar>
            <MenuButton to="Feed" />
            <MenuButton to="Profile" />
        </Toolbar>
      </AppBar>
    </Box>
  );
}

function MenuButton(props) {
  return <Button variant="contained" sx={{ ml: 1, color: "white", backgroundColor: "white" }}>
        <Link style={{color: "black"}} to={"/"+props.to}>{props.to}</Link>
    </Button>
}