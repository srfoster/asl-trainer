import './App.css';
import ReactPlayer from 'react-player'
import Button from '@mui/material/Button';
import Slider from '@mui/material/Slider';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Container from '@mui/material/Container';
import React from "react"
import {HashRouter as Router, Routes, Route, Link} from "react-router-dom"
import { useStopwatch } from 'react-timer-hook';
import useWindowSize from 'react-use/lib/useWindowSize'
import Confetti from 'react-confetti'
import { Stack, Typography } from '@mui/material';
import Fade from '@mui/material/Fade';
import NavBar from "./NavBar" 
import Clips from "./Clips" 
import InfiniteScroll from 'react-infinite-scroll-component';

let errorInstructions = {
  text: "The videos below contain mistakes!  Click the <b>FIRST</b> gloss word that doesn't match the video.",
  type: "PlainTextFeedItem"
}

let aslCards = [
  {
    clip: Clips.s3_host + '/clips/error-game/hello-your-name-what-incorrect.mp4',
    clipGloss: "HELLO WHAT YOU NAME?",
    correctClip: Clips.s3_host + '/clips/error-game/hello-your-name-what-correct.mp4',
    correctClipGloss: "HELLO YOU NAME WHAT?",
    english: "Hello, what's your name?",
    options: ["PO","L", "HS", "M", "NMM", "SS", "SC"],
    correctAnswer: {type: "SS", word: "YOU"},
    hint: "...",
    explanation: "TODO: Explanation here",
    type: "ErrorGameFeedItem" 
  },
  {
    clip: Clips.s3_host + '/clips/error-game/hello-your-name-what-incorrect.mp4',
    clipGloss: "HELLO WHAT YOU NAME?",
    correctClip: Clips.s3_host + '/clips/error-game/hello-your-name-what-correct.mp4',
    correctClipGloss: "HELLO YOU NAME WHAT?",
    english: "Hello, what's your name?",
    options: ["PO","L", "HS", "M", "NMM", "SS", "SC"],
    correctAnswer: {type: "SS", word: "YOU"},
    hint: "...",
    explanation: "TODO: Explanation here",
    type: "ErrorGameFeedItem" 
  },
  {
    clip: Clips.s3_host + '/clips/error-game/hello-your-name-what-incorrect.mp4',
    clipGloss: "HELLO WHAT YOU NAME?",
    correctClip: Clips.s3_host + '/clips/error-game/hello-your-name-what-correct.mp4',
    correctClipGloss: "HELLO YOU NAME WHAT?",
    english: "Hello, what's your name?",
    options: ["PO","L", "HS", "M", "NMM", "SS", "SC"],
    correctAnswer: {type: "SS", word: "YOU"},
    hint: "...",
    explanation: "TODO: Explanation here",
    type: "ErrorGameFeedItem" 
    
  },
  {
    clip: Clips.s3_host + '/clips/error-game/hello-your-name-what-incorrect.mp4',
    clipGloss: "HELLO WHAT YOU NAME?",
    correctClip: Clips.s3_host + '/clips/error-game/hello-your-name-what-correct.mp4',
    correctClipGloss: "HELLO YOU NAME WHAT?",
    english: "Hello, what's your name?",
    options: ["PO","L", "HS", "M", "NMM", "SS", "SC"],
    correctAnswer: {type: "SS", word: "YOU"},
    hint: "...",
    explanation: "TODO: Explanation here",
    type: "ErrorGameFeedItem" 
    
  },
  {
    clip: Clips.s3_host + '/clips/error-game/hello-your-name-what-incorrect.mp4',
    clipGloss: "HELLO WHAT YOU NAME?",
    correctClip: Clips.s3_host + '/clips/error-game/hello-your-name-what-correct.mp4',
    correctClipGloss: "HELLO YOU NAME WHAT?",
    english: "Hello, what's your name?",
    options: ["PO","L", "HS", "M", "NMM", "SS", "SC"],
    correctAnswer: {type: "SS", word: "YOU"},
    hint: "...",
    explanation: "TODO: Explanation here",
    type: "ErrorGameFeedItem" 
    
  },
  /*
  {
    clip: Clips.s3_host + '/clips/error-game/i-buy-coffee-starbucks-incorrect.mp4',
    correctClip: Clips.s3_host + '/clips/error-game/i-buy-coffee-starbucks-correct.mp4',
    type: "POA",
    english: "I buy coffee at Starbucks",
    options: ["PO","L", "HS", "M", "NMM", "SS", "SC"],
    correctAnswer: "HS",
  },
  {
    clip: Clips.s3_host + '/clips/error-game/he-will-go-ferry-incorrect.mp4',
    correctClip: Clips.s3_host + '/clips/error-game/he-will-go-ferry-correct.mp4',
    type: "POA",
    english: "He will take the ferry",
    options: ["PO","L", "HS", "M", "NMM", "SS", "SC"],
    correctAnswer: "SC",
  },
  */
]

function PlainTextFeedItem(props){
  return <Card sx={{m: 1}} >
    <CardContent>
      <Typography
        variant="h6"
        sx={{p: 1}}
        dangerouslySetInnerHTML={{__html: props.card.text}}>
        </Typography>
    </CardContent>
  </Card>
}

function ErrorGameFeedItem(props){
  return !props.gotItRight ?  
          <div><POACardDefault {...props} /> </div> :
          <Fade in={true} timeout={1000}>
            <div><POACardCorrect {...props} /></div>
          </Fade>
}

function POACardDefault(props){
  let [wordSelection, setWordSelection] = React.useState(null)
  //let [typeSelection, setTypeSelection] = React.useState(null)

  let checkAnswer = ()=>{
    if(/*typeSelection === props.card.correctAnswer["type"] && */ wordSelection === props.card.correctAnswer["word"]){
      props.setGotItRight(true)
    }
  }

  return (
    <Card sx={{m: 1}}>
      <CardContent>
        <Stack alignItems={"center"}>
          <Typography variant="h4" sx={{p: 1}}>
            What's wrong with this video?
          </Typography>
          <Card>
            <CardContent style={{paddingBottom: 5}}>
              <ReactPlayer
                url={ props.card.clip }
                controls={true}
              />
              <Typography variant="h6" sx={{mt: 1, p: 0, textAlign: "center"}}>
                English: {props.card.english}
              </Typography>
            </CardContent>
          </Card>
          <Typography variant="h6" sx={{p: 1}}>
            </Typography>
            <ClickableGloss onClick={setWordSelection} gloss={props.card.correctClipGloss} />
        </Stack>
      </CardContent>
      <CardActions style={{justifyContent: "flex-end"}}>
        {wordSelection && <Button onClick={checkAnswer} variant="contained" color="secondary">Submit</Button>}
      </CardActions>
    </Card>
  );
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

function POACardCorrect(props){
  return (
    <Card>
      <CardContent>
        <Stack alignItems={"center"}>
          <Typography variant="h4" sx={{p: 1}}>
            Correct!
          </Typography>
          <Typography variant="p" sx={{p: 1}}>
            This is how you should sign it
          </Typography>
          <ReactPlayer
            url={ props.card.correctClip }
            controls={true}
          />
          <Typography variant="h6" sx={{p: 1}}>
            English: {props.card.english}
          </Typography>
          {props.gotItRight && <Typography variant="h6" sx={{p: 1}}>
            ASL Gloss: {props.card.correctClipGloss}
          </Typography>}
          {props.gotItRight && props.card.explanation}
        </Stack>
      </CardContent>
      <CardActions>
        <Button onClick={()=>{props.setGotItRight(false)}}>Redo?</Button>
      </CardActions>
    </Card>
  );
}


export default function App() {
  return (
    <>
      <Router>
        <NavBar />
        <Container maxWidth="md" sx={{pt: 2}}>
          <Routes>
            <Route path="/" element={<Feed />} />
          </Routes>
        </Container>
      </Router>    
    </>
  );
}

function Feed(){
  let [gotItRight, setGotItRight] = React.useState(false)

  let cardify = (c)=>{
    let F = eval(c.type)

    return <F card={c}
              setGotItRight={setGotItRight}
              gotItRight={gotItRight}
        />
  }

  let [items, setItems] = React.useState( [errorInstructions].concat(aslCards))

  let fetchData = ()=>{
    setItems(items.concat(aslCards))
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
        <h3 style={{ textAlign: 'center' }}>&#8595; Pull down to refresh</h3>
      }
      releaseToRefreshContent={
        <h3 style={{ textAlign: 'center' }}>&#8593; Release to refresh</h3>
      }
    >
      {items.map(cardify)}
    </InfiniteScroll>
}


let MyConfetti = () => {
  const { width, height } = useWindowSize()
  return (
    <Confetti
      width={width}
      height={height}
    />
  )
}

