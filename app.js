window.onload=function(){

let html="";

for(let i=2;i<=21;i++){
html+=`<label>${i}x (%)</label> <input id="mp${i}" type="number">`;
}

document.getElementById("mpParcelas").innerHTML=html;

let btnMP=document.getElementById("uploadOCR");
if(btnMP){
btnMP.addEventListener("change",processarOCR_MP);
}

let btnConc=document.getElementById("uploadOCRConc");
if(btnConc){
btnConc.addEventListener("change",processarOCR_CONC);
}

let seletor=document.getElementById("modoConcorrencia");
if(seletor){
seletor.addEventListener("change",alternarConcorrencia);
}

}

let taxasMP={}
let taxasOutras={}

function alternarConcorrencia(){

let modo=document.getElementById("modoConcorrencia").value;

let manual=document.getElementById("concManual");
let ocr=document.getElementById("concOCR");

if(modo==="manual"){

manual.style.display="block";
ocr.style.display="none";

}else{

manual.style.display="none";
ocr.style.display="block";

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

}

async function processarOCR_CONC(event){

let file=event.target.files[0];
if(!file) return;

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

}
