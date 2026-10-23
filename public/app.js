const aparelhos = [];
const formulario = document.querySelector("#form-aparelho");
const listaAparelhos = document.querySelector("#lista-aparelhos");
const areaResultado = document.querySelector("#resultado");

const campoNome = document.querySelector("#nomeaparelho");
const campoPotencia = document.querySelector("#potencia");
const campoHoras = document.querySelector("#tempo");
const campoDias = document.querySelector("#diasMes");
const botaoLimpar = document.querySelector("#limpar");
const botaoSimular = document.querySelector("#btn-simular");

function desenharListaAparelhos() {
  listaAparelhos.textContent = "";
  aparelhos.forEach((aparelho, indice) => {
    const itemLista = document.createElement("li");
    itemLista.textContent =
      `${indice + 1}. ${aparelho.nome} — ` +
      `${aparelho.potenciaW} W, ` +
      `${aparelho.horasDia} horas por dia, ` +
      `${aparelho.diasMes} dias por mês`;
    listaAparelhos.appendChild(itemLista);
  });
}

formulario.addEventListener("submit", (evento) => {
  evento.preventDefault();
  const aparelho = {
    nome: campoNome.value.trim(),
    potenciaW: Number(campoPotencia.value),
    horasDia: Number(campoHoras.value),
    diasMes: Number(campoDias.value),
  };

  aparelhos.push(aparelho);
  desenharListaAparelhos();
  formulario.reset();
  areaResultado.textContent = "";
});
botaoLimpar.addEventListener("click", () => {
  aparelhos.length = 0;
  desenharListaAparelhos();
  areaResultado.textContent = "";
});

botaoSimular.addEventListener("click", async () => {
  if (aparelhos.length === 0) {
    areaResultado.textContent =
      "Adicione pelo menos um aparelho antes de simular.";
    return;
  }

  areaResultado.textContent = "Calculando o consumo...";

  try {
    const resposta = await fetch("/api/simular", {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        aparelhos: aparelhos,
      }),
    });
    const resultado = await resposta.json();
    if (!resposta.ok) {
      areaResultado.textContent =
        resultado.erro || "Não foi possível realizar a simulação.";
      return;
    }
    areaResultado.textContent = "";

    const tituloResultado = document.createElement("h3");

    tituloResultado.textContent = "Resultado da simulação";

    areaResultado.appendChild(tituloResultado);

    const listaResultados = document.createElement("ul");

    const itensResultado = [
      `Consumo mensal: ${resultado.consumoKwhMes} kWh`,
      `Custo da energia: ${formatarReais(resultado.custoEnergia)}`,
      `Adicional da bandeira: ${formatarReais(resultado.adicionalBandeira)}`,
      `Total mensal: ${formatarReais(resultado.totalMes)}`,
      `Painéis necessários: ${resultado.paineisNecessarios}`,
      `Aparelho de maior consumo: ${resultado.aparelhoMaisCaro.nome}`,
    ];

    itensResultado.forEach((texto) => {
      const item = document.createElement("li");
      item.textContent = texto;
      listaResultados.appendChild(item);
    });

    areaResultado.appendChild(listaResultados);

    const tituloDetalhes = document.createElement("h4");

    tituloDetalhes.textContent = "Detalhes por aparelho";

    areaResultado.appendChild(tituloDetalhes);

    const listaDetalhes = document.createElement("ul");

    resultado.detalhes.forEach((detalhe) => {
      const item = document.createElement("li");
      item.textContent =
        `${detalhe.nome}: ${detalhe.kwhMes} kWh por mês, ` +
        `${formatarReais(detalhe.custo)}, ` +
        `${detalhe.percentual}% do consumo`;

      listaDetalhes.appendChild(item);
    });

    areaResultado.appendChild(listaDetalhes);
  } catch (erro) {
    areaResultado.textContent =
      "Não foi possível conectar ao servidor. Verifique se o Node.js está funcionando.";
    console.error("Erro ao realizar a simulação:", erro);
  }
});

function formatarReais(valor) {
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}
