const CDI_ANUAL = 10.65;

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

function extrairNumeros(texto){

let encontrados=texto.match(/\d+[.,]?\d*/g);

if(!encontrados) return [];

return encontrados.map(n=>{
return parseFloat(n.replace(",","."));
});

}

function preencherTaxasMP(numeros){

if(numeros.length<3) return;

mp_pix.value=numeros[0]||"";
mp_debito.value=numeros[1]||"";
mp1.value=numeros[2]||"";

let index=3;

for(let i=2;i<=21;i++){

let campo=document.getElementById("mp"+i);

if(numeros[index]!=undefined){
campo.value=numeros[index];
}

index++;

}

}

function preencherTaxasConc(numeros){

if(numeros.length<3) return;

out_pix_manual.value=numeros[0]||"";
out_debito_manual.value=numeros[1]||"";
out1_manual.value=numeros[2]||"";

let index=3;

for(let i=2;i<=21;i++){

let campo=document.getElementById("out"+i+"_manual");

if(numeros[index]!=undefined){
campo.value=numeros[index];
}

index++;

}

}

async function processarOCR(event){

const file=event.target.files[0];

const result=await Tesseract.recognize(file,'eng');

let texto=result.data.text;

let numeros=extrairNumeros(texto);

preencherTaxasMP(numeros);

alert("OCR processado e taxas preenchidas automaticamente.");

}

async function processarOCRConc(event){

const file=event.target.files[0];

const result=await Tesseract.recognize(file,'eng');

let texto=result.data.text;

let numeros=extrairNumeros(texto);

preencherTaxasConc(numeros);

alert("OCR processado e taxas preenchidas automaticamente.");

}
