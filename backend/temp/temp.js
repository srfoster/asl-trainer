let seedrandom = require("seedrandom")
let Importer = require("../dao/index.js").Importer

let shuffle = (array)=>{
    let rng = seedrandom(JSON.stringify(array[0]))
    let shuffled = [...array]
    for(let i = shuffled.length - 1; i > 0; i--){
        let j = Math.floor(rng() * (i + 1))
        let temp = shuffled[i]
        shuffled[i] = shuffled[j]
        shuffled[j] = temp
    }
    return shuffled
}

let Clips = {
  s3_host: "https://asl-trainer.s3.us-west-1.amazonaws.com"
}

let welcomeInstructions = "<p>This is an early prototype of an app for learning ASL.</p> <p>Thanks for helping us test it!</p>"
let errorInstructions = "<p>The videos below contain mistakes!</p> <p>Mistakes can be related to grammar, vocabulary, or incorrect signs.</p> <p>Click the <b>FIRST</b> gloss word that doesn't match the video.</p>"
let abcInstructions = "<p>The videos below involve the alphabet!  Click the letter being signed.</p>"

let fingerspellingInstructions = "<p>The videos below involve fingerspelling!  Click the word being spelled.</p>"
let vocabInstructions = "<p>Here are some basic vocabulary words.  Click the word being signed.</p>"
let glossInstructions = "<p>The gloss below does not match the videos! It has mistakes.</p> <p>Find the first gloss word that does not match.</p>"

let instructions = (title, text, params)=>{
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

let randomLettersExcept = (n, except)=>{
    let filtered = allLetters.filter((letter)=> letter != except)
    let random = []
    for(let i = 0; i < n; i++){
        let index = Math.floor(Math.random() * filtered.length)
        random.push(filtered[index])
        filtered.splice(index, 1)
    }
    return random
}


let lalahep = {
    username: "lalahep",
    profile_pic_url: Clips.s3_host + "/profile-pics/laura.png"
}

let christineK = {
    username: "christineK",
    profile_pic_url: Clips.s3_host + "/profile-pics/christine.png"
}

let abcItems = allLetters.map((letter)=> ({
        clip: Clips.s3_host + `/clips/Alphabet/${letter.toLowerCase()}.mp4`,
        answer_options: [letter].concat(randomLettersExcept(3, letter)),  
        arrangement: "grid",
        randomize_options: true,
        correct_answer: letter,
        type: "MultipleChoiceFeedItem",
        producer: lalahep,
        prompt: "Alphabet Practice"
    }))

let fingerspellingItems = [
    {
        clip: Clips.s3_host + '/clips/spelling/sp-cowboy.mp4',
        answer_options: ["COWBOY", "COWARD", "COBRA", "CONNOR"],
        arrangement: "grid",
        randomize_options: true,
        correct_answer: "COWBOY",
        type: "MultipleChoiceFeedItem",
        producer: lalahep,
        prompt: "Fingerspelling Practice"
    },
    {
        clip: Clips.s3_host + '/clips/spelling/sp-brunch.mp4',
        answer_options: ["BRUNCH", "BRANCH", "BRAWN", "BRONCHITIS"],
        arrangement: "grid",
        randomize_options: true,
        correct_answer: "BRUNCH",
        type: "MultipleChoiceFeedItem",
        producer: lalahep,
        prompt: "Fingerspelling Practice" 
    },
    {
        clip: Clips.s3_host + '/clips/spelling/sp-laura.mp4',
        answer_options: ["LAURA", "LAUNCH", "LAUNDRY", "LAUREN"],
        arrangement: "grid",
        randomize_options: true,
        correct_answer: "LAURA",
        type: "MultipleChoiceFeedItem",
        producer: lalahep,
        prompt: "Fingerspelling Practice" 
    },
]

let vocabItems = [
    {
        clip: Clips.s3_host + '/clips/vocab/boy.mp4',
        answer_options: ["BOY", "GIRL", "MOM", "DAD"],
        arrangement: "grid",
        randomize_options: true,
        correct_answer: "BOY",
        type: "MultipleChoiceFeedItem",
        producer: lalahep,
        prompt: "Vocab Builder"  
    },
    {
        clip: Clips.s3_host + '/clips/vocab/car.mp4',
        answer_options: ["CAR", "WASH", "PLAY", "GO"],
        arrangement: "grid",
        randomize_options: true,
        correct_answer: "CAR",
        type: "MultipleChoiceFeedItem",
        producer: lalahep,
        prompt: "Vocab Builder"  
    },
    {
        clip: Clips.s3_host + '/clips/vocab/play.mp4',
        answer_options: ["PLAY", "READ", "SING", "PARTY"],
        arrangement: "grid",
        randomize_options: true,
        correct_answer: "PLAY",
        type: "MultipleChoiceFeedItem",
        producer: lalahep,
        prompt: "Vocab Builder"  
    },
]

let glossItems = [{
  clip: Clips.s3_host + '/clips/error-game/hello-your-name-what-correct.mp4',
  answer_options: ["HELLO", "WHAT", "YOUR", "NAME?"],  
  arrangement: "line",
  //english: "Hello, what's your name?",
  //options: ["PO","L", "HS", "M", "NMM", "SS", "SC"],
  correct_answer: "WHAT",
  type: "MultipleChoiceFeedItem",
  producer: christineK, 
  prompt: "Find the Gloss Mistake" 
},
{
  clip: Clips.s3_host + '/clips/error-game/i-buy-coffee-starbucks-correct.mp4',
  answer_options: ["I", "MAKE", "COFFEE", "STARBUCKS"],
  arrangement: "line",
  //english: "I buy coffee at Starbucks",
  correct_answer:  "MAKE",
  type: "MultipleChoiceFeedItem",
  producer: christineK, 
  prompt: "Find the Gloss Mistake" 

},
{
  clip: Clips.s3_host + '/clips/error-game/they-will-go-ferry-correct.mp4',
  answer_options: ["THEY", "WILL", "TAKE-CAR"],
  arrangement: "line",
  //english: "They will take the ferry",
  correct_answer: "TAKE-CAR",
  type: "MultipleChoiceFeedItem",
  producer: christineK, 
  prompt: "Find the Gloss Mistake" 
},
]

let errorGameItems = [{
    clip: Clips.s3_host + '/clips/error-game/hello-your-name-what-incorrect.mp4',
    //correctClip: Clips.s3_host + '/clips/error-game/hello-your-name-what-correct.mp4',
    answer_options: ["HELLO", "YOU", "NAME", "WHAT?"],
    arrangement: "line",
    //english: "Hello, what's your name?",
    correct_answer: "YOU",
    type: "MultipleChoiceFeedItem",
    producer: christineK,
    prompt: "Spot the Sign Mistake"
  },
  {
    clip: Clips.s3_host + '/clips/error-game/i-buy-coffee-starbucks-incorrect.mp4',
    //correctClip: Clips.s3_host + '/clips/error-game/i-buy-coffee-starbucks-correct.mp4',
    //english: "I buy coffee at Starbucks",
    answer_options: ["I", "BUY", "COFFEE", "STARBUCKS"],
    arrangement: "line",
    correct_answer: "I",
    type: "MultipleChoiceFeedItem",
    producer: christineK,
    prompt: "Spot the Sign Mistake"

  },
  {
    clip: Clips.s3_host + '/clips/error-game/they-will-go-ferry-incorrect.mp4',
    //correctClip: Clips.s3_host + '/clips/error-game/they-will-go-ferry-correct.mp4',
    //english: "He will take the ferry",
    answer_options: ["THEY", "GO", "FERRY"],
    arrangement: "line",
    correct_answer: "GO",
    type: "MultipleChoiceFeedItem",
    producer: christineK,
    prompt: "Spot the Sign Mistake"
  },
]

let allItems = [
//  instructions("Welcome", welcomeInstructions, {icon: "👋"}),
//  instructions("Letter Recognition", abcInstructions, {icon: "info"}),
  ... abcItems,
//  instructions("Vocab", vocabInstructions, {icon: "📚"}),
  ... vocabItems,
//  instructions("Fingerspelling", fingerspellingInstructions, {icon: "🤞"}),
  ... fingerspellingItems,
//  instructions("Gloss Mistakes", glossInstructions, {icon: "info"}),
  ... glossItems,
//  instructions("Find the Error", errorInstructions, {icon: "info"}),
  ... errorGameItems,
];


(async function(){
  for(let i=0;i<allItems.length;i++){
		let a = allItems[i]
    a.category = "asl"
		await Importer.importFeedItem(allItems[i])
  }
  console.log("THE END....")
})()



