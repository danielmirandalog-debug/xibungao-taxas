window.onload=function(){

let html="";

for(let i=2;i<=21;i++){
html+=`<label>${i}x (%)</label> <input id="mp${i}" type="number">`;
}

document.getElementById("mpParcelas").innerHTML=html;

document.getElementById("uploadOCR").addEventListener("change",processarOCR);

}

let taxasMP={}
let taxasOutras={}

function liquido(valor,taxa){

if(taxa===undefined || taxa===null || taxa==="") return null;

return valor*(1-(taxa/100));

}

function formatarTaxa(taxa){

if(taxa===undefined || taxa===null || taxa==="") return "Não se aplica";

return parseFloat(taxa).toFixed(2)+"%";

}

function simular(){

let valor=parseFloat(document.getElementById("valor").value);

if(!valor){
alert("Informe o valor da venda");
return;
}

let mp={};
let outras={};

mp["pix"]=parseFloat(mp_pix.value);
mp["debito"]=parseFloat(mp_debito.value);
mp[1]=parseFloat(mp1.value);

for(let i=2;i<=21;i++){
mp[i]=parseFloat(document.getElementById("mp"+i).value);
}

outras["pix"]=parseFloat(out_pix.value);
outras["debito"]=parseFloat(out_debito.value);
outras[1]=parseFloat(out1.value);

let mdr1=parseFloat(document.getElementById("mdr1").value);
let mdr2=parseFloat(document.getElementById("mdr2").value);
let mdr3=parseFloat(document.getElementById("mdr3").value);
let ant=parseFloat(document.getElementById("antecipacao").value);

for(let i=2;i<=6;i++) outras[i]=mdr1+(ant*(i-1));
for(let i=7;i<=12;i++) outras[i]=mdr2+(ant*(i-1));
for(let i=13;i<=21;i++) outras[i]=mdr3+(ant*(i-1));

taxasMP=mp
taxasOutras=outras

gerarTabela(valor,mp,outras);

}

function gerarTabela(valor,mp,outras){

let parcelas=["pix","debito",1];

for(let i=2;i<=21;i++) parcelas.push(i);

let html=`<table>

<tr>
<th>Parcela</th>
<th>Taxa MP</th>
<th>R$ Mercado Pago</th>
<th>Taxa Outros</th>
<th>R$ Outros</th>
</tr>`;

parcelas.forEach(p=>{

let nome=p==="pix"?"Pix":p==="debito"?"Débito":p+"x";

let taxaMP=mp[p];
let taxaOut=outras[p];

let valorMP=liquido(valor,taxaMP);
let valorOut=liquido(valor,taxaOut);

let classeMP="";
let classeOut="";

if(taxaMP>taxaOut) classeMP="taxaRuim";
if(taxaOut>taxaMP) classeOut="taxaRuim";

html+=`<tr>

<td>${nome}</td>

<td class="${classeMP}">${formatarTaxa(taxaMP)}</td>

<td>${valorMP!=null?"R$ "+valorMP.toFixed(2):"Não se aplica"}</td>

<td class="${classeOut}">${formatarTaxa(taxaOut)}</td>

<td>${valorOut!=null?"R$ "+valorOut.toFixed(2):"Não se aplica"}</td>

</tr>`;

});

html+="</table>";

document.getElementById("resultado").innerHTML=html;

}

function simularFaturamento(){

let faturamento=parseFloat(document.getElementById("faturamento").value);

let shares={
pix:parseFloat(share_pix.value),
debito:parseFloat(share_debito.value),
1:parseFloat(share_1x.value),
2:parseFloat(share_2x.value),
4:parseFloat(share_4x.value),
6:parseFloat(share_6x.value),
10:parseFloat(share_10x.value)
}

let total=0

for(let k in shares){
if(isNaN(shares[k])){
alert("Preencha todos os percentuais")
return
}
total+=shares[k]
}

if(total!==100){
alert("A soma deve ser exatamente 100%")
return
}

let custoMP=0
let custoOut=0

let html=`<table>

<tr>
<th>Forma</th>
<th>Faturamento</th>
<th>Custo MP (ano)</th>
<th>Custo Concorrência (ano)</th>
</tr>`

for(let forma in shares){

let percentual=shares[forma]/100
let fat=faturamento*percentual

let taxaMP=taxasMP[forma]
let taxaOut=taxasOutras[forma]

let custoAnoMP=(fat*(taxaMP/100))*12
let custoAnoOut=(fat*(taxaOut/100))*12

custoMP+=custoAnoMP
custoOut+=custoAnoOut

let nome=forma=="pix"?"Pix":forma=="debito"?"Débito":forma+"x"

html+=`<tr>

<td>${nome}</td>
<td>R$ ${fat.toFixed(2)}</td>
<td>R$ ${custoAnoMP.toFixed(2)}</td>
<td>R$ ${custoAnoOut.toFixed(2)}</td>

</tr>`

}

html+=`</table>`

let economia=custoOut-custoMP

html+=`<br>

<b>Custo anual Mercado Pago:</b> R$ ${custoMP.toFixed(2)}<br> <b>Custo anual Concorrência:</b> R$ ${custoOut.toFixed(2)}<br><br>

<b>ECONOMIA ANUAL:</b> R$ ${economia.toFixed(2)}
`

document.getElementById("resultadoFaturamento").innerHTML=html

}
