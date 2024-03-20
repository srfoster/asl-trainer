import Clips from "./Clips" 
import { Typography } from "@mui/material"

let errorInstructions = "<p>The videos below contain mistakes!</p> <p>Mistakes can be related to grammar, vocabulary, or incorrect signs.</p> <p>Click the <b>FIRST</b> gloss word that doesn't match the video.</p>"

let fingerspellingInstructions = "The videos below involve fingerspelling!  Click the word being spelled."

let instructions = (title, text)=>{
  return {
    text: text, 
    title: title || "",  
    type: "PlainTextFeedItem"
  }
}
 
let errorGameItems = [{
    clip: Clips.s3_host + '/clips/error-game/hello-your-name-what-incorrect.mp4',
    clipGloss: "HELLO WHAT YOU NAME?",
    correctClip: Clips.s3_host + '/clips/error-game/hello-your-name-what-correct.mp4',
    correctClipGloss: "HELLO YOU NAME WHAT?",
    english: "Hello, what's your name?",
    //options: ["PO","L", "HS", "M", "NMM", "SS", "SC"],
    correctAnswer: {/*type: "SS",*/ word: "YOU"},
    type: "ErrorGameFeedItem",
    producer: {
        username: "christineK",
        avatar: "https://mui.com/static/images/avatar/3.jpg"
    }
  },
  {
    clip: Clips.s3_host + '/clips/error-game/i-buy-coffee-starbucks-incorrect.mp4',
    clipGloss: "MY SHOPPING COFFEE STARBUCKS",
    correctClip: Clips.s3_host + '/clips/error-game/i-buy-coffee-starbucks-correct.mp4',
    english: "I buy coffee at Starbucks",
    correctClipGloss: "I BUY COFFEE STARBUCKS",
    correctAnswer: {word: "I"},
    type: "ErrorGameFeedItem",
    producer: {
        username: "christineK",
        avatar: "https://mui.com/static/images/avatar/3.jpg"
    }

  },
  {
    clip: Clips.s3_host + '/clips/error-game/he-will-go-ferry-incorrect.mp4',
    correctClip: Clips.s3_host + '/clips/error-game/he-will-go-ferry-correct.mp4',
    english: "He will take the ferry",
    correctClipGloss: "THEY GO FERRY",
    correctAnswer: {word: "GO"},
    type: "ErrorGameFeedItem",
    producer: {
        username: "christineK",
        avatar: "https://mui.com/static/images/avatar/3.jpg"
    }
  },
]

export let aslItems = [
  instructions("Find the Error", errorInstructions),
  ... errorGameItems,
  instructions("Fingerspelling", fingerspellingInstructions + " (Coming soon)"),
]
