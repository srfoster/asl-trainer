import seedrandom from 'seedrandom'

export let shuffle = (array)=>{
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