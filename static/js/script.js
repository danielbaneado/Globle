import countries from '../json/countries_dict.json' with { type: 'json' };
import flags from '../json/flags_dict.json' with { type: 'json' };
const qualities= [
    "Iniciales",
    "Colores de bandera",
    "Continente",
    "Vecinos",
    "Dato"
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
    constructor(guessBtn, skipBtn, hintTitle, hintContent, matchContent) {
        this.country= this.getCountry()
        this.points= 120
        this.attempts= 0
        this.guesses= []
        this.guessBtn= guessBtn
        this.skipBtn= skipBtn
        this.hintTitle= hintTitle
        this.hintContent= hintContent
        this.matchContent= matchContent
    }
    showHints(qualities) {
        this.hintTitle.innerHTML= `${qualities[this.attempts - 1]}`
        const mysteryCountry = countries.countries[Object.keys(countries.countries).find(c => c.toLocaleLowerCase() === this.country)]
        if(this.attempts=== 4) {
          for(const neighbors of mysteryCountry[4]) {
            this.hintContent.innerHTML+= `${neighbors}, `
          }
        }
        else {
          this.hintContent.innerHTML= `${qualities[this.attempts - 1]}: ${mysteryCountry[this.attempts - 1]}`
        }
    }
    validateAttempt(guess, normalizedGuess) {
        if (!countriesToGet.includes(normalizedGuess)) {
            alert("El país ingresado no es válido. Por favor, intenta con otro.")
            return
        }
        if (normalizedGuess=== this.country) {
            alert("¡Correcto! Has ganado.")
            this.points+= 20
            alert(`Puntos obtenidos: ${this.points}`)
        }
        else {
            this.points-= 20
            this.attempts++
            this.guesses.push(guess)
            if(this.attempts < 5) {
                this.showHints(qualities)
            }
            else {
                alert(`No adivinaste :( El país era: ${this.country}`)
            }
        }
    }
    attempt(guess, normalizedGuess) {
      if (countriesToGet.includes(normalizedGuess) && !this.guesses.includes(guess)) {
        this.validateAttempt(guess, normalizedGuess)
      }
      else {
        this.matchContent.innerHTML+= `<p>${guess}</p>`
        }
    }
}
class DailyGame extends Game {
    constructor(guessBtn, skipBtn, hintTitle, hintContent, matchContent) {
        super(guessBtn, skipBtn, hintTitle, hintContent, matchContent)
    }
    getCountry() {
        return getDailyCountry()
    }
}
class RandomGame extends Game {
    constructor(guessBtn, skipBtn, hintTitle, hintContent, matchContent) {
        super(guessBtn, skipBtn, hintTitle, hintContent, matchContent)
    }
    getCountry() {
        return getRandomCountry()
    }
}
document.addEventListener("DOMContentLoaded", () => {
  const dailyGame = new DailyGame(
    document.getElementById("guess-btn"),
    document.getElementById("skip-btn"),
    document.getElementById("hint-number"),
    document.getElementById("hint-content"),
    document.getElementById("match-content")
  );

  dailyGame.guessBtn.addEventListener("click", (e) => {
    e.preventDefault()
    const guess= document.getElementById("country-input").value
    const normalizedGuess= guess.toLocaleLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    dailyGame.attempt(guess, normalizedGuess)
  });

  dailyGame.skipBtn.addEventListener("click", () => {
    dailyGame.attempts++
    dailyGame.showHints(qualities)
  });
});