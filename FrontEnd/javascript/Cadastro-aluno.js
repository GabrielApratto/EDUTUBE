document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('.auth-form');

    if (!form) {
        return;
    }

    form.addEventListener('submit', async (evento) => {
        evento.preventDefault();

        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const expertiseField = document.getElementById('expertise');
        const expertise = expertiseField ? expertiseField.value.trim() : '';
        const password = document.getElementById('password').value;

        const dadosAluno = { name, email, expertise, password };

        try {
            const resposta = await fetch('http://localhost:3000/cadastrar-aluno', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dadosAluno)
            });

            const resultado = await resposta.json();

            if (resposta.ok) {
                alert(resultado.mensagem);

                window.location.href = 'login-aluno.html';
            } else {
                alert('Erro: ' + resultado.mensagem);
            }

        } catch (erro) {
            console.error('Erro na requisição:', erro);
            alert('Não foi possível conectar ao servidor. Verifique se ele está rodando.');
        }
    });
});