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

if(!taxa && taxa!==0) return null;

return valor*(1-(taxa/100));

}

function formatarTaxa(taxa){

if(!taxa && taxa!==0) return "Não se aplica";

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

mp["pix"]=parseFloat(mp_pix.value)||0;
mp["debito"]=parseFloat(mp_debito.value)||0;
mp[1]=parseFloat(mp1.value)||0;

for(let i=2;i<=21;i++){
mp[i]=parseFloat(document.getElementById("mp"+i).value)||0;
}

let modo=document.querySelector('input[name="modoOutras"]:checked').value;

if(modo==="manual"){

outras["pix"]=parseFloat(out_pix_manual.value)||0;
outras["debito"]=parseFloat(out_debito_manual.value)||0;
outras[1]=parseFloat(out1_manual.value)||0;

for(let i=2;i<=21;i++){
outras[i]=parseFloat(document.getElementById("out"+i+"_manual").value)||0;
}

}else{

outras["pix"]=parseFloat(out_pix.value)||0;
outras["debito"]=parseFloat(out_debito.value)||0;
outras[1]=parseFloat(out1.value)||0;

let mdrA=parseFloat(mdr1.value)||0;
let mdrB=parseFloat(mdr2.value)||0;
let mdrC=parseFloat(mdr3.value)||0;
let ant=parseFloat(antecipacao.value)||0;

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

ids.forEach(id=>{
let valor=parseFloat(document.getElementById(id).value);
if(!isNaN(valor)) total+=valor;
});

if(total>100){
alert("A soma não pode ultrapassar 100%");
document.activeElement.value="";
return;
}

contador.innerText=total+"%";
barra.style.width=total+"%";

}

function simularFaturamento(){

let faturamento=parseFloat(faturamento.value)||0;

let economiaMensal=0;

let economiaAnual=0;
let economia5anos=0;

let custosFixos=
(parseFloat(custo_sistema.value)||0)+
(parseFloat(custo_maquina.value)||0)+
(parseFloat(custo_cesta.value)||0)+
(parseFloat(custo_manutencao.value)||0);

economiaMensal+=custosFixos;

economiaAnual=economiaMensal*12;
economia5anos=economiaAnual*5;

let reserva=parseFloat(cofrinho_reserva.value)||0;
let percentual=parseFloat(cofrinho_percentual.value)||0;

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

resultadoFaturamento.innerHTML=

`<div style="padding:20px;border:1px solid #ddd;border-radius:8px">

<h3>${vencedor}</h3>

<h2>Economia total em 5 anos: R$ ${economia5anos.toFixed(2)}</h2>

<hr>

<h4>Custos fixos da concorrência</h4>

Economia mensal: <b>R$ ${economiaMensal.toFixed(2)}</b><br><br>

Economia anual: <b>R$ ${economiaAnual.toFixed(2)}</b><br><br>

Economia em 5 anos: <b>R$ ${economia5anos.toFixed(2)}</b><br><br>

<hr>

<h4>Rendimento do cofrinho</h4>

Rendimento mensal: <b>R$ ${(reserva*taxaMensal).toFixed(2)}</b><br><br>

Rendimento anual: <b>R$ ${(reserva*taxaMensal*12).toFixed(2)}</b><br><br>

Rendimento em 5 anos: <b>R$ ${rendimentoTotal.toFixed(2)}</b>

</div>`;

}

function exportar(){

html2canvas(document.body).then(canvas=>{

let link=document.createElement("a");
link.download="simulacao.png";
link.href=canvas.toDataURL();
link.click();

});

}
