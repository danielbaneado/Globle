import random
import json
from pathlib import Path
op= True
attempts= 0
qualities= ("Initial(s)", "Flag colors", "Continent", "Neighbors", "Fact")
guessed_countries=[]

data_file= Path("countries_dict.json")
with data_file.open(encoding="utf-8") as f:
    data= json.load(f)
    countries= data["countries"]
    flags_emojis= data["flags_emojis"]

mystery_country= random.choice(list(countries.keys()))

def match(f_mystery_country, f_attempts, f_guess):
    if f_guess== f_mystery_country:
        print("You guessed!")
        exit()
    print("Attempt", f_attempts, "\nGuessed countries")
    for guesses in guessed_countries:
        print("-", guesses, flags_emojis[guesses])
    mys_cou= countries[mystery_country]
    if attempts== 4:
        print(qualities[attempts - 1], "⬇️")
        for neighbors in mys_cou[3]:
            print(neighbors)
    else:
        print(qualities[attempts - 1], "➡️", mys_cou[attempts - 1])
    
while True:
    try:
        guess= input("Enter country name\n ➡️  ").capitalize()
        if guess in countries.keys():
            attempts+= 1
            guessed_countries.append(guess)
            match(mystery_country, attempts, guess)
        else:
            raise ValueError
    except ValueError:
        print("Invalid guess!")
