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

for(let i=2;i<=6;i++) outras[i]=parseFloat((mdrA+(ant*(i-1))).toFixed(2));
for(let i=7;i<=12;i++) outras[i]=parseFloat((mdrB+(ant*(i-1))).toFixed(2));
for(let i=13;i<=21;i++) outras[i]=parseFloat((mdrC+(ant*(i-1))).toFixed(2));

document.querySelector('input[value="manual"]').checked=true;
trocarModoOutras();

out_pix_manual.value=outras["pix"];
out_debito_manual.value=outras["debito"];
out1_manual.value=outras[1];

for(let i=2;i<=21;i++){
document.getElementById("out"+i+"_manual").value=outras[i];
}

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
<th>Taxa Concorrência</th>
<th>R$ Concorrência</th>
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

/* ================= OCR ================= */

function extrairNumeros(texto){

let encontrados=texto.match(/\d+[.,]?\d*/g);

if(!encontrados) return [];

return encontrados.map(n=>parseFloat(n.replace(",",".")));

}

function preencherTaxasMP(numeros){

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

alert("OCR processado e taxas preenchidas.");

}

async function processarOCRConc(event){

const file=event.target.files[0];

const result=await Tesseract.recognize(file,'eng');

let texto=result.data.text;

let numeros=extrairNumeros(texto);

preencherTaxasConc(numeros);

alert("OCR processado e taxas preenchidas.");

}
