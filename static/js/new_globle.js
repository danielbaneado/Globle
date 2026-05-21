import countries from '../json/countries_dict.json' with { type: 'json' }
import flags from '../json/flags_dict.json' with { type: 'json' }
const qualities= [
    "Initial(s)",
    "Flag colors",
    "Continent",
    "Neighbors",
    "Fact"
]
const countriesToGet = []
for (const [name] of Object.entries(countries.countries)) {
  countriesToGet.push(name.toLocaleLowerCase())
}
const mode= "daily"

function getDailyCountry() {
  const today= new Date()
  const days= Math.floor(today.getTime() / (1000 * 60 * 60 * 24))
  const index= days % countriesToGet.length
  const dailyCountry= countriesToGet[index]
  return dailyCountry
}
function getRandomCountry() {
  const index= Math.floor(Math.random() * countriesToGet.length)
  const randomCountry= countriesToGet[index]
  return randomCountry
}

class Game {
    constructor(guessBtn, skipBtn, hintTitle, hintContent, matchContent, hiddenTitle, messages) {
        this.country= this.getCountry()
        this.points= 120
        this.attempts= 0
        this.guesses= []
        this.guessBtn= guessBtn
        this.skipBtn= skipBtn
        this.hintTitle= hintTitle
        this.hintContent= hintContent
        this.matchContent= matchContent
        this.hiddenTitle= hiddenTitle
        this.messages= messages
    }
    showHints(qualities, guess) {
        this.hintTitle.innerHTML= `${qualities[this.attempts - 1]}`
        this.matchContent.classList.remove("hide-content")
        this.hiddenTitle.classList.remove("hide-content")
        const mysteryCountry= countries.countries[Object.keys(countries.countries).find(c => c.toLocaleLowerCase() === this.country)]
        if(this.attempts=== 4) {
          this.hintContent.innerHTML= ""
          for (const [country, flag] of Object.entries(flags)) {
            for(const neighbors of mysteryCountry[3]) {
              if (country.toLocaleLowerCase() === neighbors.toLocaleLowerCase()) {
                this.hintContent.innerHTML+= `${flag} ${neighbors} `
              }
            }
          }
        }
        else if(this.attempts === 6) {
          this.hintContent.classList.add("hide-content")
          this.hintTitle.classList.add("hide-content")
          this.guessBtn.classList.add("finished-match")
          this.skipBtn.classList.add("finished-match")
          this.messages.classList.add("error-message")
          this.guessBtn.disabled= true
          this.skipBtn.disabled= true
          this.messages.innerHTML= `Not guessed :( The mystery country is ${this.country}`
        }
        else {
          this.hintContent.innerHTML= `${mysteryCountry[this.attempts - 1]}`
        }
    }
    validateAttempt(guess, normalizedGuess, capitalizedCountry) {
        if (normalizedGuess=== this.country) {
            this.messages.classList.remove("error-message")
            this.messages.classList.add("victory")
            this.hintContent.classList.add("hide-content")
            this.hintTitle.classList.add("hide-content")
            this.guessBtn.classList.add("finished-match")
            this.skipBtn.classList.add("finished-match")
            this.messages.innerHTML= `The mystery country is ${this.country}!`
            this.messages.innerHTML+= `<p>Points: ${this.points}</p>`
            this.guessBtn.disabled= true
            this.skipBtn.disabled= true
        }
        else {
          this.points-= 20
          this.attempts++
          if (!this.guesses.includes(guess)) {  
            this.guesses.push(guess)
          }
          if (this.attempts <= 6) {
            this.showHints(qualities, guess)
          }
        }
    }
    attempt(guess, normalizedGuess) {
      if (guess=== "" || !countriesToGet.includes(normalizedGuess)) {
        this.messages.classList.add("error-message")
        this.messages.innerHTML= "Type a valid country!"
      }
      else if (countriesToGet.includes(normalizedGuess) && !this.guesses.includes(guess)) {
        this.messages.innerHTML= ""
        this.validateAttempt(guess, normalizedGuess)
        for (const [country, flag] of Object.entries(flags)) {
          if (country.toLocaleLowerCase() === guess.toLocaleLowerCase()) {
            this.matchContent.innerHTML+= `<p>${flag} ${country}</p>`
          }
        }
      }
    }
}
class DailyGame extends Game {
    constructor(guessBtn, skipBtn, hintTitle, hintContent, matchContent, hiddenTitle, messages) {
        super(guessBtn, skipBtn, hintTitle, hintContent, matchContent, hiddenTitle, messages)
    }
    getCountry() {
        return getDailyCountry()
    }
}
class RandomGame extends Game {
    constructor(guessBtn, skipBtn, hintTitle, hintContent, matchContent, hiddenTitle, messages) {
        super(guessBtn, skipBtn, hintTitle, hintContent, matchContent, hiddenTitle, messages)
    }
    getCountry() {
        return getRandomCountry()
    }
}
if(mode === "daily") {
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
  const countryForm= document.getElementById("country-form")
  dailyGame.guessBtn.addEventListener("click", (e) => {
    e.preventDefault()
    const guess= document.getElementById("country-input").value
    const normalizedGuess= guess.toLocaleLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    countryForm.reset()
    dailyGame.attempt(guess, normalizedGuess)
  })

  dailyGame.skipBtn.addEventListener("click", () => {
    dailyGame.attempts++
    dailyGame.showHints(qualities)
  })
})
}
else {
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
    randomGame.attempts++
    randomGame.showHints(qualities)
  })
})
}