import './App.css';
import ReactPlayer from 'react-player'
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardMedia from '@mui/material/CardMedia';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';

import React, { useEffect } from "react"
import {HashRouter as Router, Routes, Route, Link} from "react-router-dom"
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
import { Box} from '@mui/system';
import Checkbox from '@mui/material/Checkbox';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import { Radio } from '@mui/material';
import RadioGroup from '@mui/material/RadioGroup';
import FormLabel from '@mui/material/FormLabel';

import {aslItems} from "./feedItems"
import {LastActionContext} from "./Contexts"

import { shuffle } from './utils';
import {heights} from "./config"
import useCurrentColorScheme from '@mui/system/cssVars/useCurrentColorScheme';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});



let stats = (data)=>{
  return {
    data: data, 
    type: "StatsFeedItem"
  }
}

function StatsFeedItem(props){
  return <FeedCard {... props}>
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

function PlainTextFeedItem(props){
  let stringToIcon = (s)=>{
    let mappings = {info: InfoIcon, heart: HeartIcon}
    let Mapping = mappings[s]

    if(Mapping)
      return <Mapping fontSize={"large"} />

    return s
  }

  let icon = stringToIcon(props.card.params.icon )
  return <FeedCard {...props} gotItRight={undefined}>
    <div style={{fontSize: 32, padding: 5}}>
      <Stack 
        direction="row" 
        divider={<Divider orientation="vertical" flexItem />}

        spacing={1} 
        alignItems={"center"}>
        {icon}<span>{props.card.title}</span>
      </Stack>
    </div>
    <CardContent >
      <div style={{fontSize: 36, fontWeight: "lighter",textAlign: 'center'}}
        dangerouslySetInnerHTML={{__html: props.card.text}}>
      </div>
    </CardContent>
  </FeedCard>
}

function SettingsFeedItem(props){
  let [selectedSettings, setSelectedSettings] = React.useState([])

  return <FeedCard {...props}>
    <CardContent>
      <Typography
        variant="h6"
        sx={{p: 1}}
        dangerouslySetInnerHTML={{__html: props.card.text}}>
        </Typography>
        <Stack direction="row" spacing={2} justifyContent="center">
        {props.card.options.map((x,i)=>{
          return <Button variant={selectedSettings.includes(x) ? "outlined" : "contained"} key={i} onClick={()=>{setSelectedSettings(selectedSettings.concat(x))}}>{x}</Button>
        })}
        </Stack>
    </CardContent>
  </FeedCard>
}

function MultipleChoiceFeedItem(props){
  let [wordSelection, setWordSelection] = React.useState(null)
  let [progress, setProgress] = React.useState(0)

  let gotItRight = undefined;
  if(wordSelection !== null) gotItRight = (wordSelection === props.card.correctAnswer)

  if(gotItRight) console.log("got it right")

  React.useEffect(()=>{
    if(gotItRight) props.setGotItRight(true)
  },[gotItRight])

  return (
    <FeedCard {...props} gotItRight={gotItRight} >
          <div
          style={{position: "relative", height: "100%"}}
           >
          {Math.abs(props.myIndex - props.currentIndex) < 2 &&
            <Video startPlaying={props.iAmCurrent} url={props.card.clip} producer={props.card.producer} setProgress={setProgress} />}
          </div>

          {/* <FloatingVideoIcons style={{position: "absolute", bottom: "25vh", right: 0}} /> */}
        <div style={{position: "absolute", width: "100%", bottom: "20vh", left: 0}}>
          <div style={{padding: 10}}>
            <VideoAvatar producer={props.card.producer} />
          </div>
          <div style={{}}>
            <VideoProgress progress={progress} />
          </div>
        </div>
        <div style={{position: "absolute", 
        backgroundColor: "rgba(0,0,0,0.75)", 
        width: "101%", bottom: 0, left: 0, height: "20vh", display: "flex"}}>
          <Stack justifyContent={"center"} alignItems={"center"} style={{margin: 20, flexGrow:  1}}>
            <ClickableGloss 
              arrangement={props.card.arrangement}
              correctAnswer={props.card.correctAnswer}
              onClick={setWordSelection} gloss={props.card.randomizeOptions ? shuffle(props.card.answerOptions) : props.card.answerOptions} />
          </Stack>
        </div>
    </FeedCard>
  );
}

let FloatingVideoIcons = (props)=> {
  return <LastActionContext.Consumer>
    {({action,setAction})=>(
      <Stack style={{...props.style}}>
        <IconButton aria-label="delete" onClick={(e)=>{console.log("hello");setAction({action: "heart", arguments: props.card})}}>
          <HeartIcon style={{ width: '50px', height: '50px' }}/>
        </IconButton>
        <IconButton aria-label="comment"  onClick={(e)=>{setAction({action: "comment", arguments: props.card})}}>
          <CommentIcon style={{ width: '50px', height: '50px' }}/>
        </IconButton>
        <IconButton aria-label="comment" onClick={(e)=>{setAction({action: "setSpeed", arguments: props.card})}}>
          <SpeedIcon style={{ width: '50px', height: '50px' }}/>
        </IconButton>
        <IconButton aria-label="comment" onClick={(e)=>{setAction({action: "learnMore", arguments: props.card})}}>
          <SchoolIcon style={{ width: '50px', height: '50px' }}/>
        </IconButton>
      </Stack>
    )}
  </LastActionContext.Consumer>
}


function Video({startPlaying, url, setProgress}){
  let [playing, setPlaying] = React.useState(false)

  useEffect(()=>{
    setPlaying(startPlaying)
  },[startPlaying])

  return <>
    <div className="react-player-container" style={{height: "100%"}}
     onClick={()=>{setPlaying(!playing)}}
    >
      {<ReactPlayer
          id={url}
          playing={playing}
          muted={true}
          loop={true}
          url={ url}
          controls={false}
          height="100%"
          width="100%"
          onProgress={(p)=>{setProgress(p.played)}}
/> }
    </div>
  </>
}

let VideoProgress = ({progress}) => {
  return <div style={{width: "100%", backgroundColor: "black", height: 4}}>
     <div style={{ width: (progress * 100) + "%", height: 4, backgroundColor: "white", borderRadius: 10}}></div>
  </div>
}

let VideoAvatar = ({producer, style}) => {
  return <div style={{...style}} >
        <Stack direction="row" alignItems={"center"} spacing={2}>
          <Avatar src={producer.avatar} />
          <Typography variant="h6">
            {producer.username} 
          </Typography>
        </Stack>
      </div>
}

function FeedCard(props){
  let cardRef = React.useRef(null)

  useEffect(()=>{
    if(!cardRef.current) return

    let callback = (entries)=>{
      entries.forEach(entry=>{
        if(entry.target != cardRef.current || !entry.isIntersecting) return
        props.setCurrent()
      })
    }

    const observer = new IntersectionObserver(callback, {root: null, rootMargin: "0px", threshold: 0.5})

    observer.observe(cardRef.current)

    return ()=>{
      observer && cardRef && cardRef.current && observer.unobserve(cardRef.current)}
  }, [cardRef])

  let theClass = "unanswered-card"
  if(props.gotItRight === true)  theClass = "correct-card"
  if(props.gotItRight === false) theClass = "incorrect-card"

  return <Card ref={cardRef} className={theClass} sx={{position: "relative", height: heights.card, mb: 2, top: 1}} >
    {props.gotItRight && <MyConfetti />}
    {props.children}
  </Card>
}

function ClickableGloss(props){
  let [wordSelection, setWordSelection] = React.useState(null)

  let color = (x)=>{
    if(wordSelection === x)
    {
      if(x === props.correctAnswer)
        return "success"
      else
        return "error"
    }
    return "primary"
  }

  if(props.arrangement == "line")
    return <Stack direction="row" spacing={2}>{
      props.gloss.map((x,i)=>{

      return <Button 
        variant="contained"
        color={color(x)}
        key={i} onClick={() => {
          setWordSelection(x)
          props.onClick(x)
        }}>{x}</Button>
    })}</Stack>
  
  if(props.arrangement == "grid")
    return <Grid container spacing={2}>{
      props.gloss.map((x,i)=>{
      return <Grid item xs={6}>
        <Button 
          style={{width: "100%"}}
          variant="contained"
          color={color(x)}
          key={i} onClick={() => {
            setWordSelection(x)
            props.onClick(x)
          }}>{x}</Button>
      </Grid>
    })}</Grid>
}


export default function App() {
  let [lastAction, setLastAction] = React.useState(null)
  let [lastNav, setLastNav] = React.useState("feed")

  let setActionAndDoStuff = (action)=>{ 
    console.log("setting action", action)

    setLastAction(action)

    if(action.action == "nav")
      setLastNav(action.arguments)
  }

  let currentComponent;
  
  if(lastNav == "feed")
    currentComponent = <Feed />
  else if(lastNav == "settings")
    currentComponent = <Settings/>



  return (
    <>
      <ThemeProvider theme={darkTheme}>
        <LastActionContext.Provider value={{action: lastAction, setAction: setActionAndDoStuff}}>
          <Router>
            <NavBar />
            <Container maxWidth="md" style={{padding: 1}}>
              <Routes>
                <Route path="/" element={currentComponent} />
              </Routes>
            </Container>
          </Router>    
        </LastActionContext.Provider>
      </ThemeProvider>
    </>
  );
}

function typeToComponent(s){
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

function Feed(){
  let [gotItRight, setGotItRight] = React.useState(false)
  let [currentItem, setCurrentItem] = React.useState(0)

  let scrollableRef = React.useRef(null)
  let [items, setItems] = React.useState(aslItems.slice(0,3))

  useEffect(()=>{
    if(currentItem === items.length - 2){
      //Far from perfect, but this ensures that the scroll snap animation is complete before adding more items.  Otherwise user will see a hitch.

      let disable = (e)=>{e.preventDefault()}
      //Disable scroll
      scrollableRef.current.addEventListener("touchmove", disable, {passive: false})

      setTimeout(()=>{
         
        //TODO: Fetch from our server: http://54.156.128.216:8080/feed-next
        fetchData()
        //Re-enable scroll
        scrollableRef.current.removeEventListener("touchmove", disable, {passive: false})

      }, 700)
    }
  }, [currentItem])

  let cardify = (c,i)=>{
    let F = typeToComponent(c.type)

    if(i === currentItem)
      c.current = true
    else
      c.current = false

    return <div style={{scrollSnapAlign: "start none", scrollSnapStop: "always"}}>
     { <F key={i}
          card={c}
          setCurrent={()=>{console.log("Current changed", i);setCurrentItem(i)}}
          iAmCurrent={i == currentItem}
          myIndex={i}
          currentIndex={currentItem}
          setGotItRight={setGotItRight}
          gotItRight={gotItRight}
      />}
    </div>
  }


  let fetchData = ()=>{
    setItems(items.concat(aslItems.slice(items.length, items.length + 1)))
  }

  return <div ref={scrollableRef} id="container" style={{scrollSnapType: "y mandatory", height: "100vh", overflow: "scroll"}}>
     {items.map(cardify)}
  </div>
}


let MyConfetti = () => {
  const { width, height } = useWindowSize()
  return (
    <div style={{position: "relative"}}>
      <Confetti
        width={width} 
        height={height} 
        numberOfPieces={400}
        confettiSource={{x: 0, y: height}}
        gravity={0.5}
        recycle={false}
        initialVelocityY={50}
        initialVelocityX={50}
        tweenDuration={1000}
      />
    </div>
  )
}



let Settings = (props) =>{
   
  return <Card>
    <CardContent>
      <Stack align="center" spacing={5}>
        <IconButton >
            <SettingsIcon style={{ width: '200px', height: '200px' }} />
        </IconButton>    
        <Typography variant="h3">Settings</Typography>
        {/* add padding */}
        <Stack>
          <Box
              sx={{
                bgcolor: 'primary',
                boxShadow: 1,
                borderRadius: 2,
                p: 2,
                 }}>
            <Typography variant="h4">Activities</Typography>
          </Box>
       <FormControl>
        <FormGroup >
          <FormControlLabel control={<Checkbox color="success" sx={{ '& .MuiSvgIcon-root': { fontSize: 40 } }}/>} label="Alphabet"/>
          <FormControlLabel control={<Checkbox color="success" sx={{ '& .MuiSvgIcon-root': { fontSize: 40 } }}/>} label="Vocabulary"/>
          <FormControlLabel control={<Checkbox color="success" sx={{ '& .MuiSvgIcon-root': { fontSize: 40 } }}/>} label="Sentences"/>
        </FormGroup>
        </FormControl>
        </Stack>
        <Stack>
          <Box
              sx={{
                bgcolor: 'primary',
                boxShadow: 1,
                borderRadius: 2,
                p: 2,
                 }}>
            <Typography variant="h4">Difficulty Level</Typography>
          </Box>
       <FormControl>
       <FormLabel>Show me videos...</FormLabel>
       <FormGroup >
          <FormControlLabel control={<Checkbox color="success" sx={{ '& .MuiSvgIcon-root': { fontSize: 40 } }}/>} label="Below my skill level"/>
          <FormControlLabel control={<Checkbox color="success" sx={{ '& .MuiSvgIcon-root': { fontSize: 40 } }}/>} label="At my skill level"/>
          <FormControlLabel control={<Checkbox color="success" sx={{ '& .MuiSvgIcon-root': { fontSize: 40 } }}/>} label="Above my skill level"/>
        </FormGroup>
        </FormControl>
        </Stack>
      </Stack> 
    </CardContent>
  </Card>
}
