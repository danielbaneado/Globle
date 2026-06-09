import {qualities, getDailyCountry, Game} from "./new_globle.js";
import countries from '../json/countries_dict.json' with { type: 'json' }
import flags from '../json/flags_dict.json' with { type: 'json' }

const countriesToGet = []
for (const [name] of Object.entries(countries.countries)) {
  countriesToGet.push(name.toLocaleLowerCase())
}
class DailyGame extends Game {
    constructor(guessBtn, skipBtn, hintTitle, hintContent, matchContent, hiddenTitle, messages) {
        super(guessBtn, skipBtn, hintTitle, hintContent, matchContent, hiddenTitle, messages)
    }
    getCountry() {
      return getDailyCountry()
    }
}

document.addEventListener("DOMContentLoaded", () => {
  const dailyGame= new DailyGame(
    document.getElementById("guess-btn"),
    document.getElementById("skip-btn"),
    document.getElementById("hint-number"),
    document.getElementById("hint-content"),
    document.getElementById("match-content"),
    document.getElementById("hidden-title"),
    document.getElementById("messages")
  )
  dailyGame.getMatch()
  dailyGame.renderGuesses()
  const countryForm= document.getElementById("country-form")
  dailyGame.guessBtn.addEventListener("click", (e) => {
    e.preventDefault()
    const guess= document.getElementById("country-input").value.toLocaleLowerCase()
    const normalizedGuess= guess.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    countryForm.reset()
    dailyGame.attempt(guess, normalizedGuess)
  })

  dailyGame.skipBtn.addEventListener("click", (e) => {
    e.preventDefault()
    dailyGame.points-= 20
    dailyGame.attempts++
    let match= {
      guesses: dailyGame.guesses,
      date: new Date().toLocaleString().slice(0, 8),
      attempts: dailyGame.attempts,
      points: dailyGame.points
    }
    dailyGame.showHints(qualities)
    dailyGame.saveMatch(match)
  })
})