window.onload=function(){

let html="";

for(let i=2;i<=21;i++){
html+=`<label>${i}x (%)</label> <input id="mp${i}" type="number">`;
}

document.getElementById("mpParcelas").innerHTML=html;

document.getElementById("uploadOCR").addEventListener("change",processarOCR_MP);

let btnConc=document.getElementById("uploadOCRConc");
if(btnConc){
btnConc.addEventListener("change",processarOCR_CONC);
}

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

total=0;

ids.forEach(function(id){

let campo=document.getElementById(id);

let valor=parseFloat(campo.value);

if(!isNaN(valor)){
total+=valor;
}

});

}

document.getElementById("contador").innerText=total+"%";

document.getElementById("barra").style.width=total+"%";

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
let economia5= economia*5

html+=`<br>

<b>Custo anual Mercado Pago:</b> R$ ${custoMP.toFixed(2)}<br> <b>Custo anual Concorrência:</b> R$ ${custoOut.toFixed(2)}<br><br>

<b>Economia anual:</b> R$ ${economia.toFixed(2)}<br> <b>Economia em 5 anos:</b> R$ ${economia5.toFixed(2)}
`

document.getElementById("resultadoFaturamento").innerHTML=html

}

function exportar(){

html2canvas(document.getElementById("resultado"),{scale:2}).then(canvas=>{

let link=document.createElement("a");

link.download="comparacao_taxas.png";

link.href=canvas.toDataURL();

link.click();

alert("Relatório exportado com sucesso!");

});

}

async function preprocessarImagem(file){

return new Promise(resolve=>{

let img=new Image();

img.onload=function(){

let canvas=document.createElement("canvas");

let ctx=canvas.getContext("2d");

canvas.width=img.width*2;
canvas.height=img.height*2;

ctx.drawImage(img,0,0,canvas.width,canvas.height);

let imgData=ctx.getImageData(0,0,canvas.width,canvas.height);
let data=imgData.data;

for(let i=0;i<data.length;i+=4){

let avg=(data[i]+data[i+1]+data[i+2])/3;

avg=avg>160?255:0;

data[i]=avg;
data[i+1]=avg;
data[i+2]=avg;

}

ctx.putImageData(imgData,0,0);

resolve(canvas);

}

img.src=URL.createObjectURL(file);

});

}

async function processarOCR_MP(event){

let file=event.target.files[0];
if(!file) return;

document.getElementById("statusOCR").innerText="Lendo taxas Mercado Pago...";

let canvas=await preprocessarImagem(file);

const worker=await Tesseract.createWorker("eng");

const {data}=await worker.recognize(canvas);

await worker.terminate();

let texto=data.text.toLowerCase();

let regex=/([2-9]|1[0-9]|2[01])\s*x?\s*([0-9]+[.,][0-9]+)/g;

let match;

while((match=regex.exec(texto))!==null){

let parcela=parseInt(match[1]);
let taxa=parseFloat(match[2].replace(",","."));

if(parcela>=2){

let campo=document.getElementById("mp"+parcela);

if(campo) campo.value=taxa.toFixed(2);

}

}

document.getElementById("statusOCR").innerText="Taxas Mercado Pago carregadas";

}

async function processarOCR_CONC(event){

let file=event.target.files[0];
if(!file) return;

document.getElementById("statusOCR").innerText="Lendo taxas concorrência...";

let canvas=await preprocessarImagem(file);

const worker=await Tesseract.createWorker("eng");

const {data}=await worker.recognize(canvas);

await worker.terminate();

let texto=data.text.toLowerCase();

let regex=/([2-9]|1[0-9]|2[01])\s*x?\s*([0-9]+[.,][0-9]+)/g;

let match;

while((match=regex.exec(texto))!==null){

let parcela=parseInt(match[1]);
let taxa=parseFloat(match[2].replace(",","."));

if(parcela>=2){

let campo=document.getElementById("out"+parcela);

if(campo) campo.value=taxa.toFixed(2);

}

}

document.getElementById("statusOCR").innerText="Taxas concorrência carregadas";

}
