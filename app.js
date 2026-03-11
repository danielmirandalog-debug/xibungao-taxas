let mp={}
let outras={}

window.onload=function(){

let html=""

for(let i=2;i<=21;i++){

html+=`<label>${i}x (%)</label> <input id="mp${i}">`

}

document.getElementById("mpParcelas").innerHTML=html

}

function liquido(valor,taxa){

if(!taxa && taxa!==0) return null

return valor*(1-(taxa/100))

}

function simular(){

let valor=parseFloat(document.getElementById("valor").value)

mp["pix"]=parseFloat(document.getElementById("mp_pix").value)
mp["debito"]=parseFloat(document.getElementById("mp_debito").value)
mp[1]=parseFloat(document.getElementById("mp1").value)

for(let i=2;i<=21;i++){

mp[i]=parseFloat(document.getElementById("mp"+i).value)

}

outras["pix"]=parseFloat(document.getElementById("out_pix").value)
outras["debito"]=parseFloat(document.getElementById("out_debito").value)
outras[1]=parseFloat(document.getElementById("out1").value)

let mdr1=parseFloat(document.getElementById("mdr1").value)
let mdr2=parseFloat(document.getElementById("mdr2").value)
let mdr3=parseFloat(document.getElementById("mdr3").value)

let ant=parseFloat(document.getElementById("antecipacao").value)

for(let i=2;i<=6;i++){

outras[i]=mdr1+(ant*(i-1))

}

for(let i=7;i<=12;i++){

outras[i]=mdr2+(ant*(i-1))

}

for(let i=13;i<=21;i++){

outras[i]=mdr3+(ant*(i-1))

}

gerarTabela(valor)

}

function gerarTabela(valor){

let parcelas=["pix","debito",1]

for(let i=2;i<=21;i++) parcelas.push(i)

let html=`<table>

<tr>
<th>Parcela</th>
<th>Taxa MP</th>
<th>R$ Mercado Pago</th>
<th>Taxa Outros</th>
<th>R$ Outros</th>
</tr>`

parcelas.forEach(p=>{

let nome=p==="pix"?"Pix":p==="debito"?"Débito":p+"x"

let taxaMP=mp[p]
let taxaOut=outras[p]

let valorMP=liquido(valor,taxaMP)
let valorOut=liquido(valor,taxaOut)

let classe=""

if(valorOut>valorMP) classe="taxaRuim"

html+=`<tr>

<td>${nome}</td>
<td>${taxaMP??"Não se aplica"}%</td>
<td>${valorMP? "R$ "+valorMP.toFixed(2):"Não se aplica"}</td>
<td class="${classe}">${taxaOut??"Não se aplica"}%</td>
<td class="${classe}">${valorOut? "R$ "+valorOut.toFixed(2):"Não se aplica"}</td>
</tr>`

})

html+="</table>"

document.getElementById("resultado").innerHTML=html

document.getElementById("perguntaFaturamento").style.display="block"

}

function agradecer(){

document.getElementById("balao").innerHTML=
`<div class="balao">Obrigado por usar a Calculadora Falcões BA21 🦅</div>`

}

function abrirFaturamento(){

document.getElementById("simulacaoFaturamento").style.display="block"

}

function calcularFaturamento(){

let faturamento=parseFloat(document.getElementById("faturamentoMensal").value)

let sharePix=document.getElementById("share_pix").value/100
let shareDeb=document.getElementById("share_debito").value/100
let share1=document.getElementById("share_1x").value/100
let share26=document.getElementById("share_2_6").value/100
let share712=document.getElementById("share_7_12").value/100

let mpTotal=0
let outTotal=0

mpTotal+=faturamento*sharePix*(1-(mp["pix"]/100))
mpTotal+=faturamento*shareDeb*(1-(mp["debito"]/100))
mpTotal+=faturamento*share1*(1-(mp[1]/100))
mpTotal+=faturamento*share26*(1-(mp[4]/100))
mpTotal+=faturamento*share712*(1-(mp[10]/100))

outTotal+=faturamento*sharePix*(1-(outras["pix"]/100))
outTotal+=faturamento*shareDeb*(1-(outras["debito"]/100))
outTotal+=faturamento*share1*(1-(outras[1]/100))
outTotal+=faturamento*share26*(1-(outras[4]/100))
outTotal+=faturamento*share712*(1-(outras[10]/100))

let economia=(outTotal-mpTotal)*12

document.getElementById("resultadoFaturamento").innerHTML=

`<h3>Economia anual estimada</h3>

Mercado Pago anual: R$ ${(mpTotal*12).toFixed(2)}<br>
Outros anual: R$ ${(outTotal*12).toFixed(2)}

<br><br>

<b>Economia anual: R$ ${economia.toFixed(2)}</b>
`

criarGrafico(mpTotal,outTotal)

}

function criarGrafico(mp,out){

new Chart(document.getElementById("grafico"),{

type:"bar",

data:{

labels:["Mercado Pago","Outros"],

datasets:[{

label:"Resultado anual",

data:[mp*12,out*12]

}]

}

})

}

function exportar(){

html2canvas(document.body).then(canvas=>{

let link=document.createElement("a")

link.download="simulacao.png"

link.href=canvas.toDataURL()

link.click()

})

}
