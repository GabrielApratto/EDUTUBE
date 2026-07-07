document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('.auth-form');

    if (!form) {
        return;
    }

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const emailDigitado = document.getElementById('email').value.trim();
        const senhaDigitada = document.getElementById('password').value;

        try {
            const resposta = await fetch('http://localhost:3000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: emailDigitado,
                    password: senhaDigitada
                })
            });

            const resultado = await resposta.json();

            if (resposta.ok) {
                const usuarioLogado = resultado.profissional || {};
                localStorage.setItem('usuarioAtual', JSON.stringify({
                    name: usuarioLogado.name || usuarioLogado.email || 'Usuário',
                    email: usuarioLogado.email || '',
                    expertise: usuarioLogado.expertise || '',
                    avatar: usuarioLogado.avatar || ''
                }));

                alert(resultado.mensagem);
                window.location.href = 'Home.html';
            } else {
                alert(resultado.mensagem || 'Email ou senha incorretos.');
            }
        } catch (erro) {
            console.error('Erro ao realizar login:', erro);
            alert('Não foi possível conectar ao servidor.');
        }
    });
});