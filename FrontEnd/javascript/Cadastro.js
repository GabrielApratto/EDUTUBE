document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('.auth-form');

    if (!form) {
        return;
    }

    form.addEventListener('submit', async (evento) => {
        evento.preventDefault();

        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const expertise = document.getElementById('expertise').value.trim();
        const password = document.getElementById('password').value;

        const dadosProfissional = { name, email, expertise, password };

        try {
            const resposta = await fetch('http://localhost:3000/cadastrar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dadosProfissional)
            });

            const resultado = await resposta.json();

            if (resposta.ok) {
                alert(resultado.mensagem);

                window.location.href = 'Login.html';
            } else {
                alert('Erro: ' + resultado.mensagem);
            }

        } catch (erro) {
            console.error('Erro na requisição:', erro);
            alert('Não foi possível conectar ao servidor. Verifique se ele está rodando.');
        }
    });
});