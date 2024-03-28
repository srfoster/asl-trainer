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
import Fade from '@mui/material/Fade';
import NavBar from "./NavBar" 
import InfiniteScroll from 'react-infinite-scroll-component';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import HeartIcon from '@mui/icons-material/FavoriteBorder';
import CommentIcon from '@mui/icons-material/Comment';
import SpeedIcon from '@mui/icons-material/Speed';
import SchoolIcon from '@mui/icons-material/School';
import InfoIcon from '@mui/icons-material/Info';

import { PieChart } from '@mui/x-charts/PieChart';

import {aslItems} from "./feedItems"
import {LastActionContext} from "./Contexts"

import { shuffle } from './utils';

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
  return <FeedCard>
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
  return <FeedCard card={props.card}>
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
      <div style={{height: "60vh", fontSize: 36, fontWeight: "lighter",textAlign: 'center'}}
        dangerouslySetInnerHTML={{__html: props.card.text}}>
      </div>
    </CardContent>
  </FeedCard>
}

function SettingsFeedItem(props){
  let [selectedSettings, setSelectedSettings] = React.useState([])

  return <FeedCard card={props.card}>
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

  let gotItRight = undefined;
  if(wordSelection !== null) gotItRight = (wordSelection === props.card.correctAnswer)

  if(gotItRight) console.log("got it right")

  React.useEffect(()=>{
    if(gotItRight) props.setGotItRight(true)
  },[gotItRight])

  return (
    <FeedCard gotItRight={gotItRight} card={props.card}>
      <CardMedia style={{height: "80vh", position: "relative"}}>
        <Video url={props.card.clip} producer={props.card.producer} />
        <LastActionContext.Consumer>
          {({action,setAction})=>(
            <Stack style={{position: "absolute", bottom: 10, right: 0}}>
              <IconButton aria-label="delete" onClick={(e)=>{console.log("hello");setAction({action: "heart", arguments: props.card})}}>
                <HeartIcon />
              </IconButton>
              <IconButton aria-label="comment"  onClick={(e)=>{setAction({action: "comment", arguments: props.card})}}>
                <CommentIcon />
              </IconButton>
              <IconButton aria-label="comment" onClick={(e)=>{setAction({action: "setSpeed", arguments: props.card})}}>
                <SpeedIcon />
              </IconButton>
              <IconButton aria-label="comment" onClick={(e)=>{setAction({action: "learnMore", arguments: props.card})}}>
                <SchoolIcon />
              </IconButton>
            </Stack>
          )}
        </LastActionContext.Consumer>
      </CardMedia>
      <CardContent>
        <Stack alignItems={"center"}>
          <Typography variant="h6" sx={{p: 1}}>
            </Typography>
            <ClickableGloss onClick={setWordSelection} gloss={props.card.randomizeOptions ? shuffle(props.card.answerOptions) : props.card.answerOptions} />
        </Stack>
      </CardContent>
    </FeedCard>
  );
}


function Video({url, producer}){
  let [playing, setPlaying] = React.useState(false)
  let [progress, setProgress] = React.useState(0)

  return <div style={{height: "100%"}} onClick={()=>{setPlaying(!playing)}}>
    <div style={{marginLeft: "-100%"}}>
      <ReactPlayer
              playing={playing}
              loop={true}
              url={ url}
              controls={false}
              width="150%"
              height="100%"
              onProgress={(p)=>{setProgress(p.played)}}
            />
    </div>
      <div style={{position: "absolute", bottom: 10, left: 4}} >
        <Stack direction="row" alignItems={"center"} spacing={2}>
          <Avatar src={producer.avatar} />
          <Typography variant="h6">
            {producer.username} 
          </Typography>
        </Stack>
      </div>
      <div style={{width: (progress*100)+"%", height: 4, backgroundColor: "white", borderRadius: 10, position: "absolute", bottom: 0}}></div>
  </div>
}

function FeedCard(props){
  let cardRef = React.useRef(null)


  useEffect(()=>{
    if(!cardRef.current) return

    let callback = (entries)=>{
      entries.forEach(entry=>{
        if(entry.target != cardRef.current || !entry.isIntersecting) return
        console.log("Just saw",cardRef.current, props.card.title)
      })
    }
    const observer = new IntersectionObserver(callback, {root: null, rootMargin: "0px", threshold: 1.0})

    observer.observe(cardRef.current)

    return ()=>{observer.unobserve(cardRef.current)}
  }, [cardRef])

  let theClass = "unanswered-card"
  if(props.gotItRight === true)  theClass = "correct-card"
  if(props.gotItRight === false) theClass = "incorrect-card"


  return <Card ref={cardRef} className={theClass} sx={{mb: 1}} >
    {props.gotItRight && <MyConfetti />}
    {props.children}
  </Card>
}

function ClickableGloss(props){
  let [wordSelection, setWordSelection] = React.useState(null)

  return <Stack direction="row" spacing={2}>{
    props.gloss.map((x,i)=>{
     return <Button 
       variant={x !== wordSelection ? "contained" : "outlined"}
       key={i} onClick={() => {
        setWordSelection(x)
        props.onClick(x)
      }}>{x}</Button>
  })}</Stack>
}


export default function App() {
  let [lastAction, setLastAction] = React.useState(null)

  let setActionAndDoStuff = (action)=>{ 
    console.log("setting action", action)

    setLastAction(action)
  }


  return (
    <>
      <ThemeProvider theme={darkTheme}>
        <LastActionContext.Provider value={{action: lastAction, setAction: setActionAndDoStuff}}>
          <Router>
            <NavBar />
            <Container maxWidth="md" style={{padding: 1}}>
              <Routes>
                <Route path="/" element={<Feed />} />
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

  useEffect(()=>{
    window.onscroll = ()=>{
       //console.log("Scroll", window.scrollY)
    }

    return ()=>{window.onscroll = null}
  },[])

  let cardify = (c,i)=>{
    let F = typeToComponent(c.type)

    return <F key={i}
              card={c}
              setGotItRight={setGotItRight}
              gotItRight={gotItRight}
        />
  }

  let [items, setItems] = React.useState(aslItems.slice(0,3))

  let fetchData = ()=>{
    setItems(items.concat(aslItems.slice(items.length, items.length + 1)))
  }

  let refresh = ()=>{
    console.log("refreshing")
  }

//  return items.map(cardify)
  return <InfiniteScroll
      dataLength={items.length} 
      next={fetchData}
      hasMore={true}
      loader={<h4>Loading...</h4>}
      endMessage={
        <p style={{ textAlign: 'center' }}>
          <b>Yay! You have seen it all</b>
        </p>
      }
      // below props only if you need pull down functionality
      refreshFunction={refresh}
      pullDownToRefresh
      pullDownToRefreshThreshold={50}
      pullDownToRefreshContent={
        <h3 style={{ textAlign: 'center', color: "white" }}>&#8595; Pull down to refresh</h3>
      }
      releaseToRefreshContent={
        <h3 style={{ textAlign: 'center', color: "white" }}>&#8593; Release to refresh</h3>
      }
    >
      {items.map(cardify)}
    </InfiniteScroll>
}


let MyConfetti = () => {
  const { width, height } = useWindowSize()
  return (
    <div style={{position: "relative"}}>
      <Confetti
        width={width} 
        height={height} 
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

