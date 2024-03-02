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
import { Typography } from '@mui/material';


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
    clip: '/clips/error-game/hello-your-name-what.incorrect.mp4',
    correctClip: '/clips/error-game/hello-your-name-what.correct.mp4',
    type: "POA",
    english: "Hello, what's your name?",
    options: ["PO","L", "HS", "M", "NMM", "SS", "SC"],
    correctAnswer: 5,
  },
  {
    clip: '/clips/error-game/i-buy-coffee-starbucks.incorrect.mp4',
    correctClip: '/clips/error-game/i-buy-coffee-starbucks.correct.mp4',
    type: "POA",
    english: "I buy coffee at Starbucks",
    options: ["PO","L", "HS", "M", "NMM", "SS", "SC"],
    correctAnswer: 2,
  },
  {
    clip: '/clips/error-game/he-will-go-ferry.incorrect.mp4',
    correctClip: '/clips/error-game/he-will-go-ferry.correct.mp4',
    type: "POA",
    english: "He will take the ferry",
    options: ["PO","L", "HS", "M", "NMM", "SS", "SC"],
    correctAnswer: 6,
  },
]


function POACard(props){
  let [showCorrect, setShowCorrect] = React.useState(false)

  return (
    <Card sx={{ minWidth: 275 }}>
      <CardContent>
        {props.card.english}
        <ReactPlayer
          url={ props.card.clip }
          controls={true}
        />
      </CardContent>
      <CardActions>
        {props.card.options.map((x,i)=>{
          return <Button onClick={()=>{
            if(i === props.card.correctAnswer){
              props.gotItRight()
            }
          }}>{x}</Button>
        })}
      </CardActions>
    </Card>
  );
}

function BasicCard(props) {
  return <POACard {...props} />
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
  const [currentCorrect, setCurrentCorrect] = React.useState(false)

  React.useEffect(()=>{
    setCardIndex(0)
  },
  [props.startTime])

  const gotItRight = ()=>{
    setCurrentCorrect(true)
  }

  const prev = ()=>{
    if(cardIndex - 1 >= 0){
      setCardIndex(cardIndex - 1)
      setCurrentCorrect(false)
    }
  }

  const next = ()=>{
    if(cardIndex + 1 < props.cards.length){
      setCardIndex(cardIndex + 1)
      setCurrentCorrect(false)
    }
  }

  return <>
    <Gamification startTime={props.startTime} currentCorrect={currentCorrect} />
    {props.cards[cardIndex] && <BasicCard card={props.cards[cardIndex]}
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

