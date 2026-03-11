let mp={}
let outras={}

window.onload=function(){

let html=""

for(let i=2;i<=21;i++){

html+=`<label>${i}x (%)</label> <input id="mp${i}">`

}

document.getElementById("mpParcelas").innerHTML=html

let manualHTML=""

manualHTML+=`<label>Pix (%)</label><input id="manual_pix">`
manualHTML+=`<label>Débito (%)</label><input id="manual_debito">`
manualHTML+=`<label>Crédito 1x (%)</label><input id="manual1">`

for(let i=2;i<=21;i++){

manualHTML+=`<label>${i}x (%)</label> <input id="manual${i}">`

}

document.getElementById("manualParcelas").innerHTML=manualHTML

document.getElementById("uploadOCR").addEventListener("change",processarOCR)

}

function alternarModo(){

let modo=document.querySelector('input[name="modoOutras"]:checked').value

document.getElementById("modoFaixa").style.display=(modo==="faixa")?"block":"none"
document.getElementById("modoManual").style.display=(modo==="manual")?"block":"none"

}

function liquido(valor,taxa){

if(!taxa && taxa!==0) return null

return valor*(1-(taxa/100))

}

function formatarTaxa(taxa){

if(!taxa && taxa!==0) return "Não se aplica"

return parseFloat(taxa).toFixed(2)+"%"

}

function simular(){

let valor=parseFloat(document.getElementById("valor").value)

if(!valor){

alert("Informe o valor da venda")

return

}

mp["pix"]=parseFloat(document.getElementById("mp_pix").value)
mp["debito"]=parseFloat(document.getElementById("mp_debito").value)
mp[1]=parseFloat(document.getElementById("mp1").value)

for(let i=2;i<=21;i++){

mp[i]=parseFloat(document.getElementById("mp"+i).value)

}

let modo=document.querySelector('input[name="modoOutras"]:checked').value

if(modo==="manual"){

outras["pix"]=parseFloat(document.getElementById("manual_pix").value)
outras["debito"]=parseFloat(document.getElementById("manual_debito").value)
outras[1]=parseFloat(document.getElementById("manual1").value)

for(let i=2;i<=21;i++){

outras[i]=parseFloat(document.getElementById("manual"+i).value)

}

}else{

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

let somaMP=0
let somaOut=0
let cont=0

parcelas.forEach(p=>{

let nome=p==="pix"?"Pix":p==="debito"?"Débito":p+"x"

let taxaMP=mp[p]
let taxaOut=outras[p]

let valorMP=liquido(valor,taxaMP)
let valorOut=liquido(valor,taxaOut)

if(valorMP && valorOut){

somaMP+=valorMP
somaOut+=valorOut
cont++

}

html+=`<tr>

<td>${nome}</td>
<td>${formatarTaxa(taxaMP)}</td>
<td>${valorMP? "R$ "+valorMP.toFixed(2):"Não se aplica"}</td>
<td>${formatarTaxa(taxaOut)}</td>
<td>${valorOut? "R$ "+valorOut.toFixed(2):"Não se aplica"}</td>
</tr>`

})

html+="</table>"

let mediaMP=somaMP/cont
let mediaOut=somaOut/cont

html+=`

<h3>Resultado</h3>

Média líquida MP: R$ ${mediaMP.toFixed(2)}<br>
Média líquida Outros: R$ ${mediaOut.toFixed(2)}

<br><br>

<button onclick="abrirFaturamento()">Simular faturamento</button>

`

document.getElementById("resultado").innerHTML=html

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

let mpCustos=
(parseFloat(document.getElementById("mp_cesta").value)||0)+
(parseFloat(document.getElementById("mp_maquina").value)||0)+
(parseFloat(document.getElementById("mp_sistema").value)||0)

let outCustos=
(parseFloat(document.getElementById("out_cesta").value)||0)+
(parseFloat(document.getElementById("out_maquina").value)||0)+
(parseFloat(document.getElementById("out_sistema").value)||0)

mpTotal-=mpCustos
outTotal-=outCustos

let economia=(outTotal-mpTotal)*12

document.getElementById("resultadoFaturamento").innerHTML=`

<h3>Economia anual estimada</h3>

Mercado Pago anual: R$ ${(mpTotal*12).toFixed(2)}<br>
Outros anual: R$ ${(outTotal*12).toFixed(2)}

<br><br>

<b>Economia anual: R$ ${economia.toFixed(2)}</b>

`

}
