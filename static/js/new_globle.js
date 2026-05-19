import countries from '../json/countries_dict.json' with { type: 'json' }
import flags from '../json/flags_dict.json' with { type: 'json' }
const qualities= [
    "Inicial(es)",
    "Colores de bandera",
    "Continente",
    "Vecinos",
    "Facto"
]
const countriesToGet = []
for (const [name] of Object.entries(countries.countries)) {
  countriesToGet.push(name.toLocaleLowerCase())
}

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
    constructor(guessBtn, skipBtn, hintTitle, hintContent, matchContent, hiddenTitle) {
        this.country= this.getCountry()
        this.points= 120
        this.attempts= 0
        this.guesses= []
        this.flag= []
        this.guessBtn= guessBtn
        this.skipBtn= skipBtn
        this.hintTitle= hintTitle
        this.hintContent= hintContent
        this.matchContent= matchContent
        this.hiddenTitle= hiddenTitle
    }
    showHints(qualities) {
        this.hintTitle.innerHTML= `${qualities[this.attempts - 1]}`
        this.matchContent.classList.remove("hide-content")
        this.hiddenTitle.classList.remove("hide-content")
        const mysteryCountry = countries.countries[Object.keys(countries.countries).find(c => c.toLocaleLowerCase() === this.country)]
        if(this.attempts=== 4) {
          this.hintContent.innerHTML= ""
          for(const neighbors of mysteryCountry[3]) {
            this.hintContent.innerHTML+= `${neighbors}, `
          }
        }
        else if(this.attempts >= 6) {
          this.hintContent.classList.add("hide-content")
          this.hintTitle.classList.add("hide-content")
        }
        else {
          this.hintContent.innerHTML= `${mysteryCountry[this.attempts - 1]}`
        }
        
    }
    validateAttempt(guess, normalizedGuess) {
        if (!countriesToGet.includes(normalizedGuess)) {
            alert("País inválido!")
            return
        }
        if (normalizedGuess=== this.country) {
            alert(`El país misterioso era: ${this.country}`)
            alert(`Puntos obtenidos: ${this.points}`)
        }
        else {
            this.points-= 20
            this.attempts++
            if (!this.guesses.includes(guess)) {  
                this.guesses.push(guess)
                this.flag.push(flags[normalizedGuess])
            }
            if(this.attempts < 5) {
                this.showHints(qualities)
            }
        }
    }
    attempt(guess, normalizedGuess) {
      if (countriesToGet.includes(normalizedGuess) && !this.guesses.includes(guess)) {
        this.validateAttempt(guess, normalizedGuess)
        this.matchContent.innerHTML+= `<p>${guess.toLocaleUpperCase()}  </p>`
      }
    }
}
class DailyGame extends Game {
    constructor(guessBtn, skipBtn, hintTitle, hintContent, matchContent, hiddenTitle) {
        super(guessBtn, skipBtn, hintTitle, hintContent, matchContent, hiddenTitle)
    }
    getCountry() {
        return getDailyCountry()
    }
}
class RandomGame extends Game {
    constructor(guessBtn, skipBtn, hintTitle, hintContent, matchContent, hiddenTitle) {
        super(guessBtn, skipBtn, hintTitle, hintContent, matchContent, hiddenTitle)
    }
    getCountry() {
        return getRandomCountry()
    }
}
document.addEventListener("DOMContentLoaded", () => {
  const dailyGame= new DailyGame(
    document.getElementById("guess-btn"),
    document.getElementById("skip-btn"),
    document.getElementById("hint-number"),
    document.getElementById("hint-content"),
    document.getElementById("match-content"),
    document.getElementById("hidden-title")
  );

  dailyGame.guessBtn.addEventListener("click", (e) => {
    e.preventDefault()
    const guess= document.getElementById("country-input").value
    const normalizedGuess= guess.toLocaleLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    dailyGame.attempt(guess, normalizedGuess)
  })

  dailyGame.skipBtn.addEventListener("click", () => {
    dailyGame.attempts++
    dailyGame.showHints(qualities)
  })
})