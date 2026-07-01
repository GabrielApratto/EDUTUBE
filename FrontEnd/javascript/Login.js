document.querySelector('.auth-form').addEventListener('submit', function (event) {
    event.preventDefault();

    const emailDigitado = document.getElementById('email').value;
    const senhaDigitada = document.getElementById('password').value;
   

    fetch('/Backend/Profissionais.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Conta não cadastrada');
            }

            const res = response.json();

            return res;
        })
        .then(profissionais => {
console.log(profissionais);
 console.log(emailDigitado, senhaDigitada);
            const usuarioEncontrado = profissionais.find(profissional =>
                profissional.Email === emailDigitado && profissional.Senha === senhaDigitada);
            if (usuarioEncontrado) {
                alert('Login bem-sucedido!');
                window.location.href = 'http://127.0.0.1:5500/FrontEnd/html/Home.html';
            } else {
                alert('Email ou senha incorretos. Tente novamente.');
            }
        });
});