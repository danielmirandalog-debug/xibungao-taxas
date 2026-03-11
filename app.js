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

statusOCR.innerHTML="Lendo imagem..."

const worker=await Tesseract.createWorker('eng')

const { data:{ text } } = await worker.recognize(arquivo)

await worker.terminate()

let numeros=text.match(/\d+[.,]?\d*/g)

if(!numeros){

statusOCR.innerHTML="Não foi possível identificar taxas"
return

}

numeros=numeros.map(n=>parseFloat(n.replace(",",".")))

let indice=0

for(let i=2;i<=21;i++){

let campo=document.getElementById("mp"+i)

if(campo && numeros[indice]!=null){

campo.value=numeros[indice]
indice++

}

}

statusOCR.innerHTML="Taxas de parcelamento carregadas ✔"

}

function liquido(valor,taxa){

if(!taxa && taxa!==0) return null

return valor*(1-(taxa/100))

}

function simular(){

let valor=parseFloat(valor.value)

mp["pix"]=parseFloat(mp_pix.value)
mp["debito"]=parseFloat(mp_debito.value)
mp[1]=parseFloat(mp1.value)

for(let i=2;i<=21;i++){

mp[i]=parseFloat(document.getElementById("mp"+i).value)

}

outras["pix"]=parseFloat(out_pix.value)
outras["debito"]=parseFloat(out_debito.value)
outras[1]=parseFloat(out1.value)

let mdr1=parseFloat(mdr1.value)
let mdr2=parseFloat(mdr2.value)
let mdr3=parseFloat(mdr3.value)

let ant=parseFloat(antecipacao.value)

for(let i=2;i<=6;i++) outras[i]=mdr1+(ant*(i-1))
for(let i=7;i<=12;i++) outras[i]=mdr2+(ant*(i-1))
for(let i=13;i<=21;i++) outras[i]=mdr3+(ant*(i-1))

gerarTabela(valor)

simulacaoFaturamento.style.display="block"

}

function gerarTabela(valorVenda){

let parcelas=["pix","debito",1]

for(let i=2;i<=21;i++) parcelas.push(i)

let html=`<table id="tabelaResultado">

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

let valorMP=liquido(valorVenda,taxaMP)
let valorOut=liquido(valorVenda,taxaOut)

html+=`<tr>

<td>${nome}</td>
<td>${taxaMP ?? "-"}</td>
<td>${valorMP? "R$ "+valorMP.toFixed(2):"-"}</td>
<td>${taxaOut ?? "-"}</td>
<td>${valorOut? "R$ "+valorOut.toFixed(2):"-"}</td>
</tr>`

})

html+="</table>"

resultado.innerHTML=html

}

function verificarShares(){

let pix=parseFloat(share_pix.value)||0
let deb=parseFloat(share_debito.value)||0
let c1=parseFloat(share_1x.value)||0
let c26=parseFloat(share_2_6.value)||0
let c712=parseFloat(share_7_12.value)||0

let total=pix+deb+c1+c26+c712

totalShare.innerHTML="Total: "+total+"%"

if(total!=100){

erroShare.innerHTML="⚠ Total precisa ser 100%"

}else{

erroShare.innerHTML=""

}

}

function calcularFaturamento(){

let faturamento=parseFloat(faturamentoMensal.value)

let custosMP=
(parseFloat(mp_cesta.value)||0)+
(parseFloat(mp_maquina.value)||0)+
(parseFloat(mp_sistema.value)||0)

let custosOut=
(parseFloat(out_cesta.value)||0)+
(parseFloat(out_maquina.value)||0)+
(parseFloat(out_sistema.value)||0)

let economia=(custosOut-custosMP)*12

resultadoFaturamento.innerHTML=
"<h3>Economia anual</h3><b>R$ "+economia.toFixed(2)+"</b>"

}

function exportarTabela(){

let tabela=document.getElementById("tabelaResultado")

html2canvas(tabela).then(canvas=>{

let link=document.createElement("a")

link.download="resultado.png"

link.href=canvas.toDataURL()

link.click()

})

}
