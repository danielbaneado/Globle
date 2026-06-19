import {qualities, getRandomCountry, Game} from "./new_globle.js";
import countries from '../json/countries_dict.json' with { type: 'json' }
import flags from '../json/flags_dict.json' with { type: 'json' }

const countriesToGet = []
for (const [name] of Object.entries(countries.countries)) {
  countriesToGet.push(name.toLocaleLowerCase())
}
class RandomGame extends Game {
    constructor(guessBtn, skipBtn, hintTitle, hintContent, matchContent, hiddenTitle, messages, storageKey) {
        super(guessBtn, skipBtn, hintTitle, hintContent, matchContent, hiddenTitle, messages)
        this.storageKey= "practiceMode"
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
            const guess= document.getElementById("country-input").value.toLocaleLowerCase()
            const normalizedGuess= guess.normalize("NFD").replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ ]/g, "").replace(/\s+/g, " ").trim()
            countryForm.reset()
            randomGame.attempt(guess, normalizedGuess)
        })
        
        randomGame.skipBtn.addEventListener("click", (e) => {
            e.preventDefault()
            randomGame.points-= 20
            randomGame.attempts++
            randomGame.showHints(qualities)
        })
        const newGame= document.getElementById("new-game")
        newGame.addEventListener("click", () => {
            localStorage.removeItem(randomGame.storageKey)
            location.reload()
            match()
        })
    })
}
match()