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
import React from "react"
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

import { PieChart } from '@mui/x-charts/PieChart';

import {aslItems} from "./feedItems"

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
  return <FeedCard>
    <CardHeader title="Instructions">
    </CardHeader>
    <CardContent >
      <div style={{height: "60vh", fontSize: 36, fontWeight: "lighter",textAlign: 'center'}}
        dangerouslySetInnerHTML={{__html: props.card.text}}>
      </div>
    </CardContent>
  </FeedCard>
}

function SettingsFeedItem(props){
  let [selectedSettings, setSelectedSettings] = React.useState([])

  return <FeedCard>
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

function ErrorGameFeedItem(props){
  let [wordSelection, setWordSelection] = React.useState(null)

  let gotItRight = wordSelection === props.card.correctAnswer["word"]

  if(gotItRight) console.log("got it right")

  React.useEffect(()=>{
    if(gotItRight) props.setGotItRight(true)
  },[gotItRight])

  return (
    <FeedCard gotItRight={gotItRight}>
      <CardMedia style={{height: "80vh", position: "relative"}}>
        <Video url={props.card.clip} />
        <Stack style={{position: "absolute", bottom: 10, right: 0}}>
          <IconButton aria-label="delete">
            <HeartIcon />
          </IconButton>
          <IconButton aria-label="comment">
            <CommentIcon />
          </IconButton>
          <IconButton aria-label="comment">
            <SpeedIcon />
          </IconButton>
          <IconButton aria-label="comment">
            <SchoolIcon />
          </IconButton>
        </Stack>
      </CardMedia>
      <CardContent>
        <Stack alignItems={"center"}>
          <Typography variant="h6" sx={{p: 1}}>
            </Typography>
            <ClickableGloss onClick={setWordSelection} gloss={props.card.correctClipGloss} />
        </Stack>
      </CardContent>
    </FeedCard>
  );
}


function Video({url}){
  let [playing, setPlaying] = React.useState(false)
  let [progress, setProgress] = React.useState(0)

  return <div style={{height: "100%"}} onClick={()=>{setPlaying(!playing)}}>
    <ReactPlayer
            playing={playing}
            loop={true}
            url={ url}
            controls={false}
            width="100%"
            height="100%"
            onProgress={(p)=>{setProgress(p.played)}}
          />
      <div style={{position: "absolute", bottom: 10}} >
        <Stack direction="row" alignItems={"center"} spacing={2}>
          <Avatar src="https://mui.com/static/images/avatar/3.jpg" />
          <Typography variant="h6">
            Christine K
          </Typography>
        </Stack>
      </div>
      <div style={{width: (progress*100)+"%", height: 4, backgroundColor: "white", borderRadius: 10, position: "absolute", bottom: 0}}></div>
  </div>
}

function FeedCard(props){
  return <Card className={props.gotItRight ? "correct-card" : ""} sx={{mb: 1}} {...props}>
    {props.gotItRight && <MyConfetti />}
    {props.children}
  </Card>
}

function ClickableGloss(props){
  let [wordSelection, setWordSelection] = React.useState(null)

  return <Stack direction="row" spacing={2}>{props.gloss.split(" ").map((x,i)=>{
     return <Button 
       variant={x !== wordSelection ? "contained" : "outlined"}
       key={i} onClick={() => {
        setWordSelection(x)
        props.onClick(x)
      }}>{x}</Button>
  })}</Stack>
}

export default function App() {
  return (
    <>
      <ThemeProvider theme={darkTheme}>
        <Router>
          <NavBar />
          <Container maxWidth="md" style={{padding: 1}}>
            <Routes>
              <Route path="/" element={<Feed />} />
            </Routes>
          </Container>
        </Router>    
      </ThemeProvider>
    </>
  );
}

function stringToComponent(s){
  return {
    StatsFeedItem,
    PlainTextFeedItem,
    ErrorGameFeedItem,
    SettingsFeedItem
  }[s]
}

function Feed(){
  let [gotItRight, setGotItRight] = React.useState(false)

  let cardify = (c)=>{
    let F = stringToComponent(c.type)

    return <F card={c}
              setGotItRight={setGotItRight}
              gotItRight={gotItRight}
        />
  }

  let [items, setItems] = React.useState(aslItems.concat(stats({})))

  let fetchData = ()=>{
    //setItems(items.concat([stats({})]))
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

