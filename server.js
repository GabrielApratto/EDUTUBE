// server.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import cors from 'cors';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ARQUIVO_PROFISSIONAIS = path.join(__dirname, '..', 'Profissionais.json');
const ARQUIVO_ALUNOS = path.join(__dirname, '..', 'Alunos.json');

app.use(express.json());
app.use(cors({ origin: ['http://127.0.0.1:5500', 'http://localhost:5500'] }));

function carregarDados(arquivo) {
    if (!fs.existsSync(arquivo)) {
        return [];
    }

    const dadosBrutos = fs.readFileSync(arquivo, 'utf-8');
    if (!dadosBrutos.trim()) {
        return [];
    }

    return JSON.parse(dadosBrutos);
}

function salvarDados(arquivo, dados) {
    fs.writeFileSync(arquivo, JSON.stringify(dados, null, 2));
}

function carregarProfissionais() {
    return carregarDados(ARQUIVO_PROFISSIONAIS);
}

function carregarAlunos() {
    return carregarDados(ARQUIVO_ALUNOS);
}

app.post('/cadastrar', (req, res) => {
    const { name, email, expertise, password } = req.body;
    let profissionais = carregarProfissionais();

    const existe = profissionais.find((u) => u.email === email);
    if (existe) {
        return res.status(400).json({ mensagem: 'Profissional já cadastrado' });
    }

    profissionais.push({
        name,
        email,
        expertise,
        password,
    });

    salvarDados(ARQUIVO_PROFISSIONAIS, profissionais);

    res.status(201).json({ mensagem: 'Cadastro realizado com sucesso!' });
});

app.post('/cadastrar-aluno', (req, res) => {
    const { name, email, expertise = '', password } = req.body;
    let alunos = carregarAlunos();

    const existe = alunos.find((u) => u.email === email);
    if (existe) {
        return res.status(400).json({ mensagem: 'Aluno já cadastrado' });
    }

    alunos.push({
        name,
        email,
        expertise,
        password,
    });

    salvarDados(ARQUIVO_ALUNOS, alunos);

    res.status(201).json({ mensagem: 'Cadastro realizado com sucesso!' });
});

app.post('/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ mensagem: 'Email e senha são obrigatórios.' });
    }

    const profissionais = carregarProfissionais();
    const usuarioEncontrado = profissionais.find(
        (profissional) => profissional.email === email && profissional.password === password
    );

    if (usuarioEncontrado) {
        return res.status(200).json({
            mensagem: 'Login bem-sucedido!',
            profissional: {
                name: usuarioEncontrado.name,
                email: usuarioEncontrado.email,
            },
        });
    }

    return res.status(401).json({ mensagem: 'Email ou senha incorretos.' });
});

app.post('/login-aluno', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ mensagem: 'Email e senha são obrigatórios.' });
    }

    const alunos = carregarAlunos();
    const usuarioEncontrado = alunos.find(
        (aluno) => aluno.email === email && aluno.password === password
    );

    if (usuarioEncontrado) {
        return res.status(200).json({
            mensagem: 'Login bem-sucedido!',
            profissional: {
                name: usuarioEncontrado.name,
                email: usuarioEncontrado.email,
            },
        });
    }

    return res.status(401).json({ mensagem: 'Email ou senha incorretos.' });
});

app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000 (http://localhost:3000)');
});

