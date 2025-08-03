from flask import Flask, render_template, request
from werkzeug.utils import redirect
import globle

app= Flask(__name__)

@app.route("/")
def new_globle():
    return render_template("index.html")

@app.route("/diario")
def diario():
    return render_template("juego.html")

@app.route("/procesar", methods= ["POST"])
def procesar():
    pais= None
    pais= request.form['pais']
    print(pais)
    return render_template("juego.html")

@app.route("/infinito")
def infinito():
    return render_template("juego.html")