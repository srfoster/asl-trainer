import './App.css';
import ReactPlayer from 'react-player'
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';

import React, { useEffect } from "react"
import { HashRouter as Router, Routes, Route, Link } from "react-router-dom"
import useWindowSize from 'react-use/lib/useWindowSize'
import Confetti from 'react-confetti'
import { Stack, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import NavBar from "./NavBar"
import { ThemeProvider, createTheme } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import HeartIcon from '@mui/icons-material/FavoriteBorder';
import CommentIcon from '@mui/icons-material/Comment';
import SpeedIcon from '@mui/icons-material/Speed';
import SchoolIcon from '@mui/icons-material/School';
import InfoIcon from '@mui/icons-material/Info';
import SettingsIcon from '@mui/icons-material/Settings';
import { PieChart } from '@mui/x-charts/PieChart';
import { Box } from '@mui/system';
import Checkbox from '@mui/material/Checkbox';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import { Radio } from '@mui/material';
import RadioGroup from '@mui/material/RadioGroup';
import FormLabel from '@mui/material/FormLabel';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import WavingHandIcon from '@mui/icons-material/WavingHand';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import Alert from '@mui/material/Alert';
import { aslItems } from "./feedItems"
import { LastActionContext } from "./Contexts"

import { shuffle } from './utils';
import { heights } from "./config"
import useCurrentColorScheme from '@mui/system/cssVars/useCurrentColorScheme';

const BACKEND_URL = "http://54.156.128.216:8080"

const darkTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#F5F1ED'
    },
    success: {
      main: '#9FE89E'
    },
    error: {
      main: '#FF967C'
    }
  },
});



let stats = (data) => {
  return {
    data: data,
    type: "StatsFeedItem"
  }
}

function StatsFeedItem(props) {
  return <FeedCard {...props}>
    <CardHeader title="You're doing great!">
    </CardHeader>
    <CardContent>
      <PieChart
        colors={["lime", "cyan", "red"]}
        series={[
          {
            data: [
              { id: 0, value: 10, label: 'Right' },
              { id: 1, value: 15, label: 'Repeat' },
              { id: 2, value: 20, label: 'Wrong' },
            ],
          },
        ]}
        width={350}
        height={200}
      />
    </CardContent>
  </FeedCard>
}

function PlainTextFeedItem(props) {
  let stringToIcon = (s) => {
    let mappings = { info: InfoIcon, heart: HeartIcon }
    let Mapping = mappings[s]

    if (Mapping)
      return <Mapping fontSize={"large"} />

    return s
  }

  let icon = stringToIcon(props.card.params.icon)
  return <FeedCard {...props} gotItRight={undefined} >
    <div style={{ fontSize: 32, padding: 5 }}>
      <Stack
        direction="row"
        divider={<Divider orientation="vertical" flexItem />}

        spacing={1}
        alignItems={"center"}>
        {icon}<span>{props.card.title}</span>
      </Stack>
    </div>
    <CardContent >
      <div style={{ fontSize: 36, fontWeight: "normal", textAlign: 'center' }}
        dangerouslySetInnerHTML={{ __html: props.card.text }}>
      </div>
    </CardContent>
  </FeedCard>
}

function SettingsFeedItem(props) {
  let [selectedSettings, setSelectedSettings] = React.useState([])

  return <FeedCard {...props}>
    <CardContent>
      <Typography
        variant="h6"
        sx={{ p: 1 }}
        dangerouslySetInnerHTML={{ __html: props.card.text }}>
      </Typography>
      <Stack direction="row" spacing={2} justifyContent="center">
        {props.card.options.map((x, i) => {
          return <Button variant={selectedSettings.includes(x) ? "outlined" : "contained"} key={i} onClick={() => { setSelectedSettings(selectedSettings.concat(x)) }}>{x}</Button>
        })}
      </Stack>
    </CardContent>
  </FeedCard>
}



function MultipleChoiceFeedItem(props) {
  let [wordSelection, setWordSelection] = React.useState(null)
  let [progress, setProgress] = React.useState(0)

  let gotItRight = undefined;
  if (wordSelection !== null) gotItRight = (wordSelection === props.card.correct_answer)

  if (gotItRight) console.log("got it right")

  React.useEffect(() => {
    if (gotItRight) props.setGotItRight(true)
  }, [gotItRight])



  return (
    <FeedCard {...props} gotItRight={gotItRight} >

      <div
        style={{ position: "relative", height: "100%" }}
      >
        {Math.abs(props.myIndex - props.currentIndex) < 2 &&
          <Video startPlaying={props.iAmCurrent} url={props.card.clip} producer={props.card.producer} setProgress={setProgress} />}
      </div>

      {/* <FloatingVideoIcons style={{position: "absolute", bottom: "25vh", right: 0}} /> */}
      <div style={{ position: "absolute", width: "100%", bottom: "20vh", left: 0 }}>
        <div style={{ padding: 10 }}>
          <VideoAvatar producer={props.card.producer} />
        </div>
        <div style={{}}>
          <VideoProgress progress={progress} />
        </div>
      </div>
      <div style={{
        position: "absolute",
        backgroundColor: "rgba(0,0,0,0.75)",
        width: "101%", bottom: 0, left: 0, height: "20vh", display: "flex"
      }}>
        <Stack justifyContent={"center"} alignItems={"center"} style={{ margin: 20, flexGrow: 1 }}>
          <Typography sx={{ color: "white" }}>{props.card.prompt}</Typography>
          <ClickableGloss
            id={props.card.id}
            arrangement={props.card.arrangement}
            correctAnswer={props.card.correct_answer}
            onClick={setWordSelection} gloss={props.card.randomize_options ? shuffle(props.card.answer_options) : props.card.answer_options} />
        </Stack>
      </div>
    </FeedCard>
  );
}

let FloatingVideoIcons = (props) => {
  return <LastActionContext.Consumer>
    {({ action, setAction }) => (
      <Stack style={{ ...props.style }}>
        <IconButton aria-label="delete" onClick={(e) => { console.log("hello"); setAction({ action: "heart", arguments: props.card }) }}>
          <HeartIcon style={{ width: '50px', height: '50px' }} />
        </IconButton>
        <IconButton aria-label="comment" onClick={(e) => { setAction({ action: "comment", arguments: props.card }) }}>
          <CommentIcon style={{ width: '50px', height: '50px' }} />
        </IconButton>
        <IconButton aria-label="comment" onClick={(e) => { setAction({ action: "setSpeed", arguments: props.card }) }}>
          <SpeedIcon style={{ width: '50px', height: '50px' }} />
        </IconButton>
        <IconButton aria-label="comment" onClick={(e) => { setAction({ action: "learnMore", arguments: props.card }) }}>
          <SchoolIcon style={{ width: '50px', height: '50px' }} />
        </IconButton>
      </Stack>
    )}
  </LastActionContext.Consumer>
}


function Video({ startPlaying, url, setProgress }) {
  let [playing, setPlaying] = React.useState(false)

  useEffect(() => {
    setPlaying(startPlaying)
  }, [startPlaying])

  return <>
    <div className="react-player-container" style={{ height: "100%" }}
      onClick={() => { setPlaying(!playing) }}
    >
      {<ReactPlayer
        id={url}
        playing={playing}
        muted={true}
        loop={true}
        url={url}
        controls={false}
        height="100%"
        width="100%"
        onProgress={(p) => { setProgress(p.played) }}
      />}
    </div>
  </>
}

let VideoProgress = ({ progress }) => {
  return <div style={{ width: "100%", backgroundColor: "black", height: 4 }}>
    <div style={{ width: (progress * 100) + "%", height: 4, backgroundColor: "white", borderRadius: 10 }}></div>
  </div>
}

let VideoAvatar = ({ producer, style }) => {
  return <div style={{ ...style }} >
    <Stack direction="row" alignItems={"center"} spacing={2}>
      <Avatar src={producer.avatar} />
      <Typography variant="h6" color="white">
        {producer.username}
      </Typography>
    </Stack>
  </div>
}

function FeedCard(props) {
  let cardRef = React.useRef(null)

  useEffect(() => {
    if (!cardRef.current) return

    let callback = (entries) => {
      entries.forEach(entry => {
        if (entry.target != cardRef.current || !entry.isIntersecting) return
        props.setCurrent()
      })
    }

    const observer = new IntersectionObserver(callback, { root: null, rootMargin: "0px", threshold: 0.5 })

    observer.observe(cardRef.current)

    return () => {
      observer && cardRef && cardRef.current && observer.unobserve(cardRef.current)
    }
  }, [cardRef])

  let theClass = "unanswered-card"
  if (props.gotItRight === true) theClass = "correct-card"
  if (props.gotItRight === false) theClass = "incorrect-card"

  return <Card ref={cardRef} className={theClass} sx={{ position: "relative", height: heights.card, mb: 2, top: 1 }} >
    {props.gotItRight && <MyConfetti />}
    {props.children}
  </Card>
}

function ClickableGloss(props) {
  let [wordSelection, setWordSelection] = React.useState(null)
  let color = (x) => {
    if (wordSelection === x) {
      if (x === props.correctAnswer)
        return "success"
      else
        return "error"
    }
    return "primary"
  }

  let fontSize = (x) => {
    let pxSize = 30;
    if (x.length < 6)
      return pxSize + "px";

    return Math.max(0, (30 - (x.length - 6))) + "px"
  }

  let recordAnswer = (answer) => {
    let fetchFrom = BACKEND_URL + "/feed-items/"+ props.id

    fetch(fetchFrom, {
      method: "PUT",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + window.localStorage.getItem('jwtToken'),
      },
      body: JSON.stringify({answer})
    })
      .then(response => response.json())
      .then(response => {
        console.log(response)
      })
  }

  if (props.arrangement == "line")
    return <Stack direction="row" spacing={2}>{
      props.gloss.map((x, i) => {

        return <Button
          variant="contained"
          color={color(x)}
          key={i} onClick={() => {
            setWordSelection(x)
            props.onClick(x)
            recordAnswer(x)
          }}>{x}</Button>
      })}</Stack>

  if (props.arrangement == "grid")
    return <Grid container spacing={2}>{
      props.gloss.map((x, i) => {
        return <Grid item xs={6} >
          <Button
            style={{ width: "42vw", height: "50px", fontSize: fontSize(x), overflow: "hidden" }}
            variant="contained"
            color={color(x)}
            key={i} onClick={() => {
              setWordSelection(x)
              props.onClick(x)
              recordAnswer(x)
            }}>{x}</Button>
        </Grid>
      })}</Grid>
}


export default function App() {
  let [lastAction, setLastAction] = React.useState(null)
  let [lastNav, setLastNav] = React.useState("feed")
  //let [loggedIn, setLoggedIn] = React.useState(false)
  const [jwtToken, setJwtToken] = React.useState(
    window.localStorage.getItem('jwtToken')
  );

  let setActionAndDoStuff = (action) => {
    console.log("setting action", action)

    setLastAction(action)

    if (action.action == "nav")
      setLastNav(action.arguments)
  }

  let currentComponent;

  if (lastNav == "feed")
    currentComponent = <Feed />
  else if (lastNav == "settings")
    currentComponent = <Settings />
  else if (lastNav == "profile")
    currentComponent = <Profile />


  return (
    <>
      <ThemeProvider theme={darkTheme}>
        <Router>
          {!jwtToken ? <Welcome setJwtToken={setJwtToken}></Welcome> :
            <LastActionContext.Provider value={{ action: lastAction, setAction: setActionAndDoStuff }}>

              <NavBar />
              <Container maxWidth="md" style={{ padding: 1 }}>
                <Routes>
                  <Route path="/" element={currentComponent} />
                </Routes>
              </Container>

            </LastActionContext.Provider>
          }
        </Router>
      </ThemeProvider>
    </>
  );

}


function typeToComponent(s) {
  return {
    StatsFeedItem,
    PlainTextFeedItem,
    MultipleChoiceFeedItem,
    SettingsFeedItem
  }[s]
}

function ComingSoonDialog(props) {
  const { onClose, selectedValue, open } = props;

  const handleClose = () => {
    onClose(selectedValue);
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>Coming Soon</DialogTitle>
    </Dialog>
  );
}

function Feed() {
  let [gotItRight, setGotItRight] = React.useState(false)
  let [currentItem, setCurrentItem] = React.useState(0)

  let scrollableRef = React.useRef(null)
  let [items, setItems] = React.useState([])
  let [error, setError] = React.useState(undefined)

  useEffect(() => {
    console.log("fetching initial...")
    fetchData(3)
  }, [])

  useEffect(() => {
    if (currentItem === items.length - 2) {
      //Far from perfect, but this ensures that the scroll snap animation is complete before adding more items.  Otherwise user will see a hitch.

      let disable = (e) => { e.preventDefault() }
      //Disable scroll
      scrollableRef.current.addEventListener("touchmove", disable, { passive: false })

      setTimeout(() => {
        //TODO: Fetch from our server: http://54.156.128.216:8080/feed-next
        fetchData(3)
        //Re-enable scroll
        scrollableRef.current.removeEventListener("touchmove", disable, { passive: false })

      }, 700)
    }
  }, [currentItem])

  let cardify = (c, i) => {
    let F = typeToComponent(c.type)

    if (i === currentItem)
      c.current = true
    else
      c.current = false

    return <div style={{ scrollSnapAlign: "start none", scrollSnapStop: "always" }}>
      {<F key={i}
        card={c}
        setCurrent={() => { console.log("Current changed", i); setCurrentItem(i) }}
        iAmCurrent={i == currentItem}
        myIndex={i}
        currentIndex={currentItem}
        setGotItRight={setGotItRight}
        gotItRight={gotItRight}
      />}
    </div>
  }

  let fetchData = (num) => {
    let fetchFrom = BACKEND_URL + "/feed-next?number=" + num

    fetch(fetchFrom, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + window.localStorage.getItem('jwtToken'),
      },
    })
      .then(response => response.json())
      .then(nextItems => {
        if (JSON.stringify(nextItems).match("error")) {
          setError(nextItems)
        }
        else {
          console.log(nextItems)
          setError(undefined)
          setItems(items.concat(nextItems))
        }
      })
  }

  return <div ref={scrollableRef} id="container" style={{ scrollSnapType: "y mandatory", height: "100vh", overflow: "scroll" }}>
    {error ? JSON.stringify(error) : items.map(cardify)}
  </div>
}


let MyConfetti = () => {
  const { width, height } = useWindowSize()
  return (
    <div style={{ position: "relative" }}>
      <Confetti
        width={width}
        height={height}
        numberOfPieces={400}
        confettiSource={{ x: 0, y: height }}
        gravity={0.5}
        recycle={false}
        initialVelocityY={50}
        initialVelocityX={50}
        tweenDuration={1000}
      />
    </div>
  )
}


let Profile = (props) => {
  return <Card sx={{ overflow: "scroll", height: "93vh", backgroundColor: "#F5F1ED" }}>
    <CardContent>
      <Stack alignItems="center" padding={5} spacing={2}>
        <Avatar alt="Cindy Baker" src="https://mui.com/static/images/avatar/1.jpg"
          sx={{ width: 150, height: 150 }} />
        <Typography variant="h6">John Doe</Typography>
      </Stack>
      <Stack>
        <Stack alignItems="left" padding={2}>
          <Typography variant="h6">Learning History</Typography>
          <Typography variant="body1">You've answered 36 questions</Typography>
          <Typography variant="body1">75% overall accuracy</Typography>
          <Typography variant="body1">You've practiced 21 words</Typography>
          <Typography variant="body1">Your longest streak was 5 days</Typography>
        </Stack>
        <Stack alignItems="left" padding={2}>
          <Typography variant="h6">Account Information</Typography>
          <Typography variant="body1">Member since June 2024</Typography>
          <Stack spacing={1}>
            <Button
              sx={{
                /* 
                borderRadius: '25px',
                p: 1,
                textTransform: "none", */
                backgroundColor: "#FFFFFF",
                boxShadow: 2,
                borderRadius: 2,
                color: "black",
                maxWidth: 180,
              }} >
              Edit Personal Data </Button>

            <Button
              sx={{
                /* backgroundColor: "#ff967c",
                borderRadius: 2,
                p: 1,
                maxWidth: 80,
                borderRadius: '25px',
                boxShadow: 3,
                textTransform: "none",
                color: "black" */
                backgroundColor: "#FFFFFF",
                boxShadow: 2,
                borderRadius: 2,
                color: "black",
                maxWidth: 90,
              }}
              onClick={() => {
                window.localStorage.removeItem('jwtToken')
                window.location.reload()
              }}
            >Log Out</Button>
          </Stack>
        </Stack>
        <Stack alignItems="left" padding={2}>
          <Typography variant="h6">Help</Typography>
          <Stack spacing={1}>
            <Button
              sx={{
                backgroundColor: "#FFFFFF",
                boxShadow: 2,
                borderRadius: 2,
                color: "black",
                maxWidth: 70,
              }} >
              FAQs </Button>
            <Button
              sx={{
                backgroundColor: "#FFFFFF",
                boxShadow: 2,
                borderRadius: 2,
                color: "black",
                maxWidth: 120,
              }} >
              Resources</Button>
          </Stack>
        </Stack>
        <Stack alignItems="left" padding={2}>
          <Typography variant="h6">Privacy and Legal</Typography>
          <Link>Terms and Conditions</Link>
          <Link>Privacy Policy</Link>
          <Link>Delete Account</Link>
        </Stack>
        {/* <Box
          sx={{
            backgroundColor: "#ff967c",
            borderRadius: 2,
            p: 1,
            minWidth: 250,
            borderRadius: '25px'
          }}>
          <Typography variant="h4" align="center">Level</Typography>
        </Box>
        <Box
          sx={{
            backgroundColor: "#ff967c",
            borderRadius: 2,
            p: 1,
            minWidth: 250,
            borderRadius: '25px'
          }}>
          <Typography variant="h4" align="center">Stats</Typography>
        </Box>
        <Typography align="center" variant="h6">You answered 15 questions in the last 2 days. You're on a roll!</Typography>
        <Box
          sx={{
            backgroundColor: "#ff967c",
            borderRadius: 2,
            p: 1,
            minWidth: 250,
            borderRadius: '25px'
          }}>
          <Typography variant="h4" align="center">Account Info</Typography>
        </Box> */}

      </Stack>
    </CardContent>
  </Card>
}


let LogIn = (props) => {
  const [username, setUsername] = React.useState(null)
  const [password, setPassword] = React.useState(null)
  return (
    <>
      <Stack>
        <TextField id="standard-basic" label="email" variant="standard" onChange={(event) => { setUsername(event.target.value) }} />
        <TextField id="standard-basic" label="password" variant="standard" type="password" onChange={(event) => { setPassword(event.target.value) }} />
      </Stack>
      <Stack align="right">
        <Link href="#">forgot password?</Link>
      </Stack>
      <Button
        sx={{
          backgroundColor: "#ff967c",
          borderRadius: 2,
          p: 1,
          minWidth: 100,
          borderRadius: '25px',
          boxShadow: 3,
          textTransform: "none",
          color: "black"
        }}
        onClick={() => {
          console.log(username, password)
          let fetchFrom = BACKEND_URL + "/users/login"
          fetch(fetchFrom,
            {
              method: "PUT",
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ username, password })
            })
            .then(response => response.json())
            .then(response => {
              console.log(response)
              props.setJwtToken(response.user.token)
              window.localStorage.setItem('jwtToken', response.user.token)
            })
        }}
      >
        <Typography variant="h5">Log In</Typography>
      </Button>
    </>)

}

let CreateAccount = (props) => {
  const [username, setUsername] = React.useState(null)
  const [email, setEmail] = React.useState(null)
  const [password, setPassword] = React.useState(null)
  const [confirmPassword, setConfirmPassword] = React.useState(null)
  return (
    <>
      <Stack paddingBottom={3}>
        <TextField id="standard-basic" label="username" variant="standard" onChange={(event) => { setUsername(event.target.value) }} />
        <TextField id="standard-basic" label="email" variant="standard" onChange={(event) => { setEmail(event.target.value) }} />
        <TextField id="standard-basic" label="password" variant="standard" type="password" onChange={(event) => { setPassword(event.target.value) }} />
        <TextField id="standard-basic" label="confirm password" variant="standard" type="password" onChange={(event) => { setConfirmPassword(event.target.value) }} />
        {!(password == confirmPassword) && <Alert severity="error">Passwords do not match.</Alert>}
      </Stack>
      <Button disabled={!(username && email && password && confirmPassword && (password == confirmPassword))}
        sx={{
          backgroundColor: "#ff967c",
          borderRadius: 2,
          p: 1,
          minWidth: 100,
          borderRadius: '25px',
          boxShadow: 3,
          textTransform: "none",
          color: "black"
        }}
        onClick={() => {
          console.log(username, email, password)
          let fetchFrom = BACKEND_URL + "/users/signup"
          fetch(fetchFrom,
            {
              method: "POST",
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ username, email, password })
            })
            .then(response => response.json())
            .then(response => {
              console.log(response)
              props.setJwtToken(response.user.token)
              window.localStorage.setItem('jwtToken', response.user.token)
            })
        }}
      >
        <Typography variant="h5">Sign Up</Typography>
      </Button>
    </>
  )
}


let Welcome = (props) => {
  let [createAccountSelected, setCreateAccountSelected] = React.useState(null)

  return (
    <div style={{ height: "100vh", background: "white", padding: 15 }}>
      <Stack alignItems="center" padding={2} spacing={3} paddingBottom={5}>
        <Typography align="center" variant="h2">Welcome to Lyrnify</Typography>
        <WavingHandIcon sx={{ fontSize: 100 }} />
        <Button
          onClick={() => setCreateAccountSelected(true)}
          sx={{
            backgroundColor: "#ff967c",
            borderRadius: 2,
            p: 1,
            minWidth: 250,
            borderRadius: '25px',
            boxShadow: 3,
            textTransform: "none",
            color: "black"
          }}>
          <Typography variant="h4" align="center">Create Account</Typography>
        </Button>
        <Button
          onClick={() => setCreateAccountSelected(false)}
          sx={{
            backgroundColor: "#ff967c",
            borderRadius: 2,
            p: 1,
            minWidth: 250,
            borderRadius: '25px',
            boxShadow: 3,
            textTransform: "none",
            color: "black"
          }}>
          <Typography variant="h4" align="center">Log in</Typography>
        </Button>
      </Stack>

      {createAccountSelected === null ? "" : createAccountSelected === false ?
        <LogIn setJwtToken={props.setJwtToken} />
        :
        <CreateAccount setJwtToken={props.setJwtToken} />
      }
    </div>
  )
}


let Settings = (props) => {

  return <Card sx={{ overflow: "scroll", height: "93vh", backgroundColor: "#F5F1ED" }}>
    <CardContent>
      <Stack align="center" padding={2} spacing={5}>
        <Typography variant="h2">Settings</Typography>
        <Stack alignItems={"center"}>
          <Box
            sx={{
              backgroundColor: "#ff967c",
              borderRadius: 2,
              p: 1,
              minWidth: 250,
              borderRadius: '25px'
            }}>
            <Typography variant="h4">Activities</Typography>
          </Box>
          <FormControl>
            <FormGroup sx={{ marginLeft: -8 }}>
              <FormControlLabel control={<Checkbox color="default" sx={{ '& .MuiSvgIcon-root': { fontSize: 30 } }} />} label={<Typography variant="h5">Alphabet</Typography>} />
              <FormControlLabel control={<Checkbox color="default" sx={{ '& .MuiSvgIcon-root': { fontSize: 30 } }} />} label={<Typography variant="h5">Vocabulary</Typography>} />
              <FormControlLabel control={<Checkbox color="default" sx={{ '& .MuiSvgIcon-root': { fontSize: 30 } }} />} label={<Typography variant="h5">Sentences</Typography>} />
            </FormGroup>
          </FormControl>
        </Stack>
        <Stack alignItems="center">
          <Box
            sx={{
              bgcolor: "#ff967c",
              borderRadius: 2,
              p: 1,
              minWidth: 250,
              borderRadius: '25px'
            }}>
            <Typography variant="h4">Difficulty Level</Typography>
          </Box>
          <FormControl>
            <FormGroup sx={{ marginLeft: 3 }}>
              <FormControlLabel control={<Checkbox color="default" sx={{ '& .MuiSvgIcon-root': { fontSize: 30 } }} />} label={<Typography variant="h5">Below my skill level</Typography>} />
              <FormControlLabel control={<Checkbox color="default" sx={{ '& .MuiSvgIcon-root': { fontSize: 30 } }} />} label={<Typography variant="h5">At my skill level</Typography>} />
              <FormControlLabel control={<Checkbox color="default" sx={{ '& .MuiSvgIcon-root': { fontSize: 30 } }} />} label={<Typography variant="h5">Above my skill level</Typography>} />
            </FormGroup>
          </FormControl>
        </Stack>
        <Stack alignItems={"center"}>
          <Box
            sx={{
              backgroundColor: "#ff967c",
              borderRadius: 2,
              p: 1,
              minWidth: 250,
              borderRadius: '25px'
            }}>
            <Typography variant="h4">Timed Practice</Typography>
          </Box>
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography variant="h5">Off</Typography>
            <Switch sx={{ transform: "scale(1.5)" }} />
            <Typography variant="h5">On</Typography>
          </Stack>
          <RadioGroup sx={{ marginLeft: -8 }}>
            <FormControlLabel value="30 seconds" control={<Radio color="default" sx={{ '& .MuiSvgIcon-root': { fontSize: 28, } }} />} label={<Typography variant="h5">30 seconds</Typography>} />
            <FormControlLabel value="1 minute" control={<Radio color="default" sx={{ '& .MuiSvgIcon-root': { fontSize: 28, } }} />} label={<Typography variant="h5">1 minute</Typography>} />
            <FormControlLabel value="2 minutes" control={<Radio color="default" sx={{ '& .MuiSvgIcon-root': { fontSize: 28, } }} />} label={<Typography variant="h5">2 minutes</Typography>} />
          </RadioGroup>
        </Stack>
      </Stack>
    </CardContent>
  </Card>
}
