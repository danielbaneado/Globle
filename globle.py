import random
import json
from datetime import datetime as dt

try:
    with open("countries_dict.json", encoding= "utf-8") as file:
        data= json.load(file)
        countries= data["countries"]
        flags_emojis= data["flags_emojis"]
except FileNotFoundError:
    print("File not found!")
    exit()

op= True
points= 120
attempts= 0
qualities= ("Initial(s)", "Flag colors", "Continent", "Neighbors", "Fact")
guessed_countries= []
infinite_country= random.choice(list(countries.keys()))
date= dt.now().date()
daily_country= random.seed(date.toordinal())

def attempt(mystery_country, attempts, guess, guessed_countries, points):
    if guess== mystery_country:
        points+= 20
        print(f"The mystery country is {mystery_country}!\n Score ➡️  {points}/120")
        exit()
        
    print("Attempt", attempts, "\nGuessed countries")
    
    for guesses in guessed_countries:
        print("-", guesses, flags_emojis[guesses])

    mys_cou= countries[mystery_country]

    if attempts== 4:
        print(qualities[attempts - 1], "⬇️")
        for neighbors in mys_cou[3]:
            print("-", neighbors)
    else:
        print(qualities[attempts - 1], "➡️ ", mys_cou[attempts - 1])
    
while op!= 4:
    try:
        op= int(input("New Globle\n 1) Daily mode\n 2) Infinite mode\n 3) Geogrid\n 4) Exit\n >> "))
        if op not in range(1, 5):
            raise ValueError
    except:
        print("Invalid option!")
        continue
    if op== 1:
        while attempts!= 5:
            try:
                guess= input("Enter country name\n ➡️  ").capitalize()
                if guess in countries.keys() and guess not in guessed_countries:
                    points-= 20
                    attempts+= 1
                    guessed_countries.append(guess)
                    attempt(infinite_country, attempts, guess, guessed_countries, points)
                else:
                    raise ValueError
            except ValueError:
                print("Invalid guess/Country already guessed!")
    elif op== 2:
        pass
    elif op== 3:
        pass
    elif op== 4:
        print("Bye bye")
