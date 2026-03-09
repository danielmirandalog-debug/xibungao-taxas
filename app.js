window.onload=function(){
  let campos="";
  for(let i=2;i<=18;i++){
    campos+=`<label>${i}x (%)</label><input id="mp${i}" type="number">`;
  }
  document.getElementById("camposMP").innerHTML=campos;
  document.getElementById("img").addEventListener("change",lerImagem);
}

function trocarTipo(){
  let tipo=document.getElementById("tipo").value;
  document.getElementById("taxas-mp").style.display = (tipo=="mp") ? "block" : "none";
  document.getElementById("taxas-outras").style.display = (tipo=="outras") ? "block" : "none";
}

async function lerImagem(e){
  let arquivo = e.target.files[0];
  if(!arquivo) return;
  let resultado = await Tesseract.recognize(arquivo,'por');
  let texto = resultado.data.text;
  let numeros = texto.match(/[\d]+[.,][\d]+/g);
  if(!numeros) return alert("Não consegui identificar as taxas");
  let parcela=2;
  numeros.forEach(n=>{
    if(parcela<=18){
      let campo=document.getElementById("mp"+parcela);
      if(campo) campo.value = n.replace(",",".");
      parcela++;
    }
  });
  alert("Taxas preenchidas automaticamente");
}

function calcular(){
  let valor=parseFloat(document.getElementById("valor").value);
  if(!valor) return alert("Digite um valor");
  let tipo=document.getElementById("tipo").value;
  let html="<table><tr><th>Tipo</th><th>Taxa</th><th>Valor Final</th></tr>";

  if(tipo=="outras"){
    let pix=parseFloat(document.getElementById("pix").value)||0;
    let debito=parseFloat(document.getElementById("debito").value)||0;
    let mdr=parseFloat(document.getElementById("mdr").value)||0;
    let credito1x=parseFloat(document.getElementById("credito1x").value)||mdr;
    let taxa1=parseFloat(document.getElementById("taxa1").value)||0;
    let taxa2=parseFloat(document.getElementById("taxa2").value)||0;
    let taxa3=parseFloat(document.getElementById("taxa3").value)||0;

    function linha(nome,taxa){
      let liquido = valor * (1 - taxa/100);
      html+=`<tr><td>${nome}</td><td>${taxa.toFixed(2)}%</td><td>R$ ${liquido.toFixed(2)}</td></tr>`;
    }

    linha("Pix",pix);
    linha("Débito",debito);
    linha("Crédito 1x",credito1x);

    for(let i=2;i<=6;i++) linha(i+"x",mdr+taxa1);
    for(let i=7;i<=12;i++) linha(i+"x",mdr+taxa2);
    for(let i=13;i<=21;i++) linha(i+"x",mdr+taxa3);
  }

  if(tipo=="mp"){
    let pix=parseFloat(document.getElementById("mp_pix").value)||0;
    let debito=parseFloat(document.getElementById("mp_debito").value)||0;
    let taxa1x=parseFloat(document.getElementById("mp1").value)||0;

    function linhaMP(nome,taxa){
      let liquido = valor * (1 - taxa/100);
      html+=`<tr><td>${nome}</td><td>${taxa.toFixed(2)}%</td><td>R$ ${liquido.toFixed(2)}</td></tr>`;
    }

    linhaMP("Pix",pix);
    linhaMP("Débito",debito);
    linhaMP("1x",taxa1x);

    for(let i=2;i<=18;i++){
      let t=parseFloat(document.getElementById("mp"+i).value)||0;
      linhaMP(i+"x",t);
    }
  }

  html+="</table>";
  document.getElementById("resultado").innerHTML = html;
}

function gerarTextoWhatsApp(){
  let linhas = [];
  let tipo = document.getElementById("tipo").value;
  let valor = parseFloat(document.getElementById("valor").value).toFixed(2);
  linhas.push("💳 XIBUNGÃO TAXAS");
  linhas.push("Valor da venda: R$ "+valor);
  linhas.push("----------------------------");

  function addLinha(nome,taxa,valorLiquido){
    let linha = nome.padEnd(10,' ') + " | " + taxa.toFixed(2).padStart(5,' ')+"% | R$ "+valorLiquido.toFixed(2);
    linhas.push(linha);
  }

  let valorNum = parseFloat(document.getElementById("valor").value);

  if(tipo=="outras"){
    let pix=parseFloat(document.getElementById("pix").value)||0;
    let debito=parseFloat(document.getElementById("debito").value)||0;
    let mdr=parseFloat(document.getElementById("mdr").value)||0;
    let credito1x=parseFloat(document.getElementById("credito1x").value)||mdr;
    let taxa1=parseFloat(document.getElementById("taxa1").value)||0;
    let taxa2=parseFloat(document.getElementById("taxa2").value)||0;
    let taxa3=parseFloat(document.getElementById("taxa3").value)||0;

    addLinha("Pix",pix,valorNum*(1-pix/100));
    addLinha("Débito",debito,valorNum*(1-debito/100));
    addLinha("1x",credito1x,valorNum*(1-credito1x/100));

    for(let i=2;i<=6;i++) addLinha(i+"x",mdr+taxa1,valorNum*(1-(mdr+taxa1)/100));
    for(let i=7;i<=12;i++) addLinha(i+"x",mdr+taxa2,valorNum*(1-(mdr+taxa2)/100));
    for(let i=13;i<=21;i++) addLinha(i+"x",mdr+taxa3,valorNum*(1-(mdr+taxa3)/100));
  }

  if(tipo=="mp"){
    let pix=parseFloat(document.getElementById("mp_pix").value)||0;
    let debito=parseFloat(document.getElementById("mp_debito").value)||0;
    let taxa1x=parseFloat(document.getElementById("mp1").value)||0;

    addLinha("Pix",pix,valorNum*(1-pix/100));
    addLinha("Débito",debito,valorNum*(1-debito/100));
    addLinha("1x",taxa1x,valorNum*(1-taxa1x/100));

    for(let i=2;i<=18;i++){
      let t=parseFloat(document.getElementById("mp"+i).value)||0;
      addLinha(i+"x",t,valorNum*(1-t/100));
    }
  }

  return linhas.join("\n");
}

function compartilhar(){
  let texto = gerarTextoWhatsApp();
  if(navigator.share){
    navigator.share({title:"Simulação XIBUNGÃO TAXAS", text:texto});
  } else {
    navigator.clipboard.writeText(texto);
    alert("Texto copiado! Agora cole no WhatsApp ou outro app.");
  }
}
