import { shuffle } from "./utils"
import Clips from "./Clips"
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

//import { Typography } from "@mui/material"

let welcomeInstructions = "<p>This is an early prototype of an app for learning ASL.</p> <p>Thanks for helping us test it!</p>"
let errorInstructions = "<p>The videos below contain mistakes!</p> <p>Mistakes can be related to grammar, vocabulary, or incorrect signs.</p> <p>Click the <b>FIRST</b> gloss word that doesn't match the video.</p>"
let abcInstructions = "<p>The videos below involve the alphabet!  Click the letter being signed.</p>"

let fingerspellingInstructions = "<p>The videos below involve fingerspelling!  Click the word being spelled.</p>"
let vocabInstructions = "<p>Here are some basic vocabulary words.  Click the word being signed.</p>"
let glossInstructions = "<p>The gloss below does not match the videos! It has mistakes.</p> <p>Find the first gloss word that does not match.</p>"

let instructions = (title, text, params) => {
  return {
    text: text,
    title: title || "",
    type: "PlainTextFeedItem",
    params: params || {}

  }
}


let allLetters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J",
  "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T",
  "U", "V", "W", "X", "Y", "Z"]

let randomLettersExcept = (n, except) => {
  let filtered = allLetters.filter((letter) => letter != except)
  let random = []
  for (let i = 0; i < n; i++) {
    let index = Math.floor(Math.random() * filtered.length)
    random.push(filtered[index])
    filtered.splice(index, 1)
  }
  return random
}


let lalahep = {
  username: "lalahep",
  avatar: Clips.s3_host + "/profile-pics/laura.png"
}

let christineK = {
  username: "christineK",
  avatar: Clips.s3_host + "/profile-pics/christine.png"
}


let abcItems = allLetters.map((letter) => ({
  clip: Clips.s3_host + `/clips/Alphabet/${letter.toLowerCase()}.mp4`,
  answerOptions: [letter].concat(randomLettersExcept(3, letter)),
  arrangement: "grid",
  randomizeOptions: true,
  correctAnswer: letter,
  type: "MultipleChoiceFeedItem",
  producer: lalahep,
  prompt: "Alphabet Practice"
}))

let fingerspellingItems = [
  {
    clip: Clips.s3_host + '/clips/spelling/sp-cowboy.mp4',
    answerOptions: ["COWBOY", "COWARD", "COBRA", "CONNOR"],
    arrangement: "grid",
    randomizeOptions: true,
    correctAnswer: "COWBOY",
    type: "MultipleChoiceFeedItem",
    producer: lalahep,
    prompt: "Fingerspelling Practice"
  },
  {
    clip: Clips.s3_host + '/clips/spelling/sp-brunch.mp4',
    answerOptions: ["BRUNCH", "BRANCH", "BRAWN", "BRONCHITIS"],
    arrangement: "grid",
    randomizeOptions: true,
    correctAnswer: "BRUNCH",
    type: "MultipleChoiceFeedItem",
    producer: lalahep,
    prompt: "Fingerspelling Practice"
  },
  {
    clip: Clips.s3_host + '/clips/spelling/sp-laura.mp4',
    answerOptions: ["LAURA", "LAUNCH", "LAUNDRY", "LAUREN"],
    arrangement: "grid",
    randomizeOptions: true,
    correctAnswer: "LAURA",
    type: "MultipleChoiceFeedItem",
    producer: lalahep,
    prompt: "Fingerspelling Practice"
  },
]

let vocabItems = [
  {
    clip: Clips.s3_host + '/clips/vocab/boy.mp4',
    answerOptions: ["BOY", "GIRL", "MOM", "DAD"],
    arrangement: "grid",
    randomizeOptions: true,
    correctAnswer: "BOY",
    type: "MultipleChoiceFeedItem",
    producer: lalahep,
    prompt: "Vocab Builder"
  },
  {
    clip: Clips.s3_host + '/clips/vocab/car.mp4',
    answerOptions: ["CAR", "WASH", "PLAY", "GO"],
    arrangement: "grid",
    randomizeOptions: true,
    correctAnswer: "CAR",
    type: "MultipleChoiceFeedItem",
    producer: lalahep,
    prompt: "Vocab Builder"
  },
  {
    clip: Clips.s3_host + '/clips/vocab/play.mp4',
    answerOptions: ["PLAY", "READ", "SING", "GO"],
    arrangement: "grid",
    randomizeOptions: true,
    correctAnswer: "PLAY",
    type: "MultipleChoiceFeedItem",
    producer: lalahep,
    prompt: "Vocab Builder"
  },
]

let glossItems = [{
  clip: Clips.s3_host + '/clips/error-game/hello-your-name-what-correct.mp4',
  answerOptions: ["HELLO", "WHAT", "MY", "NAME?"], 
  arrangement: "grid",
  english: "Hello, what's your name?",
  //options: ["PO","L", "HS", "M", "NMM", "SS", "SC"],
  correctAnswer: "MY",
  type: "MultipleChoiceFeedItem",
  producer: christineK,
  prompt: "Click the word that wasn't signed"
},
{
  clip: Clips.s3_host + '/clips/error-game/i-buy-coffee-starbucks-correct.mp4',
  answerOptions: ["I", "MAKE", "COFFEE", "STARBUCKS"],
  arrangement: "grid",
  english: "I buy coffee at Starbucks",
  correctAnswer: "MAKE",
  type: "MultipleChoiceFeedItem",
  producer: christineK,
  prompt: "Click the word that wasn't signed"

},
{
  clip: Clips.s3_host + '/clips/error-game/they-will-go-ferry-correct.mp4',
  answerOptions: ["THEY", "WILL", "GO"],
  arrangement: "grid",
  english: "They will take the ferry",
  correctAnswer: "GO",
  type: "MultipleChoiceFeedItem",
  producer: christineK,
  prompt: "Click the word that wasn't signed"
},
]

let errorGameItems = [{
  clip: Clips.s3_host + '/clips/error-game/hello-your-name-what-incorrect.mp4',
  correctClip: Clips.s3_host + '/clips/error-game/hello-your-name-what-correct.mp4',
  answerOptions: ["HELLO", "YOU", "NAME", "WHAT?"],
  arrangement: "grid",
  english: "Hello, what's your name?",
  correctAnswer: "YOU",
  type: "MultipleChoiceFeedItem",
  producer: christineK,
  prompt: "Spot the Sign Mistake"
},
{
  clip: Clips.s3_host + '/clips/error-game/i-buy-coffee-starbucks-incorrect.mp4',
  correctClip: Clips.s3_host + '/clips/error-game/i-buy-coffee-starbucks-correct.mp4',
  english: "I buy coffee at Starbucks",
  answerOptions: ["I", "BUY", "COFFEE", "STARBUCKS"],
  arrangement: "grid",
  correctAnswer: "I",
  type: "MultipleChoiceFeedItem",
  producer: christineK,
  prompt: "Spot the Sign Mistake"

},
{
  clip: Clips.s3_host + '/clips/error-game/they-will-go-ferry-incorrect.mp4',
  correctClip: Clips.s3_host + '/clips/error-game/they-will-go-ferry-correct.mp4',
  english: "He will take the ferry",
  answerOptions: ["THEY", "GO", "FERRY"],
  arrangement: "grid",
  correctAnswer: "GO",
  type: "MultipleChoiceFeedItem",
  producer: christineK,
  prompt: "Spot the Sign Mistake"
},
]

export let aslItems = [
 // instructions("Welcome", welcomeInstructions, { icon: "👋" }),
  //instructions("Letter Recognition", abcInstructions, { icon: "info" }),
  ...shuffle(abcItems).slice(0, 3),
  //...abcItems.slice(0, 3),
 // instructions("Vocab", vocabInstructions, { icon: "📚" }),
  ...vocabItems,
 // instructions("Fingerspelling", fingerspellingInstructions, { icon: "🤞" }),
  ...fingerspellingItems,
 // instructions("Gloss Mistakes", glossInstructions, { icon: "info" }),
  ...glossItems,
 // instructions("Find the Error", errorInstructions, { icon: "info" }),
  ...errorGameItems,
]
