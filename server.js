const express = require("express");
const { simular } = require("./calculos");

const app = express();
app.use(express.json());
app.use(express.static("public"));

function validarAparelhos(aparelhos) {
  if (!Array.isArray(aparelhos) || aparelhos.length === 0) {
    return "a lista de aparelhos não pode ser vazia";
  }

  for (let i = 0; i < aparelhos.length; i++) {
    const aparelho = aparelhos[i];
    const numero = i + 1;

    if (
      typeof aparelho.potenciaW !== "number" ||
      aparelho.potenciaW < 1 ||
      aparelho.potenciaW > 10000
    ) {
      return `potenciaW deve estar entre 1 e 10000 (aparelho ${numero})`;
    }

    if (
      typeof aparelho.diasMes !== "number" ||
      !Number.isInteger(aparelho.diasMes) ||
      aparelho.diasMes < 1 ||
      aparelho.diasMes > 31
    ) {
      return `diasMes deve ser um inteiro entre 1 e 31 (aparelho ${numero})`;
    }

    if (
      typeof aparelho.horasDia !== "number" ||
      aparelho.horasDia < 0 ||
      aparelho.horasDia > 24
    ) {
      return `horasDia deve estar entre 0 e 24 (aparelho ${numero})`;
    }
    if (!aparelho || typeof aparelho !== "object" || Array.isArray(aparelho)) {
      return `aparelho ${numero} inválido`;
    }

    if (typeof aparelho.nome !== "string" || aparelho.nome.trim() === "") {
      return `nome deve ser um texto (aparelho ${numero})`;
    }
  }
  return null;
}

app.post("/api/simular", (req, res) => {
  const aparelhos = req.body?.aparelhos;
  const erro = validarAparelhos(aparelhos);
  if (erro) {
    return res.status(400).json({ erro });
  }
  const resultado = simular(aparelhos);
  return res.status(200).json(resultado);
});

app.listen(3000, () => console.log("Medidor Coopera em http://localhost:3000"));
