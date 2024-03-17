import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import {Link} from "react-router-dom"
import LearnIcon from '@mui/icons-material/AutoStories';
import TimedIcon from '@mui/icons-material/ToggleOff';
import SettingsIcon from '@mui/icons-material/Settings';
import ProfileIcon from '@mui/icons-material/AccountCircle';

export default function NavBar() {
  return (
      <AppBar position="fixed" color="secondary" sx={{ top: 'auto', bottom: 0 }}>
          <Stack direction="row" alignItems={"center"} justifyContent="center" spacing={2} >
            <IconButton>
              {/* <Link style={{color: "black"}} to={"/"+props.to}>{props.to}</Link> */}
              <LearnIcon />
            </IconButton>
            <IconButton>
              <TimedIcon />
            </IconButton>
            <IconButton>
              <SettingsIcon />
            </IconButton>
            <IconButton>
              <Avatar alt="Cindy Baker" src="https://mui.com/static/images/avatar/1.jpg" />
            </IconButton>
          </Stack>
      </AppBar>
  );
}
