document.addEventListener('DOMContentLoaded', () => {
    const userNameElements = document.querySelectorAll('[data-user-name]');
    const profileNameElement = document.querySelector('[data-profile-name]');
    const userEmailElements = document.querySelectorAll('[data-user-email]');
    const profileEmailElement = document.querySelector('[data-profile-email]');
    const userExpertiseElements = document.querySelectorAll('[data-user-expertise]');
    const profileExpertiseElement = document.querySelector('[data-profile-expertise]');
    const userAvatarElements = document.querySelectorAll('[data-user-avatar]');

    const temAlvo = userNameElements.length > 0 || profileNameElement || userEmailElements.length > 0 || profileEmailElement || userExpertiseElements.length > 0 || profileExpertiseElement || userAvatarElements.length > 0;

    if (!temAlvo) {
        return;
    }

    const usuarioSalvo = localStorage.getItem('usuarioAtual');
    const nomePadrao = 'Usuário';
    const emailPadrao = 'Não informado';
    const expertisePadrao = 'Não informado';

    let usuario = {};

    if (usuarioSalvo) {
        try {
            usuario = JSON.parse(usuarioSalvo);
        } catch (erro) {
            console.error('Erro ao carregar usuário:', erro);
        }
    }

    const nomeExibido = usuario.name || usuario.email || nomePadrao;
    const emailExibido = usuario.email || emailPadrao;
    const expertiseExibida = usuario.expertise || expertisePadrao;

    userNameElements.forEach((elemento) => {
        elemento.textContent = nomeExibido;
    });

    if (profileNameElement) {
        profileNameElement.textContent = nomeExibido;
    }

    userEmailElements.forEach((elemento) => {
        elemento.textContent = emailExibido;
    });

    if (profileEmailElement) {
        profileEmailElement.textContent = emailExibido;
    }

    userExpertiseElements.forEach((elemento) => {
        elemento.textContent = expertiseExibida;
    });

    if (profileExpertiseElement) {
        profileExpertiseElement.textContent = expertiseExibida;
    }

    userAvatarElements.forEach((elemento) => {
        if (usuario.avatar) {
            elemento.src = usuario.avatar;
        }
    });

    const saveUsuarioAtual = (dados) => {
        localStorage.setItem('usuarioAtual', JSON.stringify(dados));
    };

    const atualizarPerfilNoServidor = async (dados) => {
        if (!usuario.email) {
            return;
        }

        try {
            const resposta = await fetch('http://localhost:3000/profissional', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ currentEmail: usuario.email, ...dados }),
            });

            if (!resposta.ok) {
                const erro = await resposta.json();
                console.error('Falha ao atualizar servidor:', erro.mensagem || resposta.statusText);
            }
        } catch (erro) {
            console.error('Erro ao conectar com o servidor:', erro);
        }
    };

    const editExpertiseButtons = document.querySelectorAll('[data-edit-expertise]');
    const editEmailButtons = document.querySelectorAll('[data-edit-email]');

    const atualizaExpertise = async (valor) => {
        usuario.expertise = valor;
        saveUsuarioAtual(usuario);
        userExpertiseElements.forEach((elemento) => {
            elemento.textContent = valor || expertisePadrao;
        });
        if (profileExpertiseElement) {
            profileExpertiseElement.textContent = valor || expertisePadrao;
        }
        await atualizarPerfilNoServidor({ expertise: valor });
    };

    const atualizaEmail = async (valor) => {
        const emailAnterior = usuario.email;
        usuario.email = valor;
        saveUsuarioAtual(usuario);
        userEmailElements.forEach((elemento) => {
            elemento.textContent = valor || emailPadrao;
        });
        if (profileEmailElement) {
            profileEmailElement.textContent = valor || emailPadrao;
        }
        if (profileNameElement && !usuario.name) {
            profileNameElement.textContent = valor || nomePadrao;
        }
        await atualizarPerfilNoServidor({ email: valor });
        usuario.email = valor || emailAnterior;
    };

    editExpertiseButtons.forEach((botao) => {
        botao.addEventListener('click', async () => {
            const novoValor = prompt('Informe sua área de atuação:', usuario.expertise || '');
            if (novoValor === null) {
                return;
            }
            await atualizaExpertise(novoValor.trim());
        });
    });

    editEmailButtons.forEach((botao) => {
        botao.addEventListener('click', async () => {
            const novoEmail = prompt('Informe seu e-mail profissional:', usuario.email || '');
            if (novoEmail === null) {
                return;
            }
            await atualizaEmail(novoEmail.trim());
        });
    });
});
