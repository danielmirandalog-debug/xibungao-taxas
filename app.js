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

let shares={
pix:parseFloat(share_pix.value)||0,
debito:parseFloat(share_debito.value)||0,
c1:parseFloat(share_1x.value)||0,
c2:parseFloat(share_2x.value)||0,
c4:parseFloat(share_4x.value)||0,
c6:parseFloat(share_6x.value)||0,
c10:parseFloat(share_10x.value)||0
};

let mp={
pix:parseFloat(mp_pix.value)||0,
debito:parseFloat(mp_debito.value)||0,
c1:parseFloat(mp1.value)||0,
c2:parseFloat(mp2.value)||0,
c4:parseFloat(mp4.value)||0,
c6:parseFloat(mp6.value)||0,
c10:parseFloat(mp10.value)||0
};

let out={
pix:parseFloat(out_pix_manual.value)||0,
debito:parseFloat(out_debito_manual.value)||0,
c1:parseFloat(out1_manual.value)||0,
c2:parseFloat(out2_manual.value)||0,
c4:parseFloat(out4_manual.value)||0,
c6:parseFloat(out6_manual.value)||0,
c10:parseFloat(out10_manual.value)||0
};

let economiaTaxas=0;

function calcular(tipo,percent){

let valor=faturamento*(percent/100);

let custoMP=valor*(mp[tipo]/100);
let custoOUT=valor*(out[tipo]/100);

economiaTaxas+=custoOUT-custoMP;

}

calcular("pix",shares.pix);
calcular("debito",shares.debito);
calcular("c1",shares.c1);
calcular("c2",shares.c2);
calcular("c4",shares.c4);
calcular("c6",shares.c6);
calcular("c10",shares.c10);

let custosFixos=
(parseFloat(document.getElementById("custo_sistema").value)||0)+
(parseFloat(document.getElementById("custo_maquina").value)||0)+
(parseFloat(document.getElementById("custo_cesta").value)||0)+
(parseFloat(document.getElementById("custo_manutencao").value)||0);

let economiaMensal=economiaTaxas+custosFixos;
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

let vencedor="";

if(economiaMensal>0){
vencedor="Mercado Pago é mais vantajoso neste cenário.";
}else{
vencedor="A concorrência é mais vantajosa neste cenário.";
}

document.getElementById("resultadoFaturamento").innerHTML=

`<div style="padding:20px;border:1px solid #ddd;border-radius:8px">

<h3>${vencedor}</h3>

<h2>Economia total em 5 anos: R$ ${economia5anos.toFixed(2)}</h2>

<hr>

<h4>Custos da concorrência</h4>

Economia mensal: <b>R$ ${economiaMensal.toFixed(2)}</b><br><br>

Economia anual: <b>R$ ${economiaAnual.toFixed(2)}</b><br><br>

Economia em 5 anos: <b>R$ ${economia5anos.toFixed(2)}</b><br><br>

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
