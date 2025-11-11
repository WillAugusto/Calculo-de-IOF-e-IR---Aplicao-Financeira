// Taxa diária (do seu código original)
const taxaJurosDiaria = 0.000322;

// Tabela IOF (valores em fração: ex 0.96 = 96%)
const TabelaIof = {
  1: 0.96, 2: 0.93, 3: 0.90, 4: 0.86, 5: 0.83,
  6: 0.80, 7: 0.76, 8: 0.73, 9: 0.70, 10: 0.66,
  11: 0.63, 12: 0.60, 13: 0.56, 14: 0.53, 15: 0.50,
  16: 0.46, 17: 0.43, 18: 0.40, 19: 0.36, 20: 0.33,
  21: 0.30, 22: 0.26, 23: 0.23, 24: 0.20, 25: 0.16,
  26: 0.13, 27: 0.10, 28: 0.06, 29: 0.03
};

// retorna a alíquota (fração) do imposto aplicado sobre o lucro bruto
function calculoImpostoAliquota(dias) {
  if (dias < 30) {
    return TabelaIof[dias] ?? 0;
  } else if (dias <= 180) return 0.225;
  else if (dias <= 360) return 0.20;
  else if (dias <= 720) return 0.175;
  else return 0.15;
}

// calcula montante bruto (juros compostos diários)
function montanteBruto(capital, dias) {
  return capital * Math.pow(1 + taxaJurosDiaria, dias);
}

/* ===== lógica do botão e do gráfico ===== */
const btn = document.getElementById('btnCalcular');
const resultadoDiv = document.getElementById('resultado');
const canvas = document.getElementById('graficoRendimento');
const ctx = canvas.getContext('2d');
let grafico = null;

btn.addEventListener('click', () => {
  const capital = parseFloat(document.getElementById('capital').value);
  const dias = parseInt(document.getElementById('dias').value, 10);

  if (isNaN(capital) || capital <= 0 || isNaN(dias) || dias <= 0) {
    alert('Preencha os campos corretamente (capital e dias).');
    return;
  }

  const montante = montanteBruto(capital, dias);
  const lucroBrutoGerado = montante - capital;

  const aliquota = calculoImpostoAliquota(dias);
  const impostoTotal = lucroBrutoGerado * aliquota;

  // separar IOF e IR para exibir
  let iofValor = 0;
  let irValor = 0;
  if (dias < 30) {
    iofValor = impostoTotal;
  } else {
    irValor = impostoTotal;
  }

  const lucroLiquido = lucroBrutoGerado - impostoTotal;
  const valorFinal = capital + lucroLiquido;

  // exibir valores
  resultadoDiv.innerHTML = `
    <strong>Resultados:</strong><br><br>
    Montante bruto total: R$ ${montante.toFixed(2)}<br>
    Lucro bruto: R$ ${lucroBrutoGerado.toFixed(2)}<br>
    IOF: R$ ${iofValor.toFixed(2)}<br>
    IR: R$ ${irValor.toFixed(2)}<br>
    <strong>Lucro líquido: R$ ${lucroLiquido.toFixed(2)}</strong><br>
    <strong>Valor final (capital + líquido): R$ ${valorFinal.toFixed(2)}</strong>
  `;

  // dados para o gráfico
  const labels = ['Capital', 'Lucro Bruto', 'IOF', 'IR', 'Líquido'];
  const dataValues = [
    Number(capital.toFixed(2)),
    Number(lucroBrutoGerado.toFixed(2)),
    Number(iofValor.toFixed(2)),
    Number(irValor.toFixed(2)),
    Number(lucroLiquido.toFixed(2))
  ];

  // destruir gráfico anterior (se existir)
  if (grafico) grafico.destroy();

  grafico = new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: 'Valores (R$)',
        data: dataValues,
        borderWidth: 1,
        backgroundColor: [
          'rgba(0, 255, 204, 0.95)',   // capital - claro
          'rgba(123, 47, 247, 0.9)',   // lucro bruto - roxo
          'rgba(255, 99, 132, 0.95)',  // IOF - vermelho
          'rgba(255, 159, 64, 0.95)',  // IR - laranja
          'rgba(76, 175, 80, 0.95)'    // líquido - verde
        ],
        borderColor: 'rgba(255,255,255,0.08)'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      aspectRatio: 1.6,
      plugins: {
        legend: { display: false },
        tooltip: {
          titleColor: '#000',
          bodyColor: '#000',
          backgroundColor: '#fff',
          borderColor: '#ccc',
          borderWidth: 1
        }
      },
      scales: {
        x: {
          ticks: {
            color: '#fff',
            font: { size: 12 }
          },
          grid: { color: 'rgba(255,255,255,0.05)' }
        },
        y: {
          beginAtZero: true,
          ticks: {
            color: '#fff',
            font: { size: 12 },
            callback: value => 'R$ ' + Number(value).toLocaleString('pt-BR', {minimumFractionDigits:2, maximumFractionDigits:2})
          },
          grid: { color: 'rgba(255,255,255,0.08)' }
        }
      }
    }
  });

});
