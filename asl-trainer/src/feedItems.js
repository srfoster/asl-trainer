import Clips from "./Clips" 

let errorInstructions = "The videos below contain mistakes!  Click the <b>FIRST</b> gloss word that doesn't match the video."

let fingerspellingInstructions = "The videos below involve fingerspelling!  Click the word being spelled."

let instructions = (text)=>{
  return {
    text: text, 
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
    type: "ErrorGameFeedItem" 
  },
  {
    clip: Clips.s3_host + '/clips/error-game/i-buy-coffee-starbucks-incorrect.mp4',
    clipGloss: "MY SHOPPING COFFEE STARBUCKS",
    correctClip: Clips.s3_host + '/clips/error-game/i-buy-coffee-starbucks-correct.mp4',
    english: "I buy coffee at Starbucks",
    correctClipGloss: "I BUY COFFEE STARBUCKS",
    correctAnswer: {word: "I"},
    type: "ErrorGameFeedItem" 
  },
  {
    clip: Clips.s3_host + '/clips/error-game/he-will-go-ferry-incorrect.mp4',
    correctClip: Clips.s3_host + '/clips/error-game/he-will-go-ferry-correct.mp4',
    english: "He will take the ferry",
    correctClipGloss: "THEY GO FERRY",
    correctAnswer: {word: "GO"},
    type: "ErrorGameFeedItem" 
  },
]

export let aslItems = [
  instructions(errorInstructions),
  ... errorGameItems,
  instructions(fingerspellingInstructions + " (Coming soon)"),
]
