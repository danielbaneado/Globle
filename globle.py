import random
import sys
import unicodedata
from datetime import datetime
from dict_paises import paises

def normalizar(texto):
    return "".join(c for c in unicodedata.normalize("NFD", texto.lower()) if unicodedata.category(c)!= "Mn")

class SistemaGloble:
    def __init__(self):
        self.pistas= ["inicial(es)", "bandera", "continente", "vecinos", "cualidad"]
        self.intentos= 6
        self.paises_digitados= []
        self.pais_misterioso= ""

    def mostrar_pista(self, pistas_mostradas):
        if 0 < pistas_mostradas <= len(self.pistas):
            clave= self.pistas[pistas_mostradas - 1]
            valor= paises[self.pais_misterioso][clave]
            if clave== "vecinos":
                print(f"🔍 Pista {pistas_mostradas} - Países vecinos o cercanos:")
                for v in valor:
                    print("-", v)
            else:
                print(f"🔍Pista {pistas_mostradas} - {clave.capitalize()} → {valor}")

    def validar_intento(self, intento):
        normal= normalizar(intento)
        pais_normal= normalizar(self.pais_misterioso)
        if normal not in [normalizar(p) for p in paises.keys()] and intento!= "":
            print(intento, "no es un país! Inténtelo nuevamente")
            return False

        elif normal in [normalizar(p) for p in paises.keys()] and normal!= pais_normal:
            if normal in self.paises_digitados:
                print("Ya intentaste con ese país!")
                return False
        self.paises_digitados.append(normal)
        return True

    def ganar(self, intento):
        return normalizar(intento)== normalizar(self.pais_misterioso)

class GlobleDiario(SistemaGloble):
    def __init__(self):
        super().__init__()
        self.fecha_actual= datetime.now().date()
        self.pais_misterioso= self.elegir_pais_diario()

    def elegir_pais_diario(self):
        random.seed(self.fecha_actual.toordinal())
        return random.choice(list(paises.keys()))

    def jugar(self):
        print("\n🌍 Globle Diario 🌍\nAdivina el país misterioso de hoy.\n")
        vintentos= self.intentos
        vpistas= 7 - vintentos

        while vintentos > 0:
            print(f"\nIntento {self.intentos - vintentos + 1}/{self.intentos}")
            intento = input("Tu intento: ").strip()

            if self.ganar(intento):
                print(f"\n🎉 ¡Correcto! El país misterioso es: {self.pais_misterioso}")
                print(f"🏆 Puntos: {vintentos * 20} / 120 puntos")
                return

            if not self.validar_intento(intento):
                continue

            self.mostrar_pista(vpistas)
            vpistas+= 1
            vintentos-= 1

        print(f"\n❌ Te quedaste sin intentos. El país misterioso es: {self.pais_misterioso}")

class GlobleInfinito(SistemaGloble):
    def jugar(self):
        print("\n🌍 Globle Infinito 🌍\nPractica con el mapa interactivo sin ver pistas!\n")

        while True:
            self.__init__()
            self.pais_misterioso= random.choice(list(paises.keys()))
            vintentos= self.intentos

            while vintentos > 0:
                print(f"\nIntento {self.intentos - vintentos + 1}/{self.intentos}")
                intento= input("Tu intento: ").strip()

                if self.ganar(intento):
                    print(f"\n🎉 ¡Correcto! El país misterioso era: {self.pais_misterioso}")
                    print(f"🏆 Puntos: {vintentos * 20} / 120 puntos")
                    break

                if not self.validar_intento(intento):
                    continue

                vintentos-= 1

            print("\nJugar de nuevo?")
            if input("s/n: ").strip().lower() != "s":
                print("\n¡Gracias por jugar!")
                sys.exit()

def modo(modo_escogido):
    modo_escogido.jugar()

if __name__ == "__main__":
    print("¡Bienvenido a Globle!"
          "\nEste juego pone a prueba tu conocimiento en geografía, debes adivinar el país misterioso con una cantidad limitada de intentos!"
          "\n\nModo diario | Modo práctica")

    eleccion = input("\nTu opción (1 o 2): ")

    if eleccion == "1":
        modo(GlobleDiario())
    elif eleccion == "2":
        modo(GlobleInfinito())
    else:
        print("Opción inválida.")
