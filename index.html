window.onload=function(){

let html="";

for(let i=2;i<=21;i++){

html+=`<label>${i}x (%)</label> <input id="mp${i}" type="number">`;

}

document.getElementById("mpParcelas").innerHTML=html;

document.getElementById("uploadOCR").addEventListener("change",processarOCR);

};

function formatarTaxa(taxa){

if(!taxa || isNaN(taxa)) return "-";

return parseFloat(taxa).toFixed(2)+"%";

}

function liquido(valor,taxa){

if(!taxa || isNaN(taxa)) return "NÃO DISPONÍVEL";

let v=valor*(1-(taxa/100));

return "R$ "+v.toFixed(2);

}

function simular(){

let valor=parseFloat(document.getElementById("valor").value);

let mp={};
let outras={};

mp[0]=parseFloat(document.getElementById("mp_pix").value);
mp[1]=parseFloat(document.getElementById("mp1").value);

for(let i=2;i<=21;i++){
mp[i]=parseFloat(document.getElementById("mp"+i).value);
}

outras[0]=parseFloat(document.getElementById("out_pix").value);
outras[1]=parseFloat(document.getElementById("out1").value);

let mdr1=parseFloat(document.getElementById("mdr1").value);
let mdr2=parseFloat(document.getElementById("mdr2").value);
let mdr3=parseFloat(document.getElementById("mdr3").value);

let ant=parseFloat(document.getElementById("antecipacao").value);

for(let i=2;i<=6;i++){
outras[i]=mdr1+(ant*(i-1));
}

for(let i=7;i<=12;i++){
outras[i]=mdr2+(ant*(i-1));
}

for(let i=13;i<=21;i++){
outras[i]=mdr3+(ant*(i-1));
}

gerarTabela(valor,mp,outras);

}

function gerarTabela(valor,mp,outras){

let html=`<table>

<tr>
<th>Parcela</th>
<th>Taxa MP</th>
<th>R$ Mercado Pago</th>
<th>Taxa Concorrência</th>
<th>R$ Concorrência</th>
</tr>`;

for(let i=0;i<=21;i++){

let nome=i==0?"Pix":i+"x";

let taxaMP=mp[i];
let taxaOut=outras[i];

let classeMP="";
let classeOut="";

if(taxaMP && taxaOut){

if(taxaMP>taxaOut){
classeMP="taxaRuim";
}

if(taxaOut>taxaMP){
classeOut="taxaRuim";
}

}

html+=`<tr>

<td>${nome}</td>

<td class="${classeMP}">${formatarTaxa(taxaMP)}</td>

<td class="mp">${liquido(valor,taxaMP)}</td>

<td class="${classeOut}">${formatarTaxa(taxaOut)}</td>

<td class="outras">${liquido(valor,taxaOut)}</td>

</tr>`;

}

html+="</table>";

document.getElementById("resultado").innerHTML=html;

}

function exportar(){

html2canvas(document.getElementById("resultado")).then(canvas=>{

let link=document.createElement("a");

link.download="comparacao_taxas.png";

link.href=canvas.toDataURL();

link.click();

});

}

async function processarOCR(event){

let file=event.target.files[0];

if(!file) return;

document.getElementById("statusOCR").innerText="🔄 Carregando OCR...";

try{

const worker = await Tesseract.createWorker("eng");

document.getElementById("statusOCR").innerText="🔎 Lendo taxas...";

const { data } = await worker.recognize(file);

await worker.terminate();

let texto=data.text;

let numeros=texto.match(/[0-9]+[.,][0-9]+/g);

if(!numeros){

document.getElementById("statusOCR").innerText="❌ Não consegui identificar taxas.";

return;

}

let campos=[];

for(let i=2;i<=21;i++){
campos.push("mp"+i);
}

for(let i=0;i<numeros.length && i<campos.length;i++){

let valor=numeros[i].replace(",",".");

document.getElementById(campos[i]).value=parseFloat(valor).toFixed(2);

}

document.getElementById("statusOCR").innerText="✅ Taxas carregadas com sucesso.";

}catch(e){

document.getElementById("statusOCR").innerText="❌ Erro ao processar imagem.";

}

}
