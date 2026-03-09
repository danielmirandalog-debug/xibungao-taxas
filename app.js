window.onload = function(){

let campos = ""

for(let i=1;i<=18;i++){

campos += "<label>"+i+"x (%)</label>"
campos += "<input id='mp"+i+"' type='number'>"

}

document.getElementById("camposMP").innerHTML = campos

}

function trocarTipo(){

let tipo = document.getElementById("tipo").value

if(tipo=="mp"){

document.getElementById("taxas-mp").style.display="block"
document.getElementById("taxas-outras").style.display="none"

}else{

document.getElementById("taxas-mp").style.display="none"
document.getElementById("taxas-outras").style.display="block"

}

}

function preencherTabela(){

let texto = document.getElementById("colarTabela").value

let linhas = texto.split("\n")

linhas.forEach(linha =>{

let partes = linha.split(" ")

let parcela = partes[0]
let taxa = partes[1]

if(parcela && taxa){

let numero = parcela.replace("x","")

let campo = document.getElementById("mp"+numero)

if(campo){

campo.value = taxa

}

}

})

}

function calcular(){

let valor = parseFloat(document.getElementById("valor").value)

let tipo = document.getElementById("tipo").value

let html=""

if(tipo=="outras"){

let pix = parseFloat(document.getElementById("pix").value)||0
let debito = parseFloat(document.getElementById("debito").value)||0
let mdr = parseFloat(document.getElementById("mdr").value)||0
let taxa1 = parseFloat(document.getElementById("taxa1").value)||0
let taxa2 = parseFloat(document.getElementById("taxa2").value)||0
let taxa3 = parseFloat(document.getElementById("taxa3").value)||0

html += "<h2>Resumo</h2>"
html += "Valor simulado: R$ "+valor.toFixed(2)

html += "<table border='1'>"

html += "<tr><td>Pix</td><td>"+pix+"%</td></tr>"
html += "<tr><td>Débito</td><td>"+debito+"%</td></tr>"

for(let i=1;i<=21;i++){

let taxa=mdr

if(i>=2 && i<=6) taxa += taxa1
if(i>=7 && i<=12) taxa += taxa2
if(i>=13) taxa += taxa3

html+="<tr><td>"+i+"x</td><td>"+taxa.toFixed(2)+"%</td></tr>"

}

html+="</table>"

}

if(tipo=="mp"){

let pix = parseFloat(document.getElementById("mp_pix").value)||0
let debito = parseFloat(document.getElementById("mp_debito").value)||0

html += "<h2>Resumo</h2>"
html += "Valor simulado: R$ "+valor.toFixed(2)

html+="<table border='1'>"

html+="<tr><td>Pix</td><td>"+pix+"%</td></tr>"
html+="<tr><td>Débito</td><td>"+debito+"%</td></tr>"

for(let i=1;i<=18;i++){

let taxa = document.getElementById("mp"+i).value||0

html+="<tr><td>"+i+"x</td><td>"+taxa+"%</td></tr>"

}

html+="</table>"

}

document.getElementById("resultado").innerHTML = html

}

function compartilhar(){

let texto = document.getElementById("resultado").innerText

navigator.share({

title:"Simulação XIBUNGÃO TAXAS",
text:texto

})

}
