// server.js
const express = require("express");
const { simular } = require("./calculos");

const app = express();
app.use(express.json());
app.use(express.static("public"));

app.post("/api/simular", (req, res) => {
  // Requisição: POST /api/simular
{ "aparelhos": [
    { "nome": "Geladeira", "potenciaW": 150, "horasDia": 24, "diasMes": 30 }
] }

// Resposta 200
{ "consumoKwhMes": 108, "custoEnergia": 86.4, "adicionalBandeira": 2.04,
  "totalMes": 88.44, "paineisNecessarios": 3,
  "aparelhoMaisCaro": { "nome": "Geladeira", "custo": 86.4 },
  "detalhes": [ { "nome": "Geladeira", "kwhMes": 108, "custo": 86.4, "percentual": 100 } ] }

// Resposta 400
{ "erro": "horasDia deve estar entre 0 e 24 (aparelho 1)" }
  // TODO 1: ler req.body.aparelhos
  // TODO 2: validar; se inválido: return res.status(400).json({ erro: '...' })
  // TODO 3: res.json(simular(aparelhos))
});

app.listen(3000, () => console.log("Medidor Coopera em http://localhost:3000"));  
