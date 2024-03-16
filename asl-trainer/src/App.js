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
import Slide from '@mui/material/Slide';
import Fade from '@mui/material/Fade';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';



import NavBar from "./NavBar" 
import Clips from "./Clips" 

/* 

P - Palm orientation
L - Location
HS - Handshape
M - Movement
SS - Sentence Structure
NMM - Non-manual markers
SC - Sign choice

*/


let aslCards = [
  {
    clip: Clips.s3_host + '/clips/error-game/hello-your-name-what-incorrect.mp4',
    clipGloss: "HELLO WHAT YOU NAME?",
    correctClip: Clips.s3_host + '/clips/error-game/hello-your-name-what-correct.mp4',
    correctClipGloss: "HELLO YOU NAME WHAT?",
    type: "POA",
    english: "Hello, what's your name?",
    options: ["PO","L", "HS", "M", "NMM", "SS", "SC"],
    correctAnswer: {type: "SS", word: "YOU"},
    hint: "...",
    explanation: "TODO: Explanation here",
    
  },
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
]

function unabbreviate(abbr){
  let abbreviations = {
    "PO": "Palm Orientation",
    "L": "Location",
    "HS": "Handshape",
    "M": "Movement",
    "NMM": "Non-manual markers",
    "SS": "Sentence Structure",
    "SC": "Sign choice",
  }

  return abbreviations[abbr]
}

function POACard(props){
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

  /*
  let errorOptionToErrorSelection = (x,i)=>{
    //return <FormControlLabel value={x} control={<Radio />} label={unabbreviate(x)} />
    return <Button onClick={()=>{setTypeSelection(x)}} sx={{m: 1}} variant={typeSelection !== x ? "contained" : "outlined"}>{unabbreviate(x)}</Button>
  }
  */

  return (
    <Card style={{boxShadow: "none"}}>
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
              The video contains mistakes.  The correct ASL gloss for the English sentence  is shown below.  Click the <b>FIRST</b> gloss word that doesn't match the video.
            </Typography>
            <ClickableGloss onClick={setWordSelection} gloss={props.card.correctClipGloss} />
            {/*
            <Stack direction="row" spacing={2} sx={{mt: 2}}>
              <FormControl>
                <FormLabel id="demo-radio-buttons-group-label">Sign parameter errors</FormLabel>
                  {props.card.options.slice(0,5).map(errorOptionToErrorSelection)}
              </FormControl>
              <FormControl>
                <FormLabel id="demo-radio-buttons-group-label">Other types of errors</FormLabel>
                  {props.card.options.slice(5,7).map(errorOptionToErrorSelection)}
              </FormControl>
            </Stack>
  */}
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

function BasicCard(props) {
  return <>
    <POACard {...props} />
  </>
}


export default function App() {
  return (
    <>
      <Router>
        <NavBar />
        <Container maxWidth="md" sx={{pt: 2}}>
          <Routes>
            <Route path="/intro" element={<Intro />} />
            <Route path="/errors" element={<Deck cards={aslCards} startTime={new Date()} />} />
          </Routes>
        </Container>
      </Router>    
    </>
  );
}

function Intro(){
  return <>
    <Typography variant="h3">Introduction</Typography> 
    <ReactPlayer
      url={ Clips.introduction }
      controls={true}
    />
    
  </>
}


function Deck(props){
  // Make a state variable to store the current card's index
  const [cardIndex, setCardIndex] = React.useState(0)
  const [gotItRight, setGotItRight] = React.useState(false)

  React.useEffect(()=>{
    setCardIndex(0)
  },
  [props.startTime])

  const prev = ()=>{
    if(cardIndex - 1 >= 0){
      setCardIndex(cardIndex - 1)
      setGotItRight(false)
    }
  }

  const next = ()=>{
    if(cardIndex + 1 < props.cards.length){
      setCardIndex(cardIndex + 1)
      setGotItRight(false)
    }
  }

  return <>
    {/* <Gamification startTime={props.startTime} currentCorrect={currentCorrect} /> */}
    {props.cards[cardIndex] && <BasicCard card={props.cards[cardIndex]}
                    setGotItRight={setGotItRight}
                    gotItRight={gotItRight}
                    setCardIndex={setCardIndex}
                    cardIndex={cardIndex}
        />}
     <Button onClick={() => { prev() }} variant="outlined">Prev Card</Button>
     <Button onClick={() => { next()}} variant="outlined">Next Card</Button>
  </>
}

function Gamification(props){
  const {
    totalSeconds,
    seconds,
    minutes,
    hours,
    days,
    isRunning,
    start,
    pause,
    reset,
  } = useStopwatch({ autoStart: true });

  React.useEffect(()=>{
    reset() 
  },
  [props.startTime])


  return (
    <div style={{textAlign: 'center'}}>
        {props.currentCorrect && <MyConfetti />}
        {props.currentCorrect && "You got it!"}
        <div>{seconds}</div>
    </div>
  );
 
}

function AllCards(props) {
  return props.cards.map((x) => {
    return <BasicCard card={x} />
  })
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

