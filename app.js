let mp={}
let outras={}

window.onload=function(){

let html=""

for(let i=2;i<=21;i++){

html+=`<label>${i}x (%)</label> <input id="mp${i}">`

}

document.getElementById("mpParcelas").innerHTML=html

document.getElementById("uploadOCR").addEventListener("change",processarOCR)

}

async function processarOCR(e){

let arquivo=e.target.files[0]

if(!arquivo) return

document.getElementById("statusOCR").innerHTML="Lendo imagem..."

const worker=await Tesseract.createWorker("por")

const { data:{ text } } = await worker.recognize(arquivo)

await worker.terminate()

document.getElementById("statusOCR").innerHTML="Imagem processada"

let numeros=text.match(/\d+[.,]?\d*/g)

if(!numeros) return

numeros=numereros=numeros.map(n=>parseFloat(n.replace(",",".")))

let campos=["mp_pix","mp_debito","mp1"]

for(let i=2;i<=21;i++){

campos.push("mp"+i)

}

for(let i=0;i<numeros.length && i<campos.length;i++){

let campo=document.getElementById(campos[i])

if(campo){

campo.value=numeros[i]

}

}

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
<th>Liquido MP</th>
<th>Taxa Outros</th>
<th>Liquido Outros</th>
</tr>`

parcelas.forEach(p=>{

let nome=p==="pix"?"Pix":p==="debito"?"Débito":p+"x"

let taxaMP=mp[p]
let taxaOut=outras[p]

let valorMP=liquido(valor,taxaMP)
let valorOut=liquido(valor,taxaOut)

html+=`<tr>

<td>${nome}</td>

<td>${taxaMP ?? "Não se aplica"}%</td>

<td>${valorMP? "R$ "+valorMP.toFixed(2):"Não se aplica"}</td>

<td>${taxaOut ?? "Não se aplica"}%</td>

<td>${valorOut? "R$ "+valorOut.toFixed(2):"Não se aplica"}</td>

</tr>`

})

html+="</table>"

document.getElementById("resultado").innerHTML=html

document.getElementById("perguntaFaturamento").style.display="block"

}

function verificarShares(){

let pix=parseFloat(document.getElementById("share_pix").value)||0
let deb=parseFloat(document.getElementById("share_debito").value)||0
let c1=parseFloat(document.getElementById("share_1x").value)||0
let c26=parseFloat(document.getElementById("share_2_6").value)||0
let c712=parseFloat(document.getElementById("share_7_12").value)||0

let total=pix+deb+c1+c26+c712

document.getElementById("totalShare").innerHTML="Total: "+total+"%"

if(total!=100){

document.getElementById("erroShare").innerHTML="⚠ O total deve ser 100%"

}else{

document.getElementById("erroShare").innerHTML=""

}

}

function abrirFaturamento(){

document.getElementById("simulacaoFaturamento").style.display="block"

}

function agradecer(){

document.getElementById("balao").innerHTML=
`<div class="balao">Obrigado por usar o comparador Falcões BA21 🦅</div>`

}

function calcularFaturamento(){

let total =
(parseFloat(document.getElementById("share_pix").value)||0)+
(parseFloat(document.getElementById("share_debito").value)||0)+
(parseFloat(document.getElementById("share_1x").value)||0)+
(parseFloat(document.getElementById("share_2_6").value)||0)+
(parseFloat(document.getElementById("share_7_12").value)||0)

if(total!=100){

alert("A distribuição precisa somar 100%")

return

}

let faturamento=parseFloat(document.getElementById("faturamentoMensal").value)

let pix=document.getElementById("share_pix").value/100
let deb=document.getElementById("share_debito").value/100
let c1=document.getElementById("share_1x").value/100
let c26=document.getElementById("share_2_6").value/100
let c712=document.getElementById("share_7_12").value/100

let mpTotal=0
let outTotal=0

mpTotal+=faturamento*pix*(1-(mp["pix"]/100))
mpTotal+=faturamento*deb*(1-(mp["debito"]/100))
mpTotal+=faturamento*c1*(1-(mp[1]/100))
mpTotal+=faturamento*c26*(1-(mp[4]/100))
mpTotal+=faturamento*c712*(1-(mp[10]/100))

outTotal+=faturamento*pix*(1-(outras["pix"]/100))
outTotal+=faturamento*deb*(1-(outras["debito"]/100))
outTotal+=faturamento*c1*(1-(outras[1]/100))
outTotal+=faturamento*c26*(1-(outras[4]/100))
outTotal+=faturamento*c712*(1-(outras[10]/100))

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
