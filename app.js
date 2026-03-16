const CDI_ANUAL = 10.65;

/* ===========================
GERAÇÃO DOS CAMPOS
=========================== */

window.onload = function(){

let html="";

for(let i=2;i<=21;i++){

html+=`
<label>${i}x (%)</label>
<input id="mp${i}" type="number" step="0.01">
`;

}

let container=document.getElementById("taxasParceladas");

if(container) container.innerHTML=html;

};

/* ===========================
PRÉ PROCESSAMENTO DA IMAGEM
=========================== */

function preprocessarImagemOCR(img){

const canvas=document.createElement("canvas");
const ctx=canvas.getContext("2d");

canvas.width=img.width*2;
canvas.height=img.height*2;

ctx.drawImage(img,0,0,canvas.width,canvas.height);

let imgData=ctx.getImageData(0,0,canvas.width,canvas.height);
let data=imgData.data;

for(let i=0;i<data.length;i+=4){

let r=data[i];
let g=data[i+1];
let b=data[i+2];

let cinza=(r+g+b)/3;

let valor=cinza>180?255:0;

data[i]=valor;
data[i+1]=valor;
data[i+2]=valor;

}

ctx.putImageData(imgData,0,0);

return canvas;

}

/* ===========================
EXECUTAR OCR
=========================== */

async function executarOCR(file){

const img=new Image();

img.src=URL.createObjectURL(file);

await new Promise(r=>img.onload=r);

const canvas=preprocessarImagemOCR(img);

const result=await Tesseract.recognize(
canvas,
"eng",
{
tessedit_char_whitelist:"0123456789.xX%"
}
);

return result.data.text;

}

/* ===========================
EXTRAÇÃO INTELIGENTE DAS TAXAS
=========================== */

function extrairTaxasPorTexto(texto){

let taxas={};

texto=texto
.replace(/,/g,".")
.replace(/%/g,"")
.replace(/ +/g," ");

let linhas=texto
.split(/\n|\r/)
.map(l=>l.trim())
.filter(l=>l);

let parcelaAtual=null;

for(let linha of linhas){

let parcelaMatch=linha.match(/(\d{1,2})\s*[xX]/);

if(parcelaMatch){

parcelaAtual=parseInt(parcelaMatch[1]);

let resto=linha.replace(parcelaMatch[0],'');

let taxaMatch=resto.match(/(\d+\.\d+|\d+)/);

if(taxaMatch){

let taxa=parseFloat(taxaMatch[1]);

if(taxa>0 && taxa<100){

taxas[parcelaAtual]=taxa;
parcelaAtual=null;

}

}

continue;

}

let taxaLinha=linha.match(/(\d+\.\d+|\d+)/);

if(taxaLinha && parcelaAtual){

let taxa=parseFloat(taxaLinha[1]);

if(taxa>0 && taxa<100){

taxas[parcelaAtual]=taxa;
parcelaAtual=null;

}

}

}

/* fallback caso venha tudo na mesma linha */

let pares=texto.match(/\d{1,2}\s*[xX]\s*\d+\.\d+/g);

if(pares){

for(let p of pares){

let m=p.match(/(\d{1,2})\s*[xX]\s*(\d+\.\d+)/);

if(m){

let parcela=parseInt(m[1]);
let taxa=parseFloat(m[2]);

if(parcela>=1 && parcela<=21){

taxas[parcela]=taxa;

}

}

}

}

return taxas;

}

/* ===========================
PREENCHER CAMPOS AUTOMATICAMENTE
=========================== */

function preencherCamposTaxas(taxas){

for(let parcela in taxas){

let campo=document.getElementById("mp"+parcela);

if(campo){

campo.value=taxas[parcela];

}

}

}

/* ===========================
UPLOAD DA IMAGEM
=========================== */

async function processarImagem(input){

let file=input.files[0];

if(!file) return;

let texto=await executarOCR(file);

let taxas=extrairTaxasPorTexto(texto);

preencherCamposTaxas(taxas);

}
