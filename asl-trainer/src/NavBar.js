import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import { Link } from "react-router-dom"
import LearnIcon from '@mui/icons-material/AutoStories';
import TimedIcon from '@mui/icons-material/ToggleOff';
import SettingsIcon from '@mui/icons-material/Settings';
import ProfileIcon from '@mui/icons-material/AccountCircle';
import { Typography } from '@mui/material';
import {LastActionContext} from "./Contexts"

export default function NavBar() {
  return (
    <AppBar position="fixed" color="secondary" sx={{ top: 'auto', bottom: 0, height: "9.5vh" }}>
      <LastActionContext.Consumer>
        {({action,setAction}) => (
          <Stack direction="row" alignItems={"center"} justifyContent="center" spacing={2} >
            <IconButton onClick={()=>setAction({action: "nav", arguments: "feed"})}>
              <Stack alignItems={"center"}>
                <Stack alignItems={"center"} justifyContent="center"  style={{ width: 50, height: 50 }}>
                  <LearnIcon style={{ width: '30px', height: '30px' }} />
                </Stack>
                <Typography>
                  learn
                </Typography>
              </Stack>
            </IconButton>
            <IconButton onClick={()=>setAction({action: "nav", arguments: "timedpractice"})}>
              <Stack alignItems={"center"}>
                <Stack alignItems={"center"} justifyContent="center"  style={{ width: 50, height: 50 }}>
                  <TimedIcon style={{ width: '50px', height: '50px' }} />
                </Stack>

                <Typography>timed practice</Typography>
              </Stack>
            </IconButton>
            <IconButton onClick={()=>setAction({action: "nav", arguments: "settings"})}>
              <Stack alignItems={"center"}>
                <Stack alignItems={"center"} justifyContent="center"  style={{ width: 50, height: 50 }}>
                  <SettingsIcon style={{ width: '40px', height: '40px' }} />
                </Stack>

                <Typography>settings</Typography>
              </Stack>
            </IconButton>
            <IconButton onClick={()=>setAction({action: "nav", arguments: "profile"})}>

              <Stack alignItems={"center"}>
                <Stack alignItems={"center"} justifyContent="center"  style={{ width: 50, height: 50 }}>
                  <Avatar alt="Cindy Baker" src="https://mui.com/static/images/avatar/1.jpg" />
                </Stack>

                <Typography>profile</Typography>
              </Stack>
            </IconButton>
          </Stack>
        )}
      </LastActionContext.Consumer>
    </AppBar>
  );
}

// variant="p" sx={{p: 0}}