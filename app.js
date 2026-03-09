window.onload=function(){

let campos=""

for(let i=2;i<=18;i++){

campos+="<label>"+i+"x (%)</label>"
campos+="<input id='mp"+i+"' type='number'>"

}

document.getElementById("camposMP").innerHTML=campos

document.getElementById("img").addEventListener("change",lerImagem)

}

function trocarTipo(){

let tipo=document.getElementById("tipo").value

if(tipo=="mp"){

document.getElementById("taxas-mp").style.display="block"
document.getElementById("taxas-outras").style.display="none"

}else{

document.getElementById("taxas-mp").style.display="none"
document.getElementById("taxas-outras").style.display="block"

}

}

async function lerImagem(e){

let arquivo=e.target.files[0]

if(!arquivo) return

let resultado=await Tesseract.recognize(arquivo,'eng')

let texto=resultado.data.text

let numeros=texto.match(/[\d]+[.,][\d]+/g)

if(!numeros) return alert("Não consegui identificar as taxas")

let parcela=2

numeros.forEach(n=>{

if(parcela<=18){

let campo=document.getElementById("mp"+parcela)

if(campo){

campo.value=n.replace(",",".")
}

parcela++

}

})

alert("Taxas preenchidas automaticamente")

}

function calcular(){

let valor=parseFloat(document.getElementById("valor").value)

let tipo=document.getElementById("tipo").value

let html=""

if(tipo=="outras"){

let pix=parseFloat(document.getElementById("pix").value)||0
let debito=parseFloat(document.getElementById("debito").value)||0
let credito1x=parseFloat(document.getElementById("credito1x").value)||0
let taxa1=parseFloat(document.getElementById("taxa1").value)||0
let taxa2=parseFloat(document.getElementById("taxa2").value)||0
let taxa3=parseFloat(document.getElementById("taxa3").value)||0

html+="<div style='background:black;color:white;padding:15px;border-radius:10px'>"

html+="<h2>Resumo</h2>"
html+="Valor simulado: R$ "+valor.toFixed(2)

html+="<table>"

html+="<tr><th>Tipo</th><th>Taxa</th><th>Valor Final</th></tr>"

html+="<tr><td>Pix</td><td>"+pix+"%</td><td>R$ "+(valor-(valor*pix/100)).toFixed(2)+"</td></tr>"

html+="<tr><td>Débito</td><td>"+debito+"%</td><td>R$ "+(valor-(valor*debito/100)).toFixed(2)+"</td></tr>"

html+="<tr><td>1x</td><td>"+credito1x+"%</td><td>R$ "+(valor-(valor*credito1x/100)).toFixed(2)+"</td></tr>"

for(let i=2;i<=21;i++){

let taxa=0

if(i<=6) taxa=taxa1
else if(i<=12) taxa=taxa2
else taxa=taxa3

html+="<tr><td>"+i+"x</td><td>"+taxa+"%</td><td>R$ "+(valor-(valor*taxa/100)).toFixed(2)+"</td></tr>"

}

html+="</table></div>"

}

if(tipo=="mp"){

let pix=parseFloat(document.getElementById("mp_pix").value)||0
let debito=parseFloat(document.getElementById("mp_debito").value)||0

html+="<div style='background:#ffe066;padding:15px;border-radius:10px'>"

html+="<h2>Resumo</h2>"
html+="Valor simulado: R$ "+valor.toFixed(2)

html+="<table>"

html+="<tr><th>Tipo</th><th>Taxa</th><th>Valor Final</th></tr>"

html+="<tr><td>Pix</td><td>"+pix+"%</td><td>R$ "+(valor-(valor*pix/100)).toFixed(2)+"</td></tr>"

html+="<tr><td>Débito</td><td>"+debito+"%</td><td>R$ "+(valor-(valor*debito/100)).toFixed(2)+"</td></tr>"

for(let i=1;i<=18;i++){

let taxa=parseFloat(document.getElementById("mp"+i).value)||0

html+="<tr><td>"+i+"x</td><td>"+taxa+"%</td><td>R$ "+(valor-(valor*taxa/100)).toFixed(2)+"</td></tr>"

}

html+="</table></div>"

}

document.getElementById("resultado").innerHTML=html

}

function compartilhar(){

let texto=document.getElementById("resultado").innerText

navigator.share({
title:"Simulação XIBUNGÃO TAXAS",
text:texto
})

}
