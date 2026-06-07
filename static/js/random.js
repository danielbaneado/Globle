import {qualities, getRandomCountry, Game} from "./new_globle.js";
import countries from '../json/countries_dict.json' with { type: 'json' }
import flags from '../json/flags_dict.json' with { type: 'json' }

const countriesToGet = []
for (const [name] of Object.entries(countries.countries)) {
  countriesToGet.push(name.toLocaleLowerCase())
}
class RandomGame extends Game {
    constructor(guessBtn, skipBtn, hintTitle, hintContent, matchContent, hiddenTitle, messages) {
        super(guessBtn, skipBtn, hintTitle, hintContent, matchContent, hiddenTitle, messages)
    }
    getCountry() {
        return getRandomCountry()
    }
    playAgain(){
        return match()
    }
}

function match(){
    document.addEventListener("DOMContentLoaded", () => {
        const randomGame= new RandomGame(
            document.getElementById("guess-btn"),
            document.getElementById("skip-btn"),
            document.getElementById("hint-number"),
            document.getElementById("hint-content"),
            document.getElementById("match-content"),
            document.getElementById("hidden-title"),
            document.getElementById("messages"),
        )
        const countryForm= document.getElementById("country-form")
        randomGame.guessBtn.addEventListener("click", (e) => {
            e.preventDefault()
            const guess= document.getElementById("country-input").value
            const normalizedGuess= guess.toLocaleLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
            countryForm.reset()
            randomGame.attempt(guess, normalizedGuess)
        })
        
        randomGame.skipBtn.addEventListener("click", () => {
            randomGame.points-= 20
            randomGame.attempts++
            randomGame.showHints(qualities)
        })
    })
}
const newGame= document.getElementById("new-game")
newGame.addEventListener("click", () => {
    location.reload()
    match()
})
match()