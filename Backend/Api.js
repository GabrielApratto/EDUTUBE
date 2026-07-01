import express from "express";

const app = express();
const PORT = 3000;
const objResponse = [
    { Nome: "Wagner", Profissao: "paleontologo", Idade: "49", areAtuacao: "Ciencias da natureza" },
    { Nome: "Pamela", Profissao: "Musicista", Idade: "29", areAtuacao: "Ciencias humanas" }
];

app.listen(PORT, () =>
    console.log(`Servidor rodando na porta ${PORT}`));

app.get("/", (req, res) => {
    res.json(objResponse);

})