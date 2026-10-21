const config = require("./config");

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
}

module.exports = {
  consumoMensalKwh,
  custoEnergia,
  adicionalBandeira,
  paineisNecessarios,
  simular,
};
