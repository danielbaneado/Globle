import sys
import random
countrieshdi= {"Afghanistan": 0.486, "Andorra": 0.913, "Bahrain": 0.899, "Central African Republic": 0.414, "Chad": 0.416, "Denmark": 0.962, 
               "Finland": 0.948, "Ireland": 0.949, "Mali": 0.419, "Niger": 0.419, "Somalia": 0.404, "South Sudan": 0.388, "Yemen": 0.470}

def showhighers(f):
    print("\nCountries with hdi higher than 0.5\n")
    for k, v in f.items():
        if v > 0.5:
            print(k, "-", v)

def showlowers(f):
    print("\nCountries with hdi lower than 0.5\n")
    for k, v in f.items():
        if v < 0.5:
            print(k, "-", v)

def ran(f):
    country= random.choice(list(f.keys()))
    print(country)

print("A few countries hdi index comparison")
while True:
    pick= input("\nShow highers, lowers or random?: ")

    if pick == "h":
        showhighers(countrieshdi)
    elif pick== "l":
        showlowers(countrieshdi)
    elif pick== "r":
        ran(countrieshdi)
    elif pick== "e":
        sys.exit()

