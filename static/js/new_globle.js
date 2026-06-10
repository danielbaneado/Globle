import countries from '../json/countries_dict.json' with { type: 'json' }
import flags from '../json/flags_dict.json' with { type: 'json' }
export const qualities= [
    "Initial(s)",
    "Flag colors",
    "Continent",
    "Neighbors",
    "Fact"
]
const loweredCountries= []
const capitalizedCountries= []
for (const [name] of Object.entries(countries.countries)) {
  loweredCountries.push(name.toLocaleLowerCase())
  capitalizedCountries.push(name)
}

export function getDailyCountry() {
  const today= new Date()
  const days= Math.floor(today.getTime() / (1000 * 60 * 60 * 24))
  const index= days % capitalizedCountries.length
  const dailyCountry= capitalizedCountries[index]
  return dailyCountry
}
export function getRandomCountry() {
  const index= Math.floor(Math.random() * capitalizedCountries.length)
  const randomCountry= capitalizedCountries[index]
  return randomCountry
}

export class Game {
    constructor(guessBtn, skipBtn, hintTitle, hintContent, matchContent, hiddenTitle, messages, guesses, match) {
        this.country= String(this.getCountry())
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
        this.match= {}
    }
    showHints(qualities, guess) {
        this.validateHints()
    }
    validateAttempt(guess, normalizedGuess) {
        if (normalizedGuess=== this.country.toLocaleLowerCase()) {
          this.winnedMatch()
          this.guesses.push(guess)
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
        this.match= {
          guesses: this.guesses,
          date: new Date().toLocaleString().slice(0, 8),
          attempts: this.attempts,
          points: this.points
        }
        this.saveMatch(this.match)
    }
    attempt(guess, normalizedGuess) {
      if (guess=== "" || !loweredCountries.includes(normalizedGuess)) {
        this.messages.classList.add("error-message")
        this.messages.innerHTML= "Type a valid country!"
      }
      else if (loweredCountries.includes(normalizedGuess) && !this.guesses.includes(guess)) {
        this.messages.innerHTML= ""
        this.validateAttempt(guess, normalizedGuess)
        for (const [country, flag] of Object.entries(flags)) {
          if (country.toLocaleLowerCase() === guess) {
            this.matchContent.innerHTML+= `<p>${flag} ${country}</p>`
          }
        }
      }
      else if(loweredCountries.includes(normalizedGuess) && this.guesses.includes(guess)) {
        this.messages.classList.remove("error-message")
        this.messages.textContent= "Country already guessed!"
      }
    }
    validateHints(){
      this.hintTitle.innerHTML= `${qualities[this.attempts - 1]}`
      this.matchContent.classList.remove("hide-content")
      this.hiddenTitle.classList.remove("hide-content")
      const mysteryCountry= countries.countries[Object.keys(countries.countries).find(c => c.toLocaleLowerCase() === this.country.toLocaleLowerCase())]
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
        this.losedMatch()
      }
      else {
        this.hintContent.innerHTML= `${mysteryCountry[this.attempts - 1]}`
      }
    }
    renderGuesses(){
      if(this.guesses.length!= 0 || this.attempts > 0){
        this.messages.textContent= ""
        this.hiddenTitle.classList.remove("hide-content")
        this.hintTitle.classList.remove("hide-content")
        this.matchContent.classList.remove("hide-content")
        for(const guess of this.guesses){
          for (const [country, flag] of Object.entries(flags)) {
            if (country.toLocaleLowerCase() === guess) {
              this.matchContent.innerHTML+= `<p>${flag} ${country}</p>`
            }
          }
        }
        if(this.guesses.includes(this.country.toLocaleLowerCase())){
          this.winnedMatch()
        }
        else if (this.attempts >= 6){
          this.losedMatch()
        }
        else{
          this.validateHints()
        }
      }
    }
    getMatch(){
      let match= JSON.parse(localStorage.getItem(this.storageKey)) || {}
      this.guesses= match.guesses || []
      this.attempts= match.attempts || 0
      this.points= match.points || 120
    }
    saveMatch(match){
      localStorage.setItem(this.storageKey, JSON.stringify(match)) 
    }
    winnedMatch(){
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
    losedMatch(){
      this.hintContent.classList.add("hide-content")
      this.hintTitle.classList.add("hide-content")
      this.guessBtn.classList.add("finished-match")
      this.skipBtn.classList.add("finished-match")
      this.messages.classList.add("error-message")
      this.guessBtn.disabled= true
      this.skipBtn.disabled= true
      this.messages.innerHTML= `Not guessed :( The mystery country is ${this.country}`
    }
}
