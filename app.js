const modo = document.getElementById("modo")
const mpInputs = document.getElementById("mpInputs")

for(let i=1;i<=18;i++){

let label=document.createElement("label")
label.innerText="Taxa "+i+"x %"

let input=document.createElement("input")
input.type="number"
input.id="mp"+i

mpInputs.appendChild(label)
mpInputs.appendChild(input)

}

modo.addEventListener("change",()=>{

if(modo.value==="mp"){

document.body.className="mp"

document.getElementById("mercadopago").style.display="block"
document.getElementById("adquirencia").style.display="none"

}

else{

document.body.className="adq"

document.getElementById("mercadopago").style.display="none"
document.getElementById("adquirencia").style.display="block"

}

})

function calcular(){

let valor=parseFloat(document.getElementById("valor").value)

let tabela=document.getElementById("resultado")
let resumo=document.getElementById("resumo")

tabela.innerHTML="<tr><th>Tipo</th><th>Taxa</th><th>Recebe</th></tr>"

if(modo.value==="mp"){

let pix=parseFloat(document.getElementById("mpPix").value||0)
let debito=parseFloat(document.getElementById("mpDebito").value||0)

let liquidoPix = valor*(1-(pix/100))
let liquidoDeb = valor*(1-(debito/100))

tabela.innerHTML+=`
<tr>
<td>PIX</td>
<td>${pix}%</td>
<td>R$ ${liquidoPix.toFixed(2)}</td>
</tr>
`

tabela.innerHTML+=`
<tr>
<td>Débito</td>
<td>${debito}%</td>
<td>R$ ${liquidoDeb.toFixed(2)}</td>
</tr>
`

for(let i=1;i<=18;i++){

let taxa=parseFloat(document.getElementById("mp"+i).value||0)

let liquido=valor*(1-(taxa/100))

tabela.innerHTML+=`
<tr>
<td>${i}x crédito</td>
<td>${taxa}%</td>
<td>R$ ${liquido.toFixed(2)}</td>
</tr>
`

}

}

else{

let pix=parseFloat(document.getElementById("pix").value||0)
let debito=parseFloat(document.getElementById("debito").value||0)

let mdr=parseFloat(document.getElementById("mdr").value||0)
let antecipacao=parseFloat(document.getElementById("antecipacao").value||0)

let t26=parseFloat(document.getElementById("t26").value||0)
let t712=parseFloat(document.getElementById("t712").value||0)
let t1321=parseFloat(document.getElementById("t1321").value||0)

let liquidoPix = valor*(1-(pix/100))
let liquidoDeb = valor*(1-(debito/100))

tabela.innerHTML+=`
<tr>
<td>PIX</td>
<td>${pix}%</td>
<td>R$ ${liquidoPix.toFixed(2)}</td>
</tr>
`

tabela.innerHTML+=`
<tr>
<td>Débito</td>
<td>${debito}%</td>
<td>R$ ${liquidoDeb.toFixed(2)}</td>
</tr>
`

for(let i=1;i<=21;i++){

let taxa=mdr

if(i>=2 && i<=6) taxa+=t26
if(i>=7 && i<=12) taxa+=t712
if(i>=13) taxa+=t1321

taxa+=antecipacao*(i-1)

let liquido=valor*(1-(taxa/100))

tabela.innerHTML+=`
<tr>
<td>${i}x crédito</td>
<td>${taxa.toFixed(2)}%</td>
<td>R$ ${liquido.toFixed(2)}</td>
</tr>
`

}

}

resumo.innerHTML=`
<h3>Valor simulado</h3>
<p><b>R$ ${valor.toFixed(2)}</b></p>
`

}

function compartilhar(){

let texto=document.getElementById("resultado").innerText

navigator.share({
title:"Simulação XIBUNGÃO TAXAS",
text:texto
})

}
