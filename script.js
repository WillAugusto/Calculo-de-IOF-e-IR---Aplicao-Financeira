const taxaJurosDiaria = 0.000322;

const TabelaIof = {
  1: 0.96, 2: 0.93, 3: 0.90, 4: 0.86, 5: 0.83,
  6: 0.80, 7: 0.76, 8: 0.73, 9: 0.70, 10: 0.66,
  11: 0.63, 12: 0.60, 13: 0.56, 14: 0.53, 15: 0.50,
  16: 0.46, 17: 0.43, 18: 0.40, 19: 0.36, 20: 0.33,
  21: 0.30, 22: 0.26, 23: 0.23, 24: 0.20, 25: 0.16,
  26: 0.13, 27: 0.10, 28: 0.06, 29: 0.03
};

function calculoImposto(dias) {
  if (dias < 30) {
    return TabelaIof[dias] || 0;
  } else if (dias <= 180) return 0.225;
  else if (dias <= 360) return 0.20;
  else if (dias <= 720) return 0.175;
  else return 0.15;
}

function lucroBruto(capital, dias) {
  return capital * (1 + taxaJurosDiaria) ** dias;
}

function calcular() {
  const capital = parseFloat(document.getElementById("capital").value);
  const dias = parseInt(document.getElementById("dias").value);

  if (isNaN(capital) || isNaN(dias) || capital <= 0 || dias <= 0) {
    alert("Preencha os campos corretamente!");
    return;
  }

  const montanteBruto = lucroBruto(capital, dias);
  const lucroBrutoGerado = montanteBruto - capital;
  const imposto = lucroBrutoGerado * calculoImposto(dias);
  const lucroLiquido = lucroBrutoGerado - imposto;

  document.getElementById("resultado").innerHTML = `
    <strong>Resultados:</strong><br><br>
    Montante bruto total: R$ ${montanteBruto.toFixed(2)}<br>
    Lucro bruto: R$ ${lucroBrutoGerado.toFixed(2)}<br>
    Desconto de imposto: R$ ${imposto.toFixed(2)}<br>
    <strong>Lucro líquido: R$ ${lucroLiquido.toFixed(2)}</strong>
  `;
}
