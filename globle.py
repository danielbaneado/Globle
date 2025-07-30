import sys
import random
import unicodedata
from paisesl import paises
from datetime import datetime

fecha= datetime.now()

if __name__== "__main__":
    pass

def normalizar(texto):
    return "".join(c for c in unicodedata.normalize("NFD", texto.lower()) if unicodedata.category(c)!= "Mn")

print("\n¡Bienvenido a Globle!\nEste juego pone a prueba tu conocimiento en geografía, debes adivinar el país misterioso con una cantidad limitada de intentos!")

puntaje_total= 0

def nuevojuego():
    while True:
        de_nuevo= input("\n¿Jugar de nuevo? s/n: ")
        if de_nuevo.lower()== "s":
            iniciar_juego()
        elif de_nuevo.lower()== "n":
            print("\n¡Gracias por jugar!")
            sys.exit()
        else:
            print("Por favor, escribe una acción válida (s/n).")

def iniciar_juego():
    pais_misterioso= random.choice(list(paises.keys()))
    pistas= ["inicial(es)", "bandera", "continente", "vecinos", "cualidad"]
    intentos= 6
    paises_digitados= []

    while intentos > 0:
        print("\n", intentos, "intento(s) restante(s)")
        intento= input()

        if normalizar(intento) not in [normalizar(p) for p in paises.keys()] and intento!= "":
            intentos += 1
            print(intento, "no es un país! Inténtelo nuevamente")

        elif normalizar(intento) in [normalizar(p) for p in paises.keys()] and normalizar(intento)!= normalizar(pais_misterioso):
            if normalizar(intento) in paises_digitados:
                intentos += 1
                print("Ya intentaste con ese país!")
            paises_digitados.append(normalizar(intento))

        elif normalizar(intento)== normalizar(pais_misterioso):
            print("\n🎉 ¡Correcto! El país misterioso es", pais_misterioso)
            puntos_obtenidos = intentos * 20
            print("🏆 Has ganado con", puntos_obtenidos, "/ 120 puntos.")
            nuevojuego()
        
        pistas_mostradas= 7 - intentos

        if 0 < pistas_mostradas <= len(pistas):
            clave= pistas[pistas_mostradas - 1]
            valor= paises[pais_misterioso][clave]

            if clave== "vecinos":
                print("🔍 Pista", pistas_mostradas, "- Países vecinos o cercanos:")
                for v in valor:
                    print("-", v)
            else:
                print("🔍 Pista", pistas_mostradas, "-", clave.capitalize() , "→", valor)

        intentos-= 1

    print("\n❌ ¡Se acabaron los intentos! El país misterioso es:", pais_misterioso)
    nuevojuego()

iniciar_juego() 