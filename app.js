window.onload=function(){

let html="";

for(let i=2;i<=21;i++){
html+=`<label>${i}x (%)</label> <input id="mp${i}" type="number">`;
}

document.getElementById("mpParcelas").innerHTML=html;

gerarCamposManual();

document.getElementById("uploadOCR").addEventListener("change",processarOCR);
document.getElementById("uploadOCRConc").addEventListener("change",processarOCRConc);

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

if(!campo) return;

let valor=parseFloat(campo.value);

if(!isNaN(valor)){
total+=valor;
}

});

// bloqueio acima de 100%
if(total>100){

alert("A soma dos percentuais não pode ultrapassar 100%.");

if(document.activeElement && document.activeElement.tagName==="INPUT"){
document.activeElement.value="";
}

total=0;

ids.forEach(function(id){

let campo=document.getElementById(id);

let valor=parseFloat(campo.value);

if(!isNaN(valor)){
total+=valor;
}

});

}

// atualiza contador
document.getElementById("contador").innerText = total + "%";

// atualiza barra
document.getElementById("barra").style.width = total + "%";

function simularFaturamento(){

let faturamento=parseFloat(document.getElementById("faturamento").value);

if(!faturamento){
alert("Informe o faturamento mensal");
return;
}

let shares={
pix:parseFloat(document.getElementById("share_pix").value)||0,
debito:parseFloat(document.getElementById("share_debito").value)||0,
c1:parseFloat(document.getElementById("share_1x").value)||0,
c2:parseFloat(document.getElementById("share_2x").value)||0,
c4:parseFloat(document.getElementById("share_4x").value)||0,
c6:parseFloat(document.getElementById("share_6x").value)||0,
c10:parseFloat(document.getElementById("share_10x").value)||0
};

let total=0;

for(let k in shares){
total+=shares[k];
}

if(total!=100){
alert("A soma dos percentuais precisa ser exatamente 100%");
return;
}

function taxa(id){
let el=document.getElementById(id);
if(!el || el.value==="") return 0;
return parseFloat(el.value);
}

let mp={
pix:taxa("mp_pix"),
debito:taxa("mp_debito"),
c1:taxa("mp1"),
c2:taxa("mp2"),
c4:taxa("mp4"),
c6:taxa("mp6"),
c10:taxa("mp10")
};

let modo=document.querySelector('input[name="modoOutras"]:checked').value;

let out={};

if(modo==="manual"){

out={
pix:taxa("out_pix_manual"),
debito:taxa("out_debito_manual"),
c1:taxa("out1_manual"),
c2:taxa("out2_manual"),
c4:taxa("out4_manual"),
c6:taxa("out6_manual"),
c10:taxa("out10_manual")
};

}else{

let mdr1=parseFloat(document.getElementById("mdr1").value)||0;
let mdr2=parseFloat(document.getElementById("mdr2").value)||0;
let ant=parseFloat(document.getElementById("antecipacao").value)||0;

out={
pix:taxa("out_pix"),
debito:taxa("out_debito"),
c1:taxa("out1"),
c2:mdr1+(ant*1),
c4:mdr1+(ant*3),
c6:mdr1+(ant*5),
c10:mdr2+(ant*9)
};

}

let economia=0;

function calcular(parcela,share){

let valor=faturamento*(share/100);

let custoMP=valor*(mp[parcela]/100);
let custoOUT=valor*(out[parcela]/100);

economia+=custoOUT-custoMP;

}

calcular("pix",shares.pix);
calcular("debito",shares.debito);
calcular("c1",shares.c1);
calcular("c2",shares.c2);
calcular("c4",shares.c4);
calcular("c6",shares.c6);
calcular("c10",shares.c10);

let mensal=economia;
let anual=economia*12;
let cinco=anual*5;

document.getElementById("resultadoFaturamento").innerHTML=

`
<div style="padding:20px;border:1px solid #ddd;border-radius:8px">

<h3>Resultado da simulação</h3>

Economia mensal: <b>R$ ${mensal.toFixed(2)}</b><br><br>

Economia anual: <b>R$ ${anual.toFixed(2)}</b><br><br>

Economia em 5 anos: <b>R$ ${cinco.toFixed(2)}</b>

</div>
`;

}
function exportar(){

html2canvas(document.getElementById("resultado"),{scale:2}).then(canvas=>{

let link=document.createElement("a");

link.download="comparacao_taxas.png";

link.href=canvas.toDataURL();

link.click();

});

}

async function processarOCR(event){

let file=event.target.files[0];

if(!file) return;

document.getElementById("statusOCR").innerText="Processando imagem...";

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

async function processarOCRConc(event){

let file=event.target.files[0];

if(!file) return;

document.getElementById("statusOCRConc").innerText="Processando imagem...";

const worker = await Tesseract.createWorker("eng");

const { data } = await worker.recognize(file);

await worker.terminate();

let texto=data.text.toLowerCase();

let regex=/([2-9]|1[0-9]|2[01])\s*x?\s*([0-9]+[.,][0-9]+)/g;

let match;

while((match=regex.exec(texto))!==null){

let parcela=parseInt(match[1]);
let taxa=parseFloat(match[2].replace(",",".")); 

let campo=document.getElementById("out"+parcela+"_manual");

if(campo){
campo.value=taxa.toFixed(2);
}

}

document.getElementById("statusOCRConc").innerText="Taxas carregadas";

}
