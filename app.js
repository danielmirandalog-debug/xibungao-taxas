window.onload=function(){

let html="";

for(let i=2;i<=21;i++){

html+=`<label>${i}x (%)</label> <input id="mp${i}" type="number">`;

}

document.getElementById("mpParcelas").innerHTML=html;

let manualHTML="";

manualHTML+=`<label>Pix (%)</label> <input id="manual_pix">`;
manualHTML+=`<label>Débito (%)</label> <input id="manual_debito">`;
manualHTML+=`<label>Crédito 1x (%)</label> <input id="manual1">`;

for(let i=2;i<=21;i++){

manualHTML+=`<label>${i}x (%)</label> <input id="manual${i}">`;

}

document.getElementById("manualParcelas").innerHTML=manualHTML;

document.getElementById("uploadOCR").addEventListener("change",processarOCR);

};

function alternarModo(){

let modo=document.querySelector('input[name="modoOutras"]:checked').value;

document.getElementById("modoFaixa").style.display=(modo==="faixa")?"block":"none";
document.getElementById("modoManual").style.display=(modo==="manual")?"block":"none";

}

function formatarTaxa(taxa){

if(taxa === "" || taxa === null || taxa === undefined || isNaN(taxa))
return "Não se aplica";

return parseFloat(taxa).toFixed(2)+"%";

}

function liquido(valor,taxa){

if(taxa === "" || taxa === null || taxa === undefined || isNaN(taxa))
return null;

return valor*(1-(taxa/100));

}

function simular(){

let valorCampo=document.getElementById("valor").value;

if(valorCampo === "" || parseFloat(valorCampo) <= 0){

alert("Informe o valor da venda para realizar a simulação.");

return;

}

let valor=parseFloat(valorCampo);

let mp={};
let outras={};

mp["pix"]=parseFloat(document.getElementById("mp_pix").value);
mp["debito"]=parseFloat(document.getElementById("mp_debito").value);
mp[1]=parseFloat(document.getElementById("mp1").value);

for(let i=2;i<=21;i++){
mp[i]=parseFloat(document.getElementById("mp"+i).value);
}

let modo=document.querySelector('input[name="modoOutras"]:checked').value;

if(modo==="manual"){

outras["pix"]=parseFloat(document.getElementById("manual_pix").value);
outras["debito"]=parseFloat(document.getElementById("manual_debito").value);
outras[1]=parseFloat(document.getElementById("manual1").value);

for(let i=2;i<=21;i++){
outras[i]=parseFloat(document.getElementById("manual"+i).value);
}

}else{

outras["pix"]=parseFloat(document.getElementById("out_pix").value);
outras["debito"]=parseFloat(document.getElementById("out_debito").value);
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

let somaMP=0;
let somaOut=0;
let cont=0;

let vitoriaMP=0;
let vitoriaOut=0;

parcelas.forEach(p=>{

let nome=p==="pix"?"Pix":p==="debito"?"Débito":p+"x";

let taxaMP=mp[p];
let taxaOut=outras[p];

let valorMP=liquido(valor,taxaMP);
let valorOut=liquido(valor,taxaOut);

let classeMP="";
let classeOut="";

if(valorMP!==null && valorOut!==null){

cont++;

somaMP+=valorMP;
somaOut+=valorOut;

if(valorMP>valorOut){
classeOut="taxaRuim";
vitoriaMP++;
}

if(valorOut>valorMP){
classeMP="taxaRuim";
vitoriaOut++;
}

}

html+=`<tr>

<td>${nome}</td>

<td class="${classeMP}">${formatarTaxa(taxaMP)}</td>

<td>${valorMP!==null?"R$ "+valorMP.toFixed(2):"Não se aplica"}</td>

<td class="${classeOut}">${formatarTaxa(taxaOut)}</td>

<td>${valorOut!==null?"R$ "+valorOut.toFixed(2):"Não se aplica"}</td>

</tr>`;

});

html+="</table>";

let mediaMP=(cont>0)?(somaMP/cont):0;
let mediaOut=(cont>0)?(somaOut/cont):0;

let vencedor=(mediaMP>mediaOut)?"MERCADO PAGO":"OUTRAS ADQUIRÊNCIAS";

html+=`

<div style="margin-top:20px;padding:15px;border:1px solid #ddd;border-radius:8px">

<h3>🏆 RESULTADO DA COMPARAÇÃO</h3>

<b>Melhor opção geral: ${vencedor}</b>

<br><br>

Vitórias Mercado Pago: ${vitoriaMP}<br>
Vitórias Outros: ${vitoriaOut}

<br><br>

Média líquida MP: R$ ${mediaMP.toFixed(2)}<br>
Média líquida Outros: R$ ${mediaOut.toFixed(2)}

</div>

`;

document.getElementById("resultado").innerHTML=html;

}

function exportar(){

html2canvas(document.getElementById("resultado"),{scale:2}).then(canvas=>{

let link=document.createElement("a");

link.download="comparacao_taxas.png";
link.href=canvas.toDataURL();
link.click();

});

}

/* ========================= */
/* OCR PROFISSIONAL */
/* ========================= */

async function processarOCR(event){

let file=event.target.files[0];
if(!file) return;

document.getElementById("statusOCR").innerText="Processando imagem...";

const worker = await Tesseract.createWorker("eng");

const { data } = await worker.recognize(file);

await worker.terminate();

let texto=data.text.toLowerCase();

console.log("OCR TEXTO:",texto);

/* limpeza de caracteres ruins */

texto=texto
.replace(/o/g,"0")
.replace(/s/g,"5")
.replace(/l/g,"1");

/* regex inteligente */

let regex=/([2-9]|1[0-9]|2[01])\s*x?\s*([0-9]+[.,][0-9]+)/g;

let encontrados=0;
let match;

while((match=regex.exec(texto))!==null){

let parcela=parseInt(match[1]);
let taxa=parseFloat(match[2].replace(",","."));

if(parcela>=2 && parcela<=21){

let campo=document.getElementById("mp"+parcela);

if(campo){

campo.value=taxa.toFixed(2);
encontrados++;

}

}

}

/* fallback caso OCR não encontre parcelas */

if(encontrados===0){

let numeros=texto.match(/[0-9]+[.,][0-9]+/g);

if(numeros){

for(let i=2;i<=21;i++){

if(numeros[i-2]){

document.getElementById("mp"+i).value=
parseFloat(numeros[i-2].replace(",",".")).toFixed(2);

}

}

}

}

document.getElementById("statusOCR").innerText="Taxas carregadas com OCR PRO";

}
