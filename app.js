const CDI_ANUAL = 10.65;

window.onload=function(){

let html="";

for(let i=2;i<=21;i++){
html+=`<label>${i}x (%)</label> <input id="mp${i}" type="number">`;
}

document.getElementById("mpParcelas").innerHTML=html;

gerarCamposManual();

}

function gerarCamposManual(){

let html="";

for(let i=2;i<=21;i++){
html+=`<label>${i}x (%)</label> <input id="out${i}_manual" type="number">`;
}

document.getElementById("outrasParcelas").innerHTML=html;

}

function trocarModoOutras(){

let modo=document.querySelector('input[name="modoOutras"]:checked').value;

if(modo==="manual"){
document.getElementById("modoMDR").style.display="none";
document.getElementById("modoManual").style.display="block";
}else{
document.getElementById("modoMDR").style.display="block";
document.getElementById("modoManual").style.display="none";
}

}

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

let modo=document.querySelector('input[name="modoOutras"]:checked').value;

if(modo==="manual"){

outras["pix"]=parseFloat(out_pix_manual.value);
outras["debito"]=parseFloat(out_debito_manual.value);
outras[1]=parseFloat(out1_manual.value);

for(let i=2;i<=21;i++){
outras[i]=parseFloat(document.getElementById("out"+i+"_manual").value);
}

}else{

outras["pix"]=parseFloat(out_pix.value);
outras["debito"]=parseFloat(out_debito.value);
outras[1]=parseFloat(out1.value);

let mdrA=parseFloat(document.getElementById("mdr1").value);
let mdrB=parseFloat(document.getElementById("mdr2").value);
let mdrC=parseFloat(document.getElementById("mdr3").value);
let ant=parseFloat(document.getElementById("antecipacao").value);

for(let i=2;i<=6;i++) outras[i]=mdrA+(ant*(i-1));
for(let i=7;i<=12;i++) outras[i]=mdrB+(ant*(i-1));
for(let i=13;i<=21;i++) outras[i]=mdrC+(ant*(i-1));

}

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

function atualizarBarra(){

let ids=[
"share_pix",
"share_debito",
"share_1x",
"share_2x",
"share_4x",
"share_6x",
"share_10x"
];

let total=0;

ids.forEach(function(id){

let campo=document.getElementById(id);
let valor=parseFloat(campo.value);

if(!isNaN(valor)){
total+=valor;
}

});

if(total>100){
alert("A soma não pode ultrapassar 100%");
document.activeElement.value="";
return;
}

document.getElementById("contador").innerText = total + "%";
document.getElementById("barra").style.width = total + "%";

}

function simularFaturamento(){

let faturamento=parseFloat(document.getElementById("faturamento").value);

if(!faturamento){
alert("Informe o faturamento mensal");
return;
}

let shares={
pix:parseFloat(share_pix.value)||0,
debito:parseFloat(share_debito.value)||0,
c1:parseFloat(share_1x.value)||0,
c2:parseFloat(share_2x.value)||0,
c4:parseFloat(share_4x.value)||0,
c6:parseFloat(share_6x.value)||0,
c10:parseFloat(share_10x.value)||0
};

let economiaMensal=1000; // exemplo base

let economiaAnual=economiaMensal*12;
let economia5anos=economiaAnual*5;

let reserva=parseFloat(document.getElementById("cofrinho_reserva").value)||0;
let percentual=parseFloat(document.getElementById("cofrinho_percentual").value)||0;

let taxaAnual=(CDI_ANUAL*(percentual/100))/100;
let taxaMensal=taxaAnual/12;

let saldo=0;
let rendimentoTotal=0;

for(let i=1;i<=60;i++){

saldo+=reserva;

let rendimento=saldo*taxaMensal;

saldo+=rendimento;

rendimentoTotal+=rendimento;

}

let vencedor=economiaMensal>0?
"Mercado Pago é mais vantajoso neste cenário.":
"A concorrência é mais vantajosa neste cenário.";

document.getElementById("resultadoFaturamento").innerHTML=

`<div style="padding:20px;border:1px solid #ddd;border-radius:8px">

<h3>${vencedor}</h3>

<h2>Economia total em 5 anos: R$ ${economia5anos.toFixed(2)}</h2>

<hr>

<h4>Custos fixos da concorrência</h4>

Custos fixos mensais: <b>R$ ${custosFixos.toFixed(2)}</b><br><br>

Economia mensal: <b>R$ ${economiaMensal.toFixed(2)}</b><br><br>

Economia anual: <b>R$ ${economiaAnual.toFixed(2)}</b><br><br>

Economia em 5 anos: <b>R$ ${economia5anos.toFixed(2)}</b><br><br>

<hr>

<h4>Rendimento do cofrinho</h4>

Rendimento mensal: <b>R$ ${(reserva*taxaMensal).toFixed(2)}</b><br><br>

Rendimento anual: <b>R$ ${(reserva*taxaMensal*12).toFixed(2)}</b><br><br>

Rendimento em 5 anos: <b>R$ ${rendimentoTotal.toFixed(2)}</b><br><br>

<hr>

Saldo acumulado em 1 ano: <b>R$ ${(reserva*12+(reserva*taxaMensal*12)).toFixed(2)}</b><br><br>

Saldo acumulado em 5 anos: <b>R$ ${saldo.toFixed(2)}</b>

</div>`;

`<div style="padding:20px;border:1px solid #ddd;border-radius:8px">

<h3>${vencedor}</h3>

<h2>Economia total em 5 anos: R$ ${economia5anos.toFixed(2)}</h2>

<hr>

<h4>Rendimento do cofrinho</h4>

Rendimento em 5 anos: <b>R$ ${rendimentoTotal.toFixed(2)}</b>

</div>`;

gerarGraficos(shares,economiaMensal);

}

function gerarGraficos(shares,economia){

new Chart(document.getElementById("graficoComparacao"),{
type:"line",
data:{
labels:["Mensal","1 Ano","5 Anos"],
datasets:[
{
label:"Mercado Pago",
data:[economia,economia*12,economia*60]
},
{
label:"Concorrência",
data:[0,0,0]
}
]
}
});

new Chart(document.getElementById("graficoDistribuicao"),{
type:"pie",
data:{
labels:["Pix","Débito","1x","2x","4x","6x","10x"],
datasets:[{
data:[
shares.pix,
shares.debito,
shares.c1,
shares.c2,
shares.c4,
shares.c6,
shares.c10
]
}]
}
});

}
