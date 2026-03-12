window.onload = function(){

let html="";

for(let i=2;i<=21;i++){
html+=`<label>${i}x (%)</label> <input id="mp${i}" type="number">`;
}

document.getElementById("mpParcelas").innerHTML=html;

let manualHTML="";

manualHTML+=`<label>Pix (%)</label> <input id="manual_pix" type="number">`;

manualHTML+=`<label>Débito (%)</label> <input id="manual_debito" type="number">`;

manualHTML+=`<label>Crédito 1x (%)</label> <input id="manual1" type="number">`;

for(let i=2;i<=21;i++){
manualHTML+=`<label>${i}x (%)</label> <input id="manual${i}" type="number">`;
}

document.getElementById("manualParcelas").innerHTML=manualHTML;

document.getElementById("uploadOCR").addEventListener("change",processarOCR);

if(document.getElementById("uploadOCRConcorrencia")){
document.getElementById("uploadOCRConcorrencia").addEventListener("change",processarOCRConcorrencia);
}

}

function alternarModo(){

let modo=document.querySelector('input[name="modoOutras"]:checked').value;

document.getElementById("modoFaixa").style.display = modo==="faixa" ? "block":"none";
document.getElementById("modoManual").style.display = modo==="manual" ? "block":"none";

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

outras["pix"]=parseFloat(manual_pix.value);
outras["debito"]=parseFloat(manual_debito.value);
outras[1]=parseFloat(manual1.value);

for(let i=2;i<=21;i++){
outras[i]=parseFloat(document.getElementById("manual"+i).value);
}

}else{

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

}

gerarTabela(valor,mp,outras);

}

function gerarTabela(valor,mp,outras){

let parcelas=["pix","debito",1];

for(let i=2;i<=21;i++){
parcelas.push(i);
}

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

if(taxaMP!==undefined && taxaOut!==undefined){

if(taxaMP>taxaOut){
classeMP="taxaRuim";
}

if(taxaOut>taxaMP){
classeOut="taxaRuim";
}

}

html+=`<tr>

<td>${nome}</td>

<td class="${classeMP}">
${formatarTaxa(taxaMP)}
</td>

<td>
${valorMP!=null?"R$ "+valorMP.toFixed(2):"Não se aplica"}
</td>

<td class="${classeOut}">
${formatarTaxa(taxaOut)}
</td>

<td>
${valorOut!=null?"R$ "+valorOut.toFixed(2):"Não se aplica"}
</td>

</tr>`;

});

html+="</table>";

document.getElementById("resultado").innerHTML=html;

}

async function processarOCR(event){

let file=event.target.files[0];
if(!file) return;

document.getElementById("statusOCR").innerText="Lendo imagem...";

const worker = await Tesseract.createWorker("eng");

const { data } = await worker.recognize(file);

await worker.terminate();

let texto=data.text.toLowerCase();

let regex=/([2-9]|1[0-9]|2[01])\s*x?\s*([0-9]+[.,][0-9]+)/g;

let match;

while((match=regex.exec(texto))!==null){

let parcela=parseInt(match[1]);
let taxa=parseFloat(match[2].replace(",","."));

let campo=document.getElementById("mp"+parcela);

if(campo){
campo.value=taxa.toFixed(2);
}

}

document.getElementById("statusOCR").innerText="Taxas carregadas";

}

async function processarOCRConcorrencia(event){

let file=event.target.files[0];
if(!file) return;

document.getElementById("statusOCRConc").innerText="Lendo imagem...";

const worker = await Tesseract.createWorker("eng");

const { data } = await worker.recognize(file);

await worker.terminate();

let texto=data.text.toLowerCase();

let regex=/([2-9]|1[0-9]|2[01])\s*x?\s*([0-9]+[.,][0-9]+)/g;

let match;

while((match=regex.exec(texto))!==null){

let parcela=parseInt(match[1]);
let taxa=parseFloat(match[2].replace(",","."));

let campo=document.getElementById("manual"+parcela);

if(campo){
campo.value=taxa.toFixed(2);
}

}

document.getElementById("statusOCRConc").innerText="Taxas concorrência carregadas";

}

function simularFaturamento(){

let faturamento=parseFloat(document.getElementById("faturamento").value);

let shares=[
parseFloat(share_pix.value),
parseFloat(share_debito.value),
parseFloat(share_1x.value),
parseFloat(share_2_6.value),
parseFloat(share_7_12.value),
parseFloat(share_13_21.value)
];

if(shares.some(isNaN)){
alert("Preencha todos os percentuais");
return;
}

let total=shares.reduce((a,b)=>a+b,0);

if(total!==100){
alert("A soma deve ser 100%");
return;
}

document.getElementById("resultadoFaturamento").innerHTML=

`<div style="padding:15px;border:1px solid #ddd;border-radius:8px">

Faturamento analisado: <b>R$ ${faturamento.toFixed(2)}</b>

<br><br>

Distribuição válida (100%)

</div>`;

}

function exportar(){

html2canvas(document.getElementById("resultado"),{
scale:2
}).then(canvas=>{

let link=document.createElement("a");

link.download="comparacao_taxas.png";

link.href=canvas.toDataURL();

link.click();

});

}
