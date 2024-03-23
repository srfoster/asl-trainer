import Clips from "./Clips" 
//import { Typography } from "@mui/material"

let welcomeInstructions = "<p>This is an early prototype of an app for learning ASL.</p> <p>Thanks for helping us test it!</p>"
let errorInstructions = "<p>The videos below contain mistakes!</p> <p>Mistakes can be related to grammar, vocabulary, or incorrect signs.</p> <p>Click the <b>FIRST</b> gloss word that doesn't match the video.</p>"

let fingerspellingInstructions = "The videos below involve fingerspelling!  Click the word being spelled."
let glossInstructions = "<p>The gloss below does not match the videos! It has mistakes.</p> <p>Find the first gloss word that does not match.</p>"

let instructions = (title, text, params)=>{
  return {
    text: text, 
    title: title || "",  
    type: "PlainTextFeedItem",
    params: params || {}
  }
}


let glossItems = [{
  clip: Clips.s3_host + '/clips/error-game/hello-your-name-what-correct.mp4',
  answerOptions: ["HELLO", "WHAT", "YOUR", "NAME?"],  
  english: "Hello, what's your name?",
  //options: ["PO","L", "HS", "M", "NMM", "SS", "SC"],
  correctAnswer: "WHAT",
  type: "MultipleChoiceFeedItem",
  producer: {
      username: "christineK",
      avatar: "https://mui.com/static/images/avatar/3.jpg"
  }
},
{
  clip: Clips.s3_host + '/clips/error-game/i-buy-coffee-starbucks-correct.mp4',
  answerOptions: ["I", "MAKE", "COFFEE", "STARBUCKS"],
  english: "I buy coffee at Starbucks",
  correctAnswer:  "MAKE",
  type: "MultipleChoiceFeedItem",
  producer: {
      username: "christineK",
      avatar: "https://mui.com/static/images/avatar/3.jpg"
  }

},
{
  clip: Clips.s3_host + '/clips/error-game/he-will-go-ferry-correct.mp4',
  answerOptions: ["THEY", "WILL", "TAKE-CAR"],
  english: "They will take the ferry",
  correctAnswer: "TAKE-CAR",
  type: "MultipleChoiceFeedItem",
  producer: {
      username: "christineK",
      avatar: "https://mui.com/static/images/avatar/3.jpg"
  }
},
]

let errorGameItems = [{
    clip: Clips.s3_host + '/clips/error-game/hello-your-name-what-incorrect.mp4',
    correctClip: Clips.s3_host + '/clips/error-game/hello-your-name-what-correct.mp4',
    answerOptions: ["HELLO", "YOU", "NAME", "WHAT?"],
    english: "Hello, what's your name?",
    correctAnswer: "YOU",
    type: "MultipleChoiceFeedItem",
    producer: {
        username: "christineK",
        avatar: "https://mui.com/static/images/avatar/3.jpg"
    }
  },
  {
    clip: Clips.s3_host + '/clips/error-game/i-buy-coffee-starbucks-incorrect.mp4',
    correctClip: Clips.s3_host + '/clips/error-game/i-buy-coffee-starbucks-correct.mp4',
    english: "I buy coffee at Starbucks",
    answerOptions: ["I", "BUY", "COFFEE", "STARBUCKS"],
    correctAnswer: "I",
    type: "MultipleChoiceFeedItem",
    producer: {
        username: "christineK",
        avatar: "https://mui.com/static/images/avatar/3.jpg"
    }

  },
  {
    clip: Clips.s3_host + '/clips/error-game/he-will-go-ferry-incorrect.mp4',
    correctClip: Clips.s3_host + '/clips/error-game/he-will-go-ferry-correct.mp4',
    english: "He will take the ferry",
    answerOptions: ["THEY", "GO", "FERRY"],
    correctAnswer: "GO",
    type: "MultipleChoiceFeedItem",
    producer: {
        username: "christineK",
        avatar: "https://mui.com/static/images/avatar/3.jpg"
    }
  },
]

export let aslItems = [
  instructions("Welcome", welcomeInstructions, {icon: "👋"}),
  instructions("Gloss Mistakes", glossInstructions, {icon: "info"}),
  ... glossItems,
  instructions("Find the Error", errorInstructions, {icon: "info"}),
  ... errorGameItems,
  instructions("Fingerspelling", fingerspellingInstructions + " (Coming soon)", {icon: "🤞"}),
]
