const config = require("./config");
function arredondar(valor) {
  return Math.round(valor * 100) / 100;
}
function consumoMensalKwh(aparelho) {
  return (aparelho.potenciaW * aparelho.horasDia * aparelho.diasMes) / 1000;
}

function custoEnergia(kwh) {
  return kwh * config.TARIFA_KWH;
}

function adicionalBandeira(kwh) {
  const valorBandeira = config.VALORES_BANDEIRA[config.BANDEIRA];
  return (kwh / 100) * valorBandeira;
}

function paineisNecessarios(kwh) {
  const geracaoPorPainel =
    (config.POTENCIA_PAINEL_W / 1000) * config.HSP * 30 * config.EFICIENCIA;
  return Math.ceil(kwh / geracaoPorPainel);
}

function simular(aparelhos) {
  const itens = aparelhos.map((aparelho) => ({
    nome: aparelho.nome,
    kwh: consumoMensalKwh(aparelho),
  }));

  const consumoTotal = itens.reduce((soma, item) => soma + item.kwh, 0);
  const energia = custoEnergia(consumoTotal);
  const bandeira = adicionalBandeira(consumoTotal);

  const detalhes = itens.map((item) => ({
    nome: item.nome,
    kwhMes: arredondar(item.kwh),
    custo: arredondar(custoEnergia(item.kwh)),
    percentual:
      consumoTotal > 0 ? arredondar((item.kwh / consumoTotal) * 100) : 0,
  }));

  const maisCaro = itens.reduce((maior, item) =>
    item.kwh > maior.kwh ? item : maior,
  );

  return {
    consumoKwhMes: arredondar(consumoTotal),
    custoEnergia: arredondar(energia),
    adicionalBandeira: arredondar(bandeira),
    totalMes: arredondar(energia + bandeira),
    paineisNecessarios: paineisNecessarios(consumoTotal),
    aparelhoMaisCaro: {
      nome: maisCaro.nome,
      custo: arredondar(custoEnergia(maisCaro.kwh)),
    },
    detalhes: detalhes,
  };
}

module.exports = {
  consumoMensalKwh,
  custoEnergia,
  adicionalBandeira,
  paineisNecessarios,
  simular,
};
